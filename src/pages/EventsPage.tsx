import React, {useMemo, useState} from 'react';
import {CheckCircle2, ExternalLink, MapPin} from 'lucide-react';
import {useApp} from '../context/AppContext';
import {submitEventRsvp} from '../lib/dataService';
import {ConsentCheckbox} from '../components/ConsentCheckbox';
import {SafeImage} from '../components/SafeImage';
import {Button, Card, EmptyState, Input, Modal, SkeletonCard, Tabs} from '../components/ui';
import type {ChurchEvent} from '../types/church';

function buildGoogleCalendarUrl(ev: ChurchEvent): string {
  const fmt = (iso: string) => new Date(iso).toISOString().replace(/[-:]/g, '').replace(/\.\d{3}Z$/, 'Z');
  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: ev.title,
    dates: `${fmt(ev.start_at)}/${fmt(ev.end_at)}`,
    location: ev.location,
    details: ev.description,
  });
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

export const EventsPage: React.FC = () => {
  const {bundle, loadingBundle, lang, refreshBundle, showToast} = useApp();
  const events = bundle?.events || [];
  const [view, setView] = useState<'list' | 'calendar'>('list');
  const [activeEvent, setActiveEvent] = useState<ChurchEvent | null>(null);
  const [rsvpName, setRsvpName] = useState('');
  const [rsvpPhone, setRsvpPhone] = useState('');
  const [rsvpPhoneErr, setRsvpPhoneErr] = useState('');
  const [rsvpGuests, setRsvpGuests] = useState(1);
  const [consent, setConsent] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [rsvpDone, setRsvpDone] = useState(false);

  const groupedByMonth = useMemo(() => {
    const map = new Map<string, ChurchEvent[]>();
    events.forEach((ev) => {
      const label = new Date(ev.start_at).toLocaleDateString('en-KE', {month: 'long', year: 'numeric'});
      const arr = map.get(label) || [];
      arr.push(ev);
      map.set(label, arr);
    });
    return Array.from(map.entries());
  }, [events]);

  const handleRsvp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeEvent) return;
    const digits = rsvpPhone.replace(/\D/g, '');
    if (digits.length < 9) {
      setRsvpPhoneErr('Enter a valid Kenyan phone number (e.g. 0712 345 678).');
      return;
    }
    setSubmitting(true);
    try {
      await submitEventRsvp({
        event_id: activeEvent.id,
        full_name: rsvpName.trim(),
        phone: rsvpPhone.trim(),
        guests: rsvpGuests,
        consent_given: consent,
      });
      setRsvpDone(true);
      showToast('Event RSVP confirmed!');
      await refreshBundle();
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold text-[#1E3A8A] dark:text-amber-400">
            {lang === 'sw' ? 'Kalenda ya Kanisa' : 'Church Calendar'}
          </p>
          <h1 className="mt-2 font-display text-3xl font-bold text-slate-900 dark:text-white sm:text-4xl">
            {lang === 'sw' ? 'Matukio na Ibada Zijazo' : 'Upcoming events & fellowships'}
          </h1>
        </div>

        <Tabs
          ariaLabel="Event layout view"
          activeTab={view}
          onChange={setView}
          tabs={[
            {id: 'list', label: 'List View'},
            {id: 'calendar', label: 'Calendar View'},
          ]}
        />
      </div>

      {loadingBundle && events.length === 0 ? (
        <div className="mt-8 grid gap-6 md:grid-cols-2">
          <SkeletonCard lines={3} />
          <SkeletonCard lines={3} />
        </div>
      ) : events.length === 0 ? (
        <div className="mt-8">
          <EmptyState
            title="No events this week"
            description="Sunday services gather as usual at 8:00 AM and 10:30 AM. Check back soon for upcoming special fellowships."
          />
        </div>
      ) : view === 'list' ? (
        <div className="mt-8 grid gap-6 md:grid-cols-2">
          {events.map((ev) => {
            const start = new Date(ev.start_at);
            return (
              <Card key={ev.id} padding="sm" className="flex flex-col justify-between overflow-hidden p-0">
                <div>
                  {ev.image_url && (
                    <div className="aspect-[16/9] w-full overflow-hidden border-b border-slate-200 dark:border-slate-800">
                      <SafeImage src={ev.image_url} alt={ev.title} className="h-full w-full object-cover" />
                    </div>
                  )}
                  <div className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="flex h-14 w-14 shrink-0 flex-col items-center justify-center rounded-xl border border-slate-200 bg-[#FAFBFD] font-mono-tabular dark:border-slate-700 dark:bg-slate-950">
                        <span className="text-[11px] font-semibold uppercase text-[#1E3A8A] dark:text-amber-400">
                          {start.toLocaleDateString('en-KE', {month: 'short'})}
                        </span>
                        <span className="text-lg font-bold text-slate-900 dark:text-white">{start.getDate()}</span>
                      </div>
                      <div>
                        <p className="font-mono-tabular text-xs font-semibold text-[#1E3A8A] dark:text-amber-400">
                          {ev.category} · {start.toLocaleTimeString('en-KE', {hour: '2-digit', minute: '2-digit'})}
                        </p>
                        <h2 className="mt-1 font-display text-xl font-bold text-slate-900 dark:text-white">
                          {lang === 'sw' && ev.title_sw ? ev.title_sw : ev.title}
                        </h2>
                        <p className="mt-1 flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
                          <MapPin className="h-3.5 w-3.5" /> <span>{ev.location}</span>
                        </p>
                      </div>
                    </div>
                    <p className="mt-4 max-w-[65ch] text-base leading-relaxed text-slate-600 dark:text-slate-300">
                      {ev.description}
                    </p>
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-2.5 border-t border-slate-100 px-6 py-4 dark:border-slate-800">
                  <Button
                    size="sm"
                    onClick={() => {
                      setActiveEvent(ev);
                      setRsvpDone(false);
                    }}
                  >
                    Details &amp; RSVP
                  </Button>
                  <a
                    href={buildGoogleCalendarUrl(ev)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex min-h-[44px] items-center gap-1.5 rounded-xl border border-slate-300 px-4 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200"
                  >
                    <span>Add to calendar</span>
                    <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                </div>
              </Card>
            );
          })}
        </div>
      ) : (
        <div className="mt-8 space-y-8">
          {groupedByMonth.map(([monthLabel, list]) => (
            <Card key={monthLabel}>
              <h2 className="font-display text-xl font-bold text-slate-900 dark:text-white">{monthLabel}</h2>
              <div className="mt-4 divide-y divide-slate-100 dark:divide-slate-800">
                {list.map((ev) => {
                  const d = new Date(ev.start_at);
                  return (
                    <div key={ev.id} className="flex flex-col gap-3 py-4 sm:flex-row sm:items-center sm:justify-between">
                      <div className="flex items-center gap-4">
                        <div className="flex h-12 w-12 shrink-0 flex-col items-center justify-center rounded-xl border border-slate-200 bg-[#FAFBFD] font-mono-tabular dark:border-slate-700 dark:bg-slate-950">
                          <span className="text-[10px] font-semibold uppercase text-[#1E3A8A] dark:text-amber-400">
                            {d.toLocaleDateString('en-KE', {month: 'short'})}
                          </span>
                          <span className="text-base font-bold text-slate-900 dark:text-white">{d.getDate()}</span>
                        </div>
                        <div>
                          <p className="text-base font-semibold text-slate-900 dark:text-white">{ev.title}</p>
                          <p className="text-xs text-slate-500 dark:text-slate-400">
                            {d.toLocaleTimeString('en-KE', {hour: '2-digit', minute: '2-digit'})} · {ev.location}
                          </p>
                        </div>
                      </div>
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => {
                          setActiveEvent(ev);
                          setRsvpDone(false);
                        }}
                        className="self-start sm:self-center"
                      >
                        Details &amp; RSVP
                      </Button>
                    </div>
                  );
                })}
              </div>
            </Card>
          ))}
        </div>
      )}

      <Modal
        open={Boolean(activeEvent)}
        onClose={() => setActiveEvent(null)}
        title={activeEvent?.title || ''}
        subtitle={activeEvent?.category}
      >
        {activeEvent && (
          <div>
            <p className="font-mono-tabular text-xs text-slate-600 dark:text-slate-300">
              {new Date(activeEvent.start_at).toLocaleString('en-KE')} · {activeEvent.location}
            </p>
            <p className="mt-3 text-base leading-relaxed text-slate-600 dark:text-slate-300">
              {activeEvent.description}
            </p>
            <div className="mt-4">
              <a
                href={buildGoogleCalendarUrl(activeEvent)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-[44px] items-center gap-1.5 rounded-xl border border-slate-300 px-4 text-xs font-semibold text-[#1E3A8A] dark:border-slate-700 dark:text-amber-400"
              >
                <span>Add to Google Calendar</span>
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
            </div>

            {activeEvent.rsvp_enabled && (
              <div className="mt-6 border-t border-slate-200 pt-5 dark:border-slate-800">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">Optional RSVP</h3>
                {rsvpDone ? (
                  <div className="mt-3 flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm font-semibold text-emerald-900 dark:border-emerald-900/50 dark:bg-emerald-950/40 dark:text-emerald-200">
                    <CheckCircle2 className="h-4 w-4" />
                    <span>RSVP confirmed! We look forward to seeing you.</span>
                  </div>
                ) : (
                  <form onSubmit={handleRsvp} className="mt-3 space-y-3">
                    <Input
                      label="Full Name *"
                      required
                      value={rsvpName}
                      onChange={(e) => setRsvpName(e.target.value)}
                    />
                    <Input
                      label="Phone Number *"
                      type="tel"
                      required
                      error={rsvpPhoneErr}
                      value={rsvpPhone}
                      onChange={(e) => {
                        setRsvpPhone(e.target.value);
                        if (rsvpPhoneErr) setRsvpPhoneErr('');
                      }}
                      placeholder="0712 345 678"
                      className="font-mono-tabular"
                    />
                    <Input
                      label="Guests"
                      type="number"
                      min={1}
                      max={10}
                      value={rsvpGuests}
                      onChange={(e) => setRsvpGuests(Number(e.target.value))}
                      className="font-mono-tabular"
                    />
                    <ConsentCheckbox id="rsvp-consent" checked={consent} onChange={setConsent} />
                    <Button type="submit" fullWidth disabled={submitting}>
                      {submitting ? 'Confirming...' : 'Confirm RSVP'}
                    </Button>
                  </form>
                )}
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
};
