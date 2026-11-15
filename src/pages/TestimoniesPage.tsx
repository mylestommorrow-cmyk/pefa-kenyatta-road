import React, {useState} from 'react';
import {CheckCircle2, MessageSquareQuote} from 'lucide-react';
import {useApp} from '../context/AppContext';
import {submitTestimony} from '../lib/dataService';
import {ConsentCheckbox} from '../components/ConsentCheckbox';

export const TestimoniesPage: React.FC = () => {
  const {bundle, lang} = useApp();
  const testimonies = bundle?.testimonies || [];
  const [authorName, setAuthorName] = useState('');
  const [phone, setPhone] = useState('');
  const [title, setTitle] = useState('');
  const [story, setStory] = useState('');
  const [consent, setConsent] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await submitTestimony({
        author_name: authorName.trim(),
        phone: phone.trim() || undefined,
        title: title.trim(),
        story: story.trim(),
        consent_given: consent,
      });
      setDone(true);
      setTitle('');
      setStory('');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <div className="max-w-2xl">
        <p className="text-xs font-semibold text-[#1E3A8A] dark:text-amber-400">
          {lang === 'sw' ? 'Shuhuda za Matendo ya Mungu' : 'Stories of Faithfulness'}
        </p>
        <h1 className="mt-2 font-display text-3xl font-bold text-slate-900 dark:text-white sm:text-4xl">
          {lang === 'sw' ? 'Shuhuda za Washirika Wetu' : 'What God is doing at PEFA Kenyatta'}
        </h1>
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-12">
        <div className="space-y-4 lg:col-span-7">
          {testimonies.map((item) => (
            <article key={item.id} className="rounded-2xl border border-white/60 bg-white/76 p-6 backdrop-blur-md dark:border-slate-700/60 dark:bg-slate-900/72">
              <div className="flex items-center gap-2 text-xs font-semibold text-[#B45309] dark:text-amber-400">
                <MessageSquareQuote className="h-4 w-4" />
                <span>{item.title}</span>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-slate-700 dark:text-slate-300">
                “{item.story}”
              </p>
              <p className="mt-4 text-xs font-semibold text-slate-900 dark:text-white">
                {item.author_name} · PEFA Kenyatta Congregation
              </p>
            </article>
          ))}
        </div>

        <div className="rounded-2xl border border-white/60 bg-white/76 p-6 backdrop-blur-md dark:border-slate-700/60 dark:bg-slate-900/72 lg:col-span-5">
          <h2 className="font-display text-xl font-bold text-slate-900 dark:text-white">
            Share Your Testimony
          </h2>
          <p className="mt-1 text-xs text-slate-600 dark:text-slate-300">
            Encourage the church family! Submitted testimonies are reviewed by our pastoral admin before publishing.
          </p>

          {done ? (
            <div className="mt-5 rounded-xl border border-emerald-200 bg-emerald-50 p-5 text-xs text-emerald-900 dark:border-emerald-900/50 dark:bg-emerald-950/40 dark:text-emerald-200">
              <div className="flex items-center gap-2 font-bold">
                <CheckCircle2 className="h-4 w-4" />
                <span>Asante! Testimony submitted for review.</span>
              </div>
              <p className="mt-1.5">Once approved by the pastoral team, it will appear on this page.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="mt-5 space-y-3.5">
              <input required placeholder="Your Name" value={authorName} onChange={(e) => setAuthorName(e.target.value)} className="w-full min-h-[44px] rounded-xl border border-slate-300 bg-white px-3.5 text-sm dark:border-slate-700 dark:bg-slate-950 dark:text-white" />
              <input type="tel" placeholder="Phone (Optional — kept private)" value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full min-h-[44px] rounded-xl border border-slate-300 bg-white px-3.5 font-mono-tabular text-sm dark:border-slate-700 dark:bg-slate-950 dark:text-white" />
              <input required placeholder="Testimony Title (e.g. Answered Prayer)" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full min-h-[44px] rounded-xl border border-slate-300 bg-white px-3.5 text-sm dark:border-slate-700 dark:bg-slate-950 dark:text-white" />
              <textarea required rows={4} placeholder="Share what God has done..." value={story} onChange={(e) => setStory(e.target.value)} className="w-full rounded-xl border border-slate-300 bg-white p-3.5 text-sm dark:border-slate-700 dark:bg-slate-950 dark:text-white" />
              <ConsentCheckbox id="testimony-consent" checked={consent} onChange={setConsent} />
              <button type="submit" disabled={submitting} className="min-h-[46px] w-full rounded-xl bg-[#1E3A8A] px-4 text-sm font-semibold text-white dark:bg-amber-500 dark:text-slate-950">
                {submitting ? 'Submitting...' : 'Submit Testimony'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
