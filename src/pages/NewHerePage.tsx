import React, {useState} from 'react';
import {CheckCircle2, ChevronDown, Clock, MapPin, Shield, Users} from 'lucide-react';
import {CHURCH_CONFIG} from '../config/church';
import {useApp} from '../context/AppContext';
import {submitVisitorPlan} from '../lib/dataService';
import {ConsentCheckbox} from '../components/ConsentCheckbox';
import {Button, Card, Input, Select, Textarea} from '../components/ui';

const FAQS = [
  {
    q: 'What should I wear on Sunday?',
    a: 'Come as you are! Some members wear smart-casual or Sunday best, while students and young families come in jeans or kitenge. Everyone is welcome.',
  },
  {
    q: 'What happens with my children during service?',
    a: 'PEFA Kids (ages 3–12) and Teens Ignite (13–17) run during both the 8:00 AM and 10:30 AM services. Our vetted teachers check children in safely at the children’s wing.',
  },
  {
    q: 'Is there parking or easy matatu access?',
    a: 'Yes! We have guarded compound parking for 45+ cars, and we are a 3-minute walk from Kenyatta Market bus stage along Mbagathi Way.',
  },
  {
    q: 'Will I be asked to stand up or give money as a visitor?',
    a: 'Never. Visitors are warmly greeted without embarrassment, and giving is purely voluntary for members and friends who wish to worship through generosity.',
  },
];

function validateKenyanPhone(raw: string): string {
  const digits = raw.replace(/\D/g, '');
  const valid =
    (digits.startsWith('0') && digits.length === 10) ||
    (digits.startsWith('254') && digits.length === 12) ||
    ((digits.startsWith('7') || digits.startsWith('1')) && digits.length === 9);
  return valid ? '' : 'Enter a valid Kenyan phone number (e.g. 0712 345 678).';
}

