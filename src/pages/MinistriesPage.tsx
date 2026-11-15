import React, {useState} from 'react';
import {CheckCircle2, Users, X} from 'lucide-react';
import {useApp} from '../context/AppContext';
import {submitMinistrySignup} from '../lib/dataService';
import {ConsentCheckbox} from '../components/ConsentCheckbox';
import {SafeImage} from '../components/SafeImage';
import type {Ministry} from '../types/church';

export const MinistriesPage: React.FC = () => {
  const {bundle, lang} = useApp();
  const ministries = bundle?.ministries || [];
  const [selected, setSelected] = useState<Ministry | null>(null);
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [notes, setNotes] = useState('');
  const [consent, setConsent] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleJoin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selected) return;
    setError('');
    setSubmitting(true);
    try {
      await submitMinistrySignup({
        ministry_id: selected.id,
        ministry_name: selected.name,
        full_name: fullName.trim(),
        phone: phone.trim(),
        email: email.trim(),
        notes: notes.trim(),
        consent_given: consent,
      });
      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to send ministry request.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <div className="max-w-2xl">
        <p className="text-xs font-semibold text-[#1E3A8A] dark:text-amber-400">
          {lang === 'sw' ? 'Huduma za Kanisa' : 'Serve & Grow Together'}
        </p>
        <h1 className="mt-2 font-display text-3xl font-bold text-slate-900 dark:text-white sm:text-4xl">
          {lang === 'sw' ? 'Jiunge na Huduma Yetu' : 'Ministries for every age and gift'}
        </h1>
        <p className="mt-3 text-base text-slate-600 dark:text-slate-300">
          From children and youth to worship, ushering, and neighborhood outreach—find a team where you can belong and serve.
        </p>
      </div>

      <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {ministries.map((m) => (
          <article
            key={m.id}
            className="flex flex-col justify-between overflow-hidden rounded-2xl border border-white/60 bg-white/76 backdrop-blur-md dark:border-slate-700/60 dark:bg-slate-900/72"
          >
            <div>
              {m.image_url && (
                <div className="aspect-[4/3] w-full overflow-hidden">
                  <SafeImage src={m.image_url} alt={m.name} className="h-full w-full object-cover" />
                </div>
              )}
              <div className="p-6">
                <p className="text-xs font-semibold text-[#1E3A8A] dark:text-amber-400">
                  {m.category} · {m.meeting_time}
                </p>
                <h2 className="mt-1.5 font-display text-xl font-bold text-slate-900 dark:text-white">
                  {lang === 'sw' && m.name_sw ? m.name_sw : m.name}
                </h2>
                <p className="mt-1 text-xs font-medium text-slate-500 dark:text-slate-400">
                  Led by {m.leader_name}
                </p>
                <p className="mt-3 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                  {m.description}
                </p>
              </div>
            </div>

            <div className="border-t border-slate-100 px-6 py-4 dark:border-slate-800">
              <button
                type="button"
                onClick={() => {
                  setSelected(m);
                  setSuccess(false);
                  setError('');
                }}
                className="inline-flex min-h-[42px] w-full items-center justify-center gap-2 rounded-xl bg-[#1E3A8A] px-4 text-xs font-semibold text-white hover:bg-[#172D6E] dark:bg-amber-500 dark:text-slate-950"
              >
                <Users className="h-4 w-4" />
                <span>Join {m.category}</span>
              </button>
            </div>
          </article>
        ))}
      </div>

      {/* Join Ministry Modal */}
      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm" role="dialog" aria-modal="true">
          <div className="w-full max-w-md rounded-2xl border border-white/60 bg-white/86 p-6 shadow-lg backdrop-blur-xl dark:border-slate-700/70 dark:bg-slate-900/86">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold text-[#1E3A8A] dark:text-amber-400">Ministry Sign-Up</p>
                <h2 className="mt-1 font-display text-xl font-bold text-slate-900 dark:text-white">
                  {selected.name}
                </h2>
              </div>
              <button
                type="button"
                aria-label="Close"
                onClick={() => setSelected(null)}
                className="flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 text-slate-600 dark:border-slate-700 dark:text-slate-300"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {success ? (
              <div className="mt-5 rounded-xl border border-emerald-200 bg-emerald-50 p-5 dark:border-emerald-900/50 dark:bg-emerald-950/40">
                <div className="flex items-center gap-2.5 text-emerald-800 dark:text-emerald-200">
                  <CheckCircle2 className="h-5 w-5" />
                  <p className="text-sm font-bold">Asante! You’re signed up.</p>
                </div>
                <p className="mt-2 text-xs text-emerald-900 dark:text-emerald-100">
                  {selected.leader_name} will reach out to welcome you ahead of the next gathering ({selected.meeting_time}).
                </p>
              </div>
            ) : (
              <form onSubmit={handleJoin} className="mt-5 space-y-3.5">
                {error && <p className="text-xs font-medium text-red-600">{error}</p>}
                <input
                  required
                  placeholder="Your Full Name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full min-h-[44px] rounded-xl border border-slate-300 bg-white px-3.5 text-sm dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                />
                <input
                  required
                  type="tel"
                  placeholder="Phone / WhatsApp (e.g. 0712 345 678)"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full min-h-[44px] rounded-xl border border-slate-300 bg-white px-3.5 font-mono-tabular text-sm dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                />
                <input
                  type="email"
                  placeholder="Email (Optional)"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full min-h-[44px] rounded-xl border border-slate-300 bg-white px-3.5 text-sm dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                />
                <textarea
                  rows={2}
                  placeholder="Any experience or questions?"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 bg-white p-3 text-sm dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                />
                <ConsentCheckbox id="ministry-consent" checked={consent} onChange={setConsent} />
                <button
                  type="submit"
                  disabled={submitting}
                  className="min-h-[46px] w-full rounded-xl bg-[#1E3A8A] px-4 text-sm font-semibold text-white dark:bg-amber-500 dark:text-slate-950"
                >
                  {submitting ? 'Submitting...' : 'Submit Join Request'}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
