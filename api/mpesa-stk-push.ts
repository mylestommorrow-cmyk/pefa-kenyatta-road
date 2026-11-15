/**
 * Serverless M-Pesa Daraja STK Push Handler (Vercel / Netlify Edge-compatible Node handler)
 * Keep all Daraja keys in server-side environment variables — NEVER expose to the browser.
 */
import {createClient} from '@supabase/supabase-js';

interface StkPushBody {
  phone: string;
  amount: number;
  fund: string;
  donorName?: string;
  consentGiven: boolean;
  userId?: string | null;
}

export function normalizeKenyanPhone(raw: string): string {
  const digits = raw.replace(/\D/g, '');
  if (digits.startsWith('254') && digits.length === 12) return digits;
  if (digits.startsWith('0') && digits.length === 10) return `254${digits.slice(1)}`;
  if (digits.startsWith('7') || digits.startsWith('1')) {
    if (digits.length === 9) return `254${digits}`;
  }
  throw new Error('Enter a valid Kenyan Safaricom/Airtel phone number (e.g. 0712 345 678).');
}

function formatDarajaTimestamp(date = new Date()): string {
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${date.getFullYear()}${pad(date.getMonth() + 1)}${pad(date.getDate())}${pad(date.getHours())}${pad(date.getMinutes())}${pad(date.getSeconds())}`;
}

export default async function handler(req: {method?: string; body?: StkPushBody}, res: {status: (code: number) => {json: (data: unknown) => void}}) {
  if (req.method !== 'POST') {
    return res.status(405).json({error: 'Method not allowed'});
  }

  try {
    const body = req.body;
    if (!body?.consentGiven) {
      return res.status(400).json({error: 'Please accept the Data Protection notice before proceeding.'});
    }

    const amount = Math.round(Number(body.amount));
    if (!Number.isFinite(amount) || amount < 1 || amount > 150000) {
      return res.status(400).json({error: 'Amount must be between KES 1 and KES 150,000.'});
    }

    const phone = normalizeKenyanPhone(body.phone);
    const fund = body.fund || 'Offering';

    const env = process.env.MPESA_ENV === 'production' ? 'production' : 'sandbox';
    const baseUrl = env === 'production' ? 'https://api.safaricom.co.ke' : 'https://sandbox.safaricom.co.ke';
    const consumerKey = process.env.MPESA_CONSUMER_KEY;
    const consumerSecret = process.env.MPESA_CONSUMER_SECRET;
    const shortcode = process.env.MPESA_SHORTCODE || '174379';
    const passkey = process.env.MPESA_PASSKEY;
    const callbackUrl = process.env.MPESA_CALLBACK_URL || `${process.env.APP_URL}/api/mpesa/callback`;

    if (!consumerKey || !consumerSecret || !passkey) {
      return res.status(500).json({error: 'M-Pesa Daraja credentials are not configured on the server.'});
    }

    // 1. Fetch OAuth token from Safaricom Daraja
    const auth = Buffer.from(`${consumerKey}:${consumerSecret}`).toString('base64');
    const tokenRes = await fetch(`${baseUrl}/oauth/v1/generate?grant_type=client_credentials`, {
      headers: {Authorization: `Basic ${auth}`},
    });
    if (!tokenRes.ok) {
      throw new Error('Failed to authenticate with Safaricom Daraja API.');
    }
    const tokenJson = (await tokenRes.json()) as {access_token: string};

    // 2. Build STK Push password & payload
    const timestamp = formatDarajaTimestamp();
    const password = Buffer.from(`${shortcode}${passkey}${timestamp}`).toString('base64');
    const accountRef = `PEFA-${fund.toUpperCase().replace(/\s+/g, '').slice(0, 8)}`;

    const stkRes = await fetch(`${baseUrl}/mpesa/stkpush/v1/processrequest`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${tokenJson.access_token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        BusinessShortCode: shortcode,
        Password: password,
        Timestamp: timestamp,
        TransactionType: process.env.MPESA_TRANSACTION_TYPE || 'CustomerPayBillOnline',
        Amount: amount,
        PartyA: phone,
        PartyB: shortcode,
        PhoneNumber: phone,
        CallBackURL: callbackUrl,
        AccountReference: accountRef,
        TransactionDesc: `PEFA Kenyatta ${fund}`,
      }),
    });

    const stkData = (await stkRes.json()) as {
      ResponseCode?: string;
      ResponseDescription?: string;
      MerchantRequestID?: string;
      CheckoutRequestID?: string;
      errorMessage?: string;
    };

    if (!stkRes.ok || stkData.ResponseCode !== '0') {
      return res.status(400).json({error: stkData.errorMessage || stkData.ResponseDescription || 'STK Push failed'});
    }

    // 3. Record pending donation in Supabase using Service Role Key
    if (process.env.VITE_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY) {
      const supabaseAdmin = createClient(process.env.VITE_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
      await supabaseAdmin.from('donations').insert({
        user_id: body.userId || null,
        donor_name: body.donorName || null,
        phone,
        amount,
        fund,
        merchant_request_id: stkData.MerchantRequestID,
        checkout_request_id: stkData.CheckoutRequestID,
        status: 'pending',
        consent_given: true,
      });
    }

    return res.status(200).json({
      ok: true,
      checkoutRequestId: stkData.CheckoutRequestID,
      merchantRequestId: stkData.MerchantRequestID,
      customerMessage: 'Check your phone and enter your M-Pesa PIN to complete giving.',
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unable to initiate M-Pesa payment.';
    return res.status(400).json({error: message});
  }
}