export const NewHerePage: React.FC = () => {
  const {t, lang, showToast} = useApp();
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [preferredDate, setPreferredDate] = useState('2026-11-22');
  const [preferredService, setPreferredService] = useState('10:30 AM Main Family Service');
  const [guestsCount, setGuestsCount] = useState(1);
  const [notes, setNotes] = useState('');
  const [consent, setConsent] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const pErr = validateKenyanPhone(phone);
    if (pErr) {
      setPhoneError(pErr);
      return;
    }
    setError('');
    setSubmitting(true);
    try {
      await submitVisitorPlan({
        full_name: fullName.trim(),
        phone: phone.trim(),
        preferred_date: preferredDate,
        preferred_service: preferredService,
        guests_count: guestsCount,
        notes: notes.trim(),
        consent_given: consent,
      });
      setSubmitted(true);
      showToast('Your Sunday visit plan is confirmed!');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to submit your visit plan.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <div className="max-w-2xl">
        <p className="text-xs font-semibold text-[#1E3A8A] dark:text-amber-400">
          {lang === 'sw' ? 'Karibu PEFA Kenyatta' : 'First-Time Visitor Guide'}
        </p>
        <h1 className="mt-2 font-display text-3xl font-bold text-slate-900 dark:text-white sm:text-4xl">
          {lang === 'sw' ? 'Unachoweza kutarajia Jumapili hii' : 'What to expect on your first Sunday'}
        </h1>
        <p className="mt-3 max-w-[65ch] text-base leading-relaxed text-slate-600 dark:text-slate-300">
          Visiting a new church can feel unfamiliar. Here is everything you need to know before arriving at{' '}
          {CHURCH_CONFIG.address}.
        </p>
      </div>

      {/* 4 Key Expectations */}
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card padding="md">
          <Clock className="h-5 w-5 text-[#1E3A8A] dark:text-amber-400" />
          <h2 className="mt-3 text-base font-semibold text-slate-900 dark:text-white">Service Flow</h2>
          <p className="mt-1.5 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
            Services last about 1 hr 45 mins with bilingual English &amp; Kiswahili worship and Bible teaching.
          </p>
        </Card>

        <Card padding="md">
          <Users className="h-5 w-5 text-[#1E3A8A] dark:text-amber-400" />
          <h2 className="mt-3 text-base font-semibold text-slate-900 dark:text-white">Children’s Wing</h2>
          <p className="mt-1.5 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
            Safe classes for ages 3–12 and Teens Ignite during both Sunday services with parent check-in tags.
          </p>
        </Card>

        <Card padding="md">
          <Shield className="h-5 w-5 text-[#1E3A8A] dark:text-amber-400" />
          <h2 className="mt-3 text-base font-semibold text-slate-900 dark:text-white">What to Wear &amp; Parking</h2>
          <p className="mt-1.5 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
            Smart casual, jeans, or kitenge—come comfortably. Free guarded parking inside the church gate.
          </p>
        </Card>

        <Card padding="md">
          <MapPin className="h-5 w-5 text-[#1E3A8A] dark:text-amber-400" />
          <h2 className="mt-3 text-base font-semibold text-slate-900 dark:text-white">Tea &amp; Welcome</h2>
          <p className="mt-1.5 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
            Stop by the Welcome Desk right after service for Kenyan chai and to meet Pastor David &amp; Pastor Grace.
          </p>
        </Card>
      </div>

      {/* Single-Column Friendly Form + FAQ */}
      <div className="mt-12 grid gap-10 lg:grid-cols-12">
        <Card padding="lg" className="lg:col-span-7">
          <h2 className="font-display text-2xl font-bold text-slate-900 dark:text-white">
            {t.sections.planVisit}
          </h2>
          <p className="mt-1.5 text-base text-slate-600 dark:text-slate-300">
            Just 3 quick details so our hospitality team can greet you and reserve parking.
          </p>

          {submitted ? (
            <div className="mt-6 rounded-xl border border-emerald-200 bg-emerald-50 p-6 dark:border-emerald-900/50 dark:bg-emerald-950/40">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="h-6 w-6 text-emerald-700 dark:text-emerald-400" />
                <h3 className="text-lg font-semibold text-emerald-950 dark:text-emerald-200">
                  {t.forms.successTitle}
                </h3>
              </div>
              <p className="mt-2 text-base text-emerald-900 dark:text-emerald-100">
                Karibu sana, {fullName}! We look forward to welcoming you on{' '}
                <span className="font-mono-tabular font-semibold">{preferredDate}</span> ({preferredService}).
              </p>
              <div className="mt-4">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => {
                    setSubmitted(false);
                    setFullName('');
                    setPhone('');
                    setNotes('');
                  }}
                >
                  Plan another visit
                </Button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              {error && (
                <div role="alert" className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm font-medium text-red-800 dark:border-red-900/60 dark:bg-red-950/40 dark:text-red-200">
                  {error}
                </div>
              )}

              <Input
                label="Your Full Name *"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="e.g. Samuel Mwangi"
              />

              <Input
                label="Phone / WhatsApp Number *"
                type="tel"
                required
                value={phone}
                error={phoneError}
                onChange={(e) => {
                  setPhone(e.target.value);
                  if (phoneError) setPhoneError('');
                }}
                placeholder="0712 345 678"
                className="font-mono-tabular"
              />

              <Input
                label="Preferred Sunday Date *"
                type="date"
                required
                value={preferredDate}
                onChange={(e) => setPreferredDate(e.target.value)}
              />

              <Select
                label="Preferred Service"
                value={preferredService}
                onChange={(e) => setPreferredService(e.target.value)}
              >
                <option value="8:00 AM First Service">8:00 AM First Service</option>
                <option value="10:30 AM Main Family Service">10:30 AM Family Service</option>
              </Select>

              <Input
                label="Number of Guests"
                type="number"
                min={1}
                max={20}
                value={guestsCount}
                onChange={(e) => setGuestsCount(Number(e.target.value))}
                className="font-mono-tabular"
              />

              <Textarea
                label="Anything we should know? (Optional)"
                rows={3}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Children's ages, parking assistance, or questions..."
              />

              <ConsentCheckbox id="visit-consent" checked={consent} onChange={setConsent} />

              <Button type="submit" fullWidth size="lg" disabled={submitting}>
                {submitting ? t.forms.submitting : 'Confirm My Sunday Visit'}
              </Button>
            </form>
          )}
        </Card>

        <div className="lg:col-span-5">
          <h2 className="font-display text-2xl font-bold text-slate-900 dark:text-white">
            Frequently Asked Questions
          </h2>
          <div className="mt-6 divide-y divide-slate-200/70 rounded-2xl border border-white/60 bg-white/76 backdrop-blur-md dark:divide-slate-700/60 dark:border-slate-700/60 dark:bg-slate-900/72">
            {FAQS.map((item, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div key={item.q}>
                  <button
                    type="button"
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    aria-expanded={isOpen}
                    className="flex min-h-[56px] w-full items-center justify-between gap-4 px-5 py-4 text-left text-base font-semibold text-slate-900 dark:text-white"
                  >
                    <span>{item.q}</span>
                    <ChevronDown
                      className={`h-4 w-4 shrink-0 transition-transform ${isOpen ? 'rotate-180' : ''}`}
                      aria-hidden="true"
                    />
                  </button>
                  {isOpen && (
                    <p className="px-5 pb-4 text-base leading-relaxed text-slate-600 dark:text-slate-300">
                      {item.a}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
