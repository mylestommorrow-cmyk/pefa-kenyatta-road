import React, {useState} from 'react';
import {CheckCircle2, HeartHandshake, Lock} from 'lucide-react';
import {useApp} from '../context/AppContext';
import {submitPrayerOrCounselling} from '../lib/dataService';
import {ConsentCheckbox} from '../components/ConsentCheckbox';

export const PrayerPage: React.FC = () => {
  const {lang} = useApp();
  const [requestType, setRequestType] = useState<'prayer' | 'counselling'>('prayer');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [requestText, setRequestText] = useState('');
  const [pastorsOnly, setPastorsOnly] = useState(true);
  const [callbackTime, setCallbackTime] = useState('');
  const [consent, setConsent] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await submitPrayerOrCounselling({
        request_type: requestType,
        full_name: fullName.trim() || undefined,
        phone: phone.trim() || undefined,
        request_text: requestText.trim(),
        pastors_only: pastorsOnly,
        preferred_callback_time: callbackTime.trim() || undefined,
        consent_given: consent,
      });
      setDone(true);
      setRequestText('');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
      <div>
        <p className="text-xs font-semibold text-[#1E3A8A] dark:text-amber-400">
          {lang === 'sw' ? 'Maombi na Ushauri wa Kichungaji' : 'Pastoral Care'}
        </p>
        <h1 className="mt-2 font-display text-3xl font-bold text-slate-900 dark:text-white sm:text-4xl">
          {lang === 'sw' ? 'Tunaomba pamoja nawe' : 'Share a prayer request or book counselling'}
        </h1>
        <p className="mt-3 text-base text-slate-600 dark:text-slate-300">
          You do not have to walk through heavy seasons alone. Our pastors and intercessors pray over every request received.
        </p>
      </div>

      <div className="mt-8 rounded-2xl border border-white/60 bg-white/76 p-6 backdrop-blur-md dark:border-slate-700/60 dark:bg-slate-900/72 sm:p-8">
        <div className="flex gap-2 rounded-xl border border-slate-200/80 bg-white/70 p-1 backdrop-blur-sm dark:border-slate-700/70 dark:bg-slate-950/65">
          <button
            type="button"
            onClick={() => {
              setRequestType('prayer');
              setDone(false);
            }}
            className={`min-h-[42px] flex-1 rounded-lg text-xs font-semibold transition ${
              requestType === 'prayer' ? 'bg-[#1E3A8A] text-white dark:bg-amber-500 dark:text-slate-950' : 'text-slate-600 dark:text-slate-300'
            }`}
          >
            Prayer Request
          </button>
          <button
            type="button"
            onClick={() => {
              setRequestType('counselling');
              setPastorsOnly(true);
              setDone(false);
            }}
            className={`min-h-[42px] flex-1 rounded-lg text-xs font-semibold transition ${
              requestType === 'counselling' ? 'bg-[#1E3A8A] text-white dark:bg-amber-500 dark:text-slate-950' : 'text-slate-600 dark:text-slate-300'
            }`}
          >
            Pastoral Counselling
          </button>
        </div>

        {done ? (
          <div className="mt-6 rounded-xl border border-emerald-200 bg-emerald-50 p-6 dark:border-emerald-900/50 dark:bg-emerald-950/40">
            <div className="flex items-center gap-2.5 text-emerald-900 dark:text-emerald-200">
              <CheckCircle2 className="h-5 w-5" />
              <h2 className="text-base font-bold">Received with care</h2>
            </div>
            <p className="mt-2 text-sm text-emerald-800 dark:text-emerald-100">
              {requestType === 'counselling'
                ? 'Pastor David or Pastor Grace will reach out on your preferred time to schedule a confidential meeting.'
                : 'Our pastoral team is standing in faith with you in prayer today.'}
            </p>
            <button
              type="button"
              onClick={() => setDone(false)}
              className="mt-4 min-h-[40px] rounded-lg border border-emerald-300 bg-white px-4 text-xs font-semibold text-emerald-900"
            >
              Send another request
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <input
                placeholder={requestType === 'prayer' ? 'Your Name (Optional — can be anonymous)' : 'Your Full Name *'}
                required={requestType === 'counselling'}
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full min-h-[44px] rounded-xl border border-slate-300 bg-white px-3.5 text-sm dark:border-slate-700 dark:bg-slate-950 dark:text-white"
              />
              <input
                type="tel"
                placeholder={requestType === 'counselling' ? 'Phone / WhatsApp *' : 'Phone (Optional if you want a call)'}
                required={requestType === 'counselling'}
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full min-h-[44px] rounded-xl border border-slate-300 bg-white px-3.5 font-mono-tabular text-sm dark:border-slate-700 dark:bg-slate-950 dark:text-white"
              />
            </div>

            {requestType === 'counselling' && (
              <input
                placeholder="Preferred day/time (e.g. Wednesday afternoon or Saturday morning)"
                value={callbackTime}
                onChange={(e) => setCallbackTime(e.target.value)}
                className="w-full min-h-[44px] rounded-xl border border-slate-300 bg-white px-3.5 text-sm dark:border-slate-700 dark:bg-slate-950 dark:text-white"
              />
            )}

            <textarea
              required
              rows={4}
              value={requestText}
              onChange={(e) => setRequestText(e.target.value)}
              placeholder={
                requestType === 'prayer'
                  ? 'Write your prayer request here...'
                  : 'Briefly share what you would like pastoral counsel on (marriage, grief, youth guidance, spiritual growth)...'
              }
              className="w-full rounded-xl border border-slate-300 bg-white p-3.5 text-sm dark:border-slate-700 dark:bg-slate-950 dark:text-white"
            />

            <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-slate-200 p-3.5 dark:border-slate-800">
              <input
                type="checkbox"
                checked={pastorsOnly}
                onChange={(e) => setPastorsOnly(e.target.checked)}
                className="h-5 w-5 rounded border-slate-300 text-[#1E3A8A]"
              />
              <span className="flex items-center gap-2 text-xs font-medium text-slate-700 dark:text-slate-200">
                <Lock className="h-3.5 w-3.5 text-[#1E3A8A] dark:text-amber-400" />
                Keep this request strictly private to Pastors only (do not share with wider prayer team)
              </span>
            </label>

            <ConsentCheckbox id="prayer-consent" checked={consent} onChange={setConsent} />

            <button
              type="submit"
              disabled={submitting}
              className="inline-flex min-h-[48px] w-full items-center justify-center gap-2 rounded-xl bg-[#1E3A8A] px-6 text-sm font-semibold text-white dark:bg-amber-500 dark:text-slate-950"
            >
              <HeartHandshake className="h-4 w-4" />
              <span>{submitting ? 'Sending...' : requestType === 'prayer' ? 'Send Prayer Request' : 'Request Pastoral Counselling'}</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
