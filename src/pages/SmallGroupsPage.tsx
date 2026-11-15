import React, {useState} from 'react';
import {CheckCircle2, MapPin, Phone, Users} from 'lucide-react';
import {useApp} from '../context/AppContext';
import {submitMinistrySignup} from '../lib/dataService';
import {ConsentCheckbox} from '../components/ConsentCheckbox';

export const SmallGroupsPage: React.FC = () => {
  const {bundle, lang} = useApp();
  const groups = bundle?.smallGroups || [];
  const [selectedGroup, setSelectedGroup] = useState<string>(groups[0]?.name || 'Kenyatta Estate Grace Cell');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [notes, setNotes] = useState('');
  const [consent, setConsent] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  const handleJoin = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await submitMinistrySignup({
        ministry_name: `Cell Group: ${selectedGroup}`,
        full_name: fullName.trim(),
        phone: phone.trim(),
        notes: notes.trim(),
        consent_given: consent,
      });
      setDone(true);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <div className="max-w-2xl">
        <p className="text-xs font-semibold text-[#1E3A8A] dark:text-amber-400">
          {lang === 'sw' ? 'Vikundi vya Nyumbani' : 'Home Fellowships'}
        </p>
        <h1 className="mt-2 font-display text-3xl font-bold text-slate-900 dark:text-white sm:text-4xl">
          {lang === 'sw' ? 'Kua katika imani karibu na kwako' : 'Small Groups across Kenyatta & nearby estates'}
        </h1>
        <p className="mt-3 text-base text-slate-600 dark:text-slate-300">
          Church happens in homes during the week—sharing tea, discussing Sunday’s Word, and praying for one another’s families.
        </p>
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-12">
        <div className="grid gap-4 sm:grid-cols-2 lg:col-span-7">
          {groups.map((g) => (
            <article key={g.id} className="flex flex-col justify-between rounded-2xl border border-white/60 bg-white/76 p-5 backdrop-blur-md dark:border-slate-700/60 dark:bg-slate-900/72">
              <div>
                <p className="text-xs font-semibold text-[#B45309] dark:text-amber-400">
                  {g.meeting_day} · {g.meeting_time}
                </p>
                <h2 className="mt-1.5 font-display text-lg font-bold text-slate-900 dark:text-white">{g.name}</h2>
                <p className="mt-1 flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-300">
                  <MapPin className="h-3.5 w-3.5" /> <span>{g.area}</span>
                </p>
                <p className="mt-2.5 text-xs leading-relaxed text-slate-600 dark:text-slate-300">{g.description}</p>
              </div>
              <div className="mt-4 border-t border-slate-100 pt-3 text-xs dark:border-slate-800">
                <p className="font-medium text-slate-800 dark:text-slate-200">Host: {g.host_name}</p>
                <p className="mt-0.5 flex items-center gap-1 font-mono-tabular text-slate-500 dark:text-slate-400">
                  <Phone className="h-3 w-3" /> <span>{g.contact_phone}</span>
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedGroup(g.name);
                    setDone(false);
                  }}
                  className="mt-3 min-h-[38px] w-full rounded-lg border border-slate-200 text-xs font-semibold text-[#1E3A8A] hover:bg-slate-50 dark:border-slate-700 dark:text-amber-400"
                >
                  Select this group
                </button>
              </div>
            </article>
          ))}
        </div>

        <div className="rounded-2xl border border-white/60 bg-white/76 p-6 backdrop-blur-md dark:border-slate-700/60 dark:bg-slate-900/72 lg:col-span-5">
          <div className="flex items-center gap-2 text-[#1E3A8A] dark:text-amber-400">
            <Users className="h-5 w-5" />
            <span className="text-xs font-semibold">Join a Cell Group</span>
          </div>
          <h2 className="mt-1 font-display text-xl font-bold text-slate-900 dark:text-white">
            Connect with a neighborhood fellowship
          </h2>

          {done ? (
            <div className="mt-5 rounded-xl border border-emerald-200 bg-emerald-50 p-5 text-xs text-emerald-900 dark:border-emerald-900/50 dark:bg-emerald-950/40 dark:text-emerald-200">
              <div className="flex items-center gap-2 font-bold">
                <CheckCircle2 className="h-4 w-4" />
                <span>Request received for {selectedGroup}!</span>
              </div>
              <p className="mt-2">Our cell host will message you with directions ahead of the next meeting.</p>
            </div>
          ) : (
            <form onSubmit={handleJoin} className="mt-5 space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-200">Preferred Cell Group</label>
                <select
                  value={selectedGroup}
                  onChange={(e) => setSelectedGroup(e.target.value)}
                  className="mt-1.5 w-full min-h-[44px] rounded-xl border border-slate-300 bg-white px-3 text-sm dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                >
                  {groups.map((g) => (
                    <option key={g.id} value={g.name}>{g.name} ({g.area})</option>
                  ))}
                </select>
              </div>
              <input required placeholder="Full Name" value={fullName} onChange={(e) => setFullName(e.target.value)} className="w-full min-h-[44px] rounded-xl border border-slate-300 bg-white px-3.5 text-sm dark:border-slate-700 dark:bg-slate-950 dark:text-white" />
              <input required type="tel" placeholder="Phone / WhatsApp (e.g. 0712 345 678)" value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full min-h-[44px] rounded-xl border border-slate-300 bg-white px-3.5 font-mono-tabular text-sm dark:border-slate-700 dark:bg-slate-950 dark:text-white" />
              <textarea rows={2} placeholder="Your estate / stage (optional)" value={notes} onChange={(e) => setNotes(e.target.value)} className="w-full rounded-xl border border-slate-300 bg-white p-3 text-sm dark:border-slate-700 dark:bg-slate-950 dark:text-white" />
              <ConsentCheckbox id="group-consent" checked={consent} onChange={setConsent} />
              <button type="submit" disabled={submitting} className="min-h-[46px] w-full rounded-xl bg-[#1E3A8A] px-4 text-sm font-semibold text-white dark:bg-amber-500 dark:text-slate-950">
                {submitting ? 'Sending...' : 'Join Selected Cell Group'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
