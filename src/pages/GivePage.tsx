import React, {useEffect, useState} from 'react';
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Copy,
  Loader2,
  ShieldCheck,
  Smartphone,
  XCircle,
} from 'lucide-react';
import {CHURCH_CONFIG} from '../config/church';
import {useApp} from '../context/AppContext';
import {initiateMpesaStkPush, pollMpesaStatus} from '../lib/dataService';
import {ConsentCheckbox} from '../components/ConsentCheckbox';
import {Button, Card, Input} from '../components/ui';
import type {DonationFund, DonationRecord} from '../types/church';

const FUNDS: DonationFund[] = ['Tithe', 'Offering', 'Building Fund', 'Missions', 'Welfare', 'Other'];
const QUICK_AMOUNTS = [100, 500, 1000, 5000];

function validateKenyanPhoneInput(raw: string): string {
  const digits = raw.replace(/\D/g, '');
  const valid =
    (digits.startsWith('0') && digits.length === 10) ||
    (digits.startsWith('254') && digits.length === 12) ||
    ((digits.startsWith('7') || digits.startsWith('1')) && digits.length === 9);
  return valid ? '' : 'Enter a valid Kenyan mobile number (e.g. 0712 345 678).';
}

export const GivePage: React.FC = () => {
  const {lang, user, showToast} = useApp();
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [amount, setAmount] = useState('1000');
  const [amountError, setAmountError] = useState('');
  const [fund, setFund] = useState<DonationFund>('Tithe');
  const [phone, setPhone] = useState(user?.phone || '');
  const [phoneError, setPhoneError] = useState('');
  const [donorName, setDonorName] = useState(user?.full_name || '');
  const [consent, setConsent] = useState(false);

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [checkoutId, setCheckoutId] = useState<string | null>(null);
  const [txRecord, setTxRecord] = useState<DonationRecord | null>(null);
  const [copiedPaybill, setCopiedPaybill] = useState(false);

  useEffect(() => {
    if (!checkoutId || (txRecord && txRecord.status !== 'pending')) return;
    const timer = setInterval(async () => {
      try {
        const latest = await pollMpesaStatus(checkoutId);
        setTxRecord(latest);
        if (latest.status !== 'pending') {
          clearInterval(timer);
        }
      } catch {
        // Keep polling briefly until status settles
      }
    }, 1500);
    return () => clearInterval(timer);
  }, [checkoutId, txRecord]);

  const goStep2 = () => {
    const amt = Number(amount);
    if (!Number.isFinite(amt) || amt < 1 || amt > 150000) {
      setAmountError('Enter an amount between KES 1 and KES 150,000.');
      return;
    }
    setAmountError('');
    setStep(2);
  };

  const goStep3 = () => {
    const err = validateKenyanPhoneInput(phone);
    if (err) {
      setPhoneError(err);
      return;
    }
    setPhoneError('');
    setStep(3);
  };

  const handleGive = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    setTxRecord(null);
    setCheckoutId(null);

    try {
      const res = await initiateMpesaStkPush({
        phone: phone.trim(),
        amount: Number(amount),
        fund,
        donorName: donorName.trim() || undefined,
        consentGiven: consent,
        userId: user?.id || null,
      });
      if (res.checkoutRequestId) setCheckoutId(res.checkoutRequestId);
      if (res.record) setTxRecord(res.record);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to send M-Pesa STK Push.');
    } finally {
      setSubmitting(false);
    }
  };

  const resetFlow = () => {
    setTxRecord(null);
    setCheckoutId(null);
    setError('');
    setStep(1);
  };

  const copyPaybill = () => {
    navigator.clipboard?.writeText(CHURCH_CONFIG.mpesa.paybill);
    setCopiedPaybill(true);
    showToast('Paybill 522522 copied to clipboard.');
    setTimeout(() => setCopiedPaybill(false), 2000);
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <div className="max-w-2xl">
        <p className="text-xs font-semibold text-[#1E3A8A] dark:text-amber-400">
          {lang === 'sw' ? 'Utoaji wa M-Pesa' : 'M-Pesa Generosity & Stewardship'}
        </p>
        <h1 className="mt-2 font-display text-3xl font-bold text-slate-900 dark:text-white sm:text-4xl">
          {lang === 'sw' ? 'Toa Sadaka au Zaka kwa M-Pesa' : 'Give in 3 simple steps via M-Pesa'}
        </h1>
        <p className="mt-3 max-w-[65ch] text-base leading-relaxed text-slate-600 dark:text-slate-300">
          Safe, fast M-Pesa STK Push. Your PIN stays strictly on your phone, and an official Safaricom receipt is recorded immediately.
        </p>
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-12">
        <Card padding="lg" className="lg:col-span-7">
          {txRecord ? (
            <div className="space-y-5">
              {txRecord.status === 'pending' && (
                <div className="rounded-xl border border-amber-200 bg-amber-50 p-6 dark:border-amber-800/60 dark:bg-amber-950/40">
                  <div className="flex items-center gap-3">
                    <Loader2 className="h-5 w-5 animate-spin text-amber-700 dark:text-amber-400" />
                    <h2 className="text-lg font-bold text-amber-950 dark:text-amber-200">
                      Check your phone for the M-Pesa prompt
                    </h2>
                  </div>
                  <p className="mt-2 text-base text-amber-900 dark:text-amber-100">
                    Enter your M-Pesa PIN for{' '}
                    <span className="font-mono-tabular font-bold">KES {Number(txRecord.amount).toLocaleString()}</span>{' '}
                    ({txRecord.fund}) sent to <span className="font-mono-tabular">{txRecord.phone}</span>.
                  </p>
                </div>
              )}

              {txRecord.status === 'completed' && (
                <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-6 dark:border-emerald-900/60 dark:bg-emerald-950/40">
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="h-6 w-6 text-emerald-700 dark:text-emerald-400" />
                    <h2 className="text-xl font-bold text-emerald-950 dark:text-emerald-200">
                      Asante! Giving confirmed
                    </h2>
                  </div>
                  <dl className="mt-4 grid grid-cols-2 gap-4 text-sm sm:grid-cols-3">
                    <div>
                      <dt className="text-emerald-800/80 dark:text-emerald-300/80">Amount</dt>
                      <dd className="mt-0.5 font-mono-tabular text-base font-bold text-emerald-950 dark:text-white">
                        KES {Number(txRecord.amount).toLocaleString()}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-emerald-800/80 dark:text-emerald-300/80">Fund</dt>
                      <dd className="mt-0.5 text-base font-semibold text-emerald-950 dark:text-white">
                        {txRecord.fund}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-emerald-800/80 dark:text-emerald-300/80">M-Pesa Receipt</dt>
                      <dd className="mt-0.5 font-mono-tabular text-base font-bold text-emerald-950 dark:text-white">
                        {txRecord.mpesa_receipt_number || 'CONFIRMED'}
                      </dd>
                    </div>
                  </dl>
                  <p className="mt-4 text-xs text-emerald-900 dark:text-emerald-200">
                    Your receipt is saved in your Member Portal under your phone number.
                  </p>
                  <div className="mt-5">
                    <Button onClick={resetFlow}>Give another offering</Button>
                  </div>
                </div>
              )}

              {(txRecord.status === 'failed' || txRecord.status === 'cancelled') && (
                <div className="rounded-xl border border-red-200 bg-red-50 p-6 dark:border-red-900/60 dark:bg-red-950/40">
                  <div className="flex items-center gap-3">
                    <XCircle className="h-5 w-5 text-red-700 dark:text-red-400" />
                    <h2 className="text-lg font-bold text-red-950 dark:text-red-200">
                      Payment not completed ({txRecord.status})
                    </h2>
                  </div>
                  <p className="mt-2 text-base text-red-900 dark:text-red-100">
                    {txRecord.result_desc || 'The M-Pesa prompt was cancelled or timed out. You can retry right away.'}
                  </p>
                  <div className="mt-4 flex flex-wrap gap-3">
                    <Button onClick={resetFlow}>Retry M-Pesa Prompt</Button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div>
              {/* 3-Step Indicator */}
              <ol className="mb-6 grid grid-cols-3 gap-2 border-b border-slate-200 pb-4 text-xs font-semibold dark:border-slate-800">
                <li className={step >= 1 ? 'text-[#1E3A8A] dark:text-amber-400' : 'text-slate-400'}>
                  1. Amount &amp; Fund
                </li>
                <li className={step >= 2 ? 'text-[#1E3A8A] dark:text-amber-400' : 'text-slate-400'}>
                  2. M-Pesa Phone
                </li>
                <li className={step === 3 ? 'text-[#1E3A8A] dark:text-amber-400' : 'text-slate-400'}>
                  3. Confirm
                </li>
              </ol>

              {error && (
                <div role="alert" className="mb-4 rounded-xl border border-red-200 bg-red-50 p-3 text-sm font-medium text-red-800 dark:border-red-900/60 dark:bg-red-950/40 dark:text-red-200">
                  {error}
                </div>
              )}

              {step === 1 && (
                <div className="space-y-6">
                  <div>
                    <p className="text-xs font-semibold text-slate-700 dark:text-slate-200">Choose Fund</p>
                    <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-3">
                      {FUNDS.map((f) => (
                        <button
                          key={f}
                          type="button"
                          onClick={() => setFund(f)}
                          className={`min-h-[44px] rounded-xl border px-3 text-xs font-semibold transition ${
                            fund === f
                              ? 'border-[#1E3A8A] bg-[#1E3A8A] text-white dark:border-amber-500 dark:bg-amber-500 dark:text-slate-950'
                              : 'border-slate-200 bg-[#FAFBFD] text-slate-700 hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200'
                          }`}
                        >
                          {f}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <p className="text-xs font-semibold text-slate-700 dark:text-slate-200">Quick Amount (KES)</p>
                    <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-4">
                      {QUICK_AMOUNTS.map((amt) => (
                        <button
                          key={amt}
                          type="button"
                          onClick={() => {
                            setAmount(String(amt));
                            setAmountError('');
                          }}
                          className={`min-h-[44px] rounded-xl border px-3 font-mono-tabular text-xs font-semibold transition ${
                            Number(amount) === amt
                              ? 'border-amber-500 bg-amber-50 text-amber-900 dark:bg-amber-950/50 dark:text-amber-300'
                              : 'border-slate-200 bg-white text-slate-700 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300'
                          }`}
                        >
                          KES {amt.toLocaleString()}
                        </button>
                      ))}
                    </div>
                  </div>

                  <Input
                    label="Or Enter Custom Amount (KES) *"
                    type="number"
                    min={1}
                    max={150000}
                    value={amount}
                    error={amountError}
                    onChange={(e) => {
                      setAmount(e.target.value);
                      setAmountError('');
                    }}
                    className="font-mono-tabular font-semibold"
                  />

                  <Button fullWidth size="lg" onClick={goStep2}>
                    <span>Continue to Phone Number</span>
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-5">
                  <Input
                    label="Safaricom / Airtel M-Pesa Phone Number *"
                    type="tel"
                    value={phone}
                    error={phoneError}
                    hint="We will send the STK PIN prompt directly to this phone."
                    onChange={(e) => {
                      setPhone(e.target.value);
                      if (phoneError) setPhoneError('');
                    }}
                    placeholder="0712 345 678"
                    className="font-mono-tabular"
                  />
                  <Input
                    label="Your Name (Optional)"
                    type="text"
                    value={donorName}
                    onChange={(e) => setDonorName(e.target.value)}
                    placeholder="For your church giving receipt"
                  />

                  <div className="flex gap-3">
                    <Button variant="secondary" onClick={() => setStep(1)}>
                      <ArrowLeft className="h-4 w-4" />
                      <span>Back</span>
                    </Button>
                    <Button fullWidth size="lg" onClick={goStep3}>
                      <span>Review &amp; Confirm</span>
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}

              {step === 3 && (
                <form onSubmit={handleGive} className="space-y-5">
                  <div className="rounded-xl border border-slate-200 bg-[#FAFBFD] p-4 dark:border-slate-800 dark:bg-slate-950">
                    <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">Summary</p>
                    <dl className="mt-2 grid grid-cols-2 gap-3 text-sm sm:grid-cols-3">
                      <div>
                        <dt className="text-xs text-slate-500">Fund</dt>
                        <dd className="font-semibold text-slate-900 dark:text-white">{fund}</dd>
                      </div>
                      <div>
                        <dt className="text-xs text-slate-500">Amount</dt>
                        <dd className="font-mono-tabular font-bold text-slate-900 dark:text-white">
                          KES {Number(amount).toLocaleString()}
                        </dd>
                      </div>
                      <div>
                        <dt className="text-xs text-slate-500">M-Pesa Phone</dt>
                        <dd className="font-mono-tabular font-semibold text-slate-900 dark:text-white">{phone}</dd>
                      </div>
                    </dl>
                  </div>

                  <ConsentCheckbox id="give-consent" checked={consent} onChange={setConsent} />

                  <div className="flex gap-3">
                    <Button variant="secondary" onClick={() => setStep(2)}>
                      <ArrowLeft className="h-4 w-4" />
                      <span>Back</span>
                    </Button>
                    <Button type="submit" fullWidth size="lg" disabled={submitting}>
                      <Smartphone className="h-4 w-4" aria-hidden="true" />
                      <span>
                        {submitting
                          ? 'Sending M-Pesa Prompt...'
                          : `Send M-Pesa Prompt (KES ${Number(amount).toLocaleString()})`}
                      </span>
                    </Button>
                  </div>
                </form>
              )}
            </div>
          )}
        </Card>

        {/* Trust Cues & Backup Paybill */}
        <div className="space-y-5 lg:col-span-5">
          <Card>
            <h2 className="font-display text-xl font-bold text-slate-900 dark:text-white">
              Manual M-Pesa Paybill (Backup)
            </h2>
            <p className="mt-1.5 text-sm text-slate-600 dark:text-slate-300">
              Prefer Lipa na M-Pesa from SIM toolkit or M-Pesa app?
            </p>
            <dl className="mt-5 space-y-3 border-t border-slate-100 pt-4 text-sm dark:border-slate-800">
              <div className="flex items-center justify-between gap-3">
                <dt className="text-slate-500 dark:text-slate-400">Paybill Number</dt>
                <dd className="flex items-center gap-2 font-mono-tabular text-base font-bold text-slate-900 dark:text-white">
                  <span>{CHURCH_CONFIG.mpesa.paybill}</span>
                  <Button variant="secondary" size="sm" onClick={copyPaybill} aria-label="Copy Paybill number">
                    <Copy className="h-3.5 w-3.5" />
                    <span>{copiedPaybill ? 'Copied' : 'Copy'}</span>
                  </Button>
                </dd>
              </div>
              <div className="flex items-center justify-between gap-3">
                <dt className="text-slate-500 dark:text-slate-400">Buy Goods Till</dt>
                <dd className="font-mono-tabular font-semibold text-slate-900 dark:text-white">
                  {CHURCH_CONFIG.mpesa.tillNumber}
                </dd>
              </div>
              <div className="flex items-center justify-between gap-3">
                <dt className="text-slate-500 dark:text-slate-400">Account</dt>
                <dd className="font-mono-tabular text-xs font-semibold text-[#1E3A8A] dark:text-amber-400">
                  {fund.toUpperCase()}
                </dd>
              </div>
            </dl>
          </Card>

          <Card className="bg-[#FAFBFD] dark:bg-slate-900">
            <div className="flex items-center gap-2.5 text-sm font-semibold text-slate-900 dark:text-white">
              <ShieldCheck className="h-5 w-5 text-[#1E3A8A] dark:text-amber-400" />
              <span>Secure &amp; Transparent</span>
            </div>
            <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
              No cards stored. Your Safaricom receipt code is logged immediately and viewable inside your Member Portal.
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
};
