/**
 * Serverless M-Pesa Daraja STK Callback Handler
 * Safaricom posts transaction completion/cancellation details here.
 */
import {createClient} from '@supabase/supabase-js';

interface CallbackMetadataItem {
  Name: string;
  Value?: string | number;
}

interface DarajaCallbackBody {
  Body?: {
    stkCallback?: {
      MerchantRequestID: string;
      CheckoutRequestID: string;
      ResultCode: number;
      ResultDesc: string;
      CallbackMetadata?: {
        Item: CallbackMetadataItem[];
      };
    };
  };
}

export default async function handler(req: {method?: string; body?: DarajaCallbackBody}, res: {status: (code: number) => {json: (data: unknown) => void}}) {
  if (req.method !== 'POST') {
    return res.status(405).json({error: 'Method not allowed'});
  }

  const callback = req.body?.Body?.stkCallback;
  if (!callback) {
    return res.status(400).json({ResultCode: 1, ResultDesc: 'Invalid callback payload'});
  }

  const isSuccess = callback.ResultCode === 0;
  const items = callback.CallbackMetadata?.Item || [];
  const receipt = items.find((i) => i.Name === 'MpesaReceiptNumber')?.Value;

  if (process.env.VITE_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY) {
    const supabaseAdmin = createClient(process.env.VITE_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
    await supabaseAdmin
      .from('donations')
      .update({
        status: isSuccess ? 'completed' : callback.ResultCode === 1032 ? 'cancelled' : 'failed',
        mpesa_receipt_number: receipt ? String(receipt) : null,
        result_desc: callback.ResultDesc,
        updated_at: new Date().toISOString(),
      })
      .eq('checkout_request_id', callback.CheckoutRequestID);
  }

  return res.status(200).json({ResultCode: 0, ResultDesc: 'Accepted'});
}
