import React from 'react';
import {
  ArrowRight,
  BookOpen,
  Calendar,
  ExternalLink,
  MapPin,
  Moon,
  Phone,
  Play,
  Radio,
  Sun,
  UserCheck,
} from 'lucide-react';
import {CHURCH_CONFIG} from '../config/church';
import {useApp} from '../context/AppContext';
import {CHURCH_IMAGES} from '../data/assets';
import {SafeImage} from '../components/SafeImage';
import {LazyMap} from '../components/LazyMap';
import {Button, Card, EmptyState, SkeletonCard} from '../components/ui';

export const HomePage: React.FC = () => {
  const {bundle, loadingBundle, navigate, t, lang, setLang, theme, toggleTheme, setActiveSermon} = useApp();

  const settings = bundle?.settings;
  const latestSermon = bundle?.sermons?.[0];
  const upcomingEvents = bundle?.events?.slice(0, 3) || [];
  const announcements = bundle?.announcements?.slice(0, 3) || [];
  const testimonies = bundle?.testimonies?.slice(0, 2) || [];

  return (
    <div>
      {/* Admin-Controlled Live Service Banner */}
      {settings?.is_live && (
        <div className="border-b border-amber-300/60 bg-amber-50 dark:border-amber-800/50 dark:bg-amber-950/50">
          <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-6">
            <div className="flex items-center gap-3">
              <Radio className="h-5 w-5 shrink-0 text-amber-700 dark:text-amber-400" aria-hidden="true" />
              <div className="text-sm">
                <span className="font-bold text-amber-950 dark:text-amber-200">{t.hero.liveNow}</span>
                <span className="mx-2 text-amber-700 dark:text-amber-500" aria-hidden="true">·</span>
                <span className="text-amber-900 dark:text-amber-100">{settings.live_title}</span>
              </div>
            </div>
            <a
              href={settings.live_url || CHURCH_CONFIG.socials.youtube}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-[44px] items-center gap-2 rounded-xl bg-[#1E3A8A] px-4 py-2 text-xs font-semibold text-white transition hover:bg-[#172D6E] dark:bg-amber-500 dark:text-slate-950 whitespace-nowrap shrink-0"
            >
              <span>{t.hero.watchLive}</span>
              <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
            </a>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <section className="mx-auto max-w-6xl px-4 pb-12 pt-8 sm:px-6 lg:pt-12">
        <div className="grid items-stretch gap-8 lg:grid-cols-12">
          <div className="flex flex-col justify-between rounded-2xl border border-white/60 bg-white/70 p-6 backdrop-blur-md dark:border-slate-700/60 dark:bg-slate-900/65 lg:col-span-6 lg:p-8">
            <div>
              <p className="text-xs font-semibold tracking-wide text-[#1E3A8A] dark:text-amber-400">
                {t.hero.kicker}
              </p>
              <h1 className="mt-3 font-display text-3xl font-bold leading-[1.12] tracking-tight text-slate-900 dark:text-white sm:text-5xl">
                {t.hero.title}
              </h1>
              <p className="mt-4 max-w-[65ch] text-base leading-relaxed text-slate-700 dark:text-slate-200">
                {t.hero.subtitle}
              </p>

              <p className="mt-5 font-mono-tabular text-xs font-semibold text-slate-800 dark:text-slate-200">
                {t.hero.nextService} · {CHURCH_CONFIG.address}
              </p>

              <div className="mt-7 flex flex-wrap items-center gap-3">
                <Button size="lg" onClick={() => navigate('visit')}>
                  <span>{t.hero.ctaNew}</span>
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Button>
                <Button variant="secondary" size="lg" onClick={() => navigate('give')}>
                  <span>{t.hero.ctaGive}</span>
                </Button>
              </div>
            </div>

            {/* Language, Theme & Member Utility Bar */}
            <div className="mt-8 flex flex-wrap items-center gap-3 border-t border-slate-200/80 pt-5 dark:border-slate-700/60">
              <div
                className="flex items-center rounded-xl border border-slate-200/80 bg-white/80 p-0.5 backdrop-blur-sm dark:border-slate-700/80 dark:bg-slate-900/75"
                role="group"
                aria-label="Language switcher"
              >
                <button
                  type="button"
                  onClick={() => setLang('en')}
                  className={`min-h-[38px] rounded-lg px-3.5 text-xs font-semibold transition ${
                    lang === 'en'
                      ? 'bg-[#1E3A8A] text-white dark:bg-amber-500 dark:text-slate-950'
                      : 'text-slate-600 dark:text-slate-400'
                  }`}
                >
                  English
                </button>
                <button
                  type="button"
                  onClick={() => setLang('sw')}
                  className={`min-h-[38px] rounded-lg px-3.5 text-xs font-semibold transition ${
                    lang === 'sw'
                      ? 'bg-[#1E3A8A] text-white dark:bg-amber-500 dark:text-slate-950'
                      : 'text-slate-600 dark:text-slate-400'
                  }`}
                >
                  Kiswahili
                </button>
              </div>

              <button
                type="button"
                onClick={toggleTheme}
                aria-label="Switch color theme"
                className="inline-flex min-h-[44px] items-center gap-1.5 rounded-xl border border-slate-200/80 bg-white/80 px-3.5 text-xs font-semibold text-slate-700 backdrop-blur-sm hover:bg-white dark:border-slate-700/80 dark:bg-slate-900/75 dark:text-slate-200 dark:hover:bg-slate-800"
              >
                {theme === 'light' ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
                <span>{theme === 'light' ? 'Dark' : 'Light'}</span>
              </button>

              <button
                type="button"
                onClick={() => navigate('member')}
                className="inline-flex min-h-[44px] items-center gap-1.5 rounded-xl border border-slate-200/80 bg-white/80 px-3.5 text-xs font-semibold text-slate-700 backdrop-blur-sm hover:bg-white dark:border-slate-700/80 dark:bg-slate-900/75 dark:text-slate-200 dark:hover:bg-slate-800"
              >
                <UserCheck className="h-4 w-4" />
                <span>{t.nav.member}</span>
              </button>
            </div>
          </div>

          <div className="lg:col-span-6">
            <div className="relative aspect-[16/10] overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800 lg:aspect-auto lg:h-full lg:min-h-[420px]">
              <SafeImage
                src={CHURCH_IMAGES.heroWorship}
                alt="PEFA Church Kenyatta Sunday worship congregation in Nairobi"
                eager
                className="h-full w-full object-cover"
                fallbackTitle="PEFA Kenyatta Sanctuary"
              />
              <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-950/80 via-slate-950/30 to-transparent p-5">
                <p className="text-xs font-medium text-amber-300">Kenyatta Market Road · Nairobi</p>
                <p className="mt-0.5 text-sm font-semibold text-white">
                  {lang === 'sw'
                    ? 'Ibada za Jumapili: Saa 2:00 Asubuhi & Saa 4:30 Asubuhi'
                    : 'Sunday Services at 8:00 AM & 10:30 AM'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Service Times Strip */}
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {CHURCH_CONFIG.services.map((svc) => (
            <Card key={svc.name} padding="md">
              <p className="font-mono-tabular text-xs font-semibold text-[#1E3A8A] dark:text-amber-400">
                {svc.time}
              </p>
              <h2 className="mt-2 font-sans text-base font-semibold text-slate-900 dark:text-white">
                {lang === 'sw' ? svc.nameSw : svc.name}
              </h2>
              <p className="mt-1.5 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                {svc.notes}
              </p>
            </Card>
          ))}
        </div>
      </section>

      {/* Daily Verse & Latest Sermon Split */}
      <section className="border-y border-white/50 bg-white/45 py-12 backdrop-blur-sm dark:border-slate-800/70 dark:bg-slate-950/48">
        <div className="mx-auto grid max-w-6xl gap-8 px-4 sm:px-6 lg:grid-cols-12">
          <Card className="flex flex-col justify-between bg-white/75 dark:bg-slate-900/72 lg:col-span-5">
            <div>
              <div className="flex items-center justify-between gap-2 text-xs font-semibold text-[#B45309] dark:text-amber-400">
                <span>{t.sections.dailyVerse}</span>
                <span className="font-mono-tabular">{settings?.daily_verse_ref || 'Psalm 122:1'}</span>
              </div>
              <blockquote className="mt-4 font-display text-xl font-semibold leading-snug text-slate-900 dark:text-white">
                {lang === 'sw'
                  ? settings?.daily_verse_sw || '"Nalifurahi waliponiambia, Na twende nyumbani mwa Bwana."'
                  : settings?.daily_verse_text || '"I rejoiced with those who said to me, Let us go to the house of the Lord."'}
              </blockquote>
              <p className="mt-4 max-w-[65ch] text-base leading-relaxed text-slate-600 dark:text-slate-300">
                {settings?.daily_devotional}
              </p>
            </div>
            <div className="mt-6 border-t border-slate-200 pt-4 dark:border-slate-800">
              <Button variant="ghost" size="sm" onClick={() => navigate('prayer')}>
                <span>Need prayer today? Share a request</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            </div>
          </Card>

          <div className="lg:col-span-7">
            {loadingBundle && !latestSermon ? (
              <SkeletonCard lines={4} />
            ) : latestSermon ? (
              <Card className="flex h-full flex-col justify-between">
                <div>
                  <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                    <span className="font-semibold text-[#1E3A8A] dark:text-amber-400">
                      {t.sections.latestSermon}
                    </span>
                    <span aria-hidden="true">·</span>
                    <span>{latestSermon.series}</span>
                    <span aria-hidden="true">·</span>
                    <span className="font-mono-tabular">{latestSermon.sermon_date}</span>
                  </div>
                  <h2 className="mt-3 font-display text-2xl font-bold text-slate-900 dark:text-white">
                    {lang === 'sw' && latestSermon.title_sw ? latestSermon.title_sw : latestSermon.title}
                  </h2>
                  <p className="mt-2 text-sm font-medium text-slate-600 dark:text-slate-300">
                    {latestSermon.preacher} · {latestSermon.scripture} · {latestSermon.duration || '40 min'}
                  </p>
                  <p className="mt-3 max-w-[65ch] text-base leading-relaxed text-slate-600 dark:text-slate-300">
                    {latestSermon.summary}
                  </p>
                </div>

                <div className="mt-6 flex flex-wrap items-center gap-3">
                  <Button onClick={() => setActiveSermon(latestSermon)}>
                    <Play className="h-4 w-4" aria-hidden="true" />
                    <span>Listen / Watch Now</span>
                  </Button>
                  <Button variant="secondary" onClick={() => navigate('sermons')}>
                    <BookOpen className="h-4 w-4" aria-hidden="true" />
                    <span>{t.sections.viewAllSermons}</span>
                  </Button>
                </div>
              </Card>
            ) : (
              <EmptyState
                title="No sermons published yet"
                description="Check back after Sunday's service for the latest teaching."
              />
            )}
          </div>
        </div>
      </section>

      {/* Upcoming Events & Announcements */}
      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <div className="flex items-end justify-between gap-4">
              <div>
                <h2 className="font-display text-2xl font-bold text-slate-900 dark:text-white">
                  {t.sections.upcomingEvents}
                </h2>
                <p className="mt-1 text-base text-slate-600 dark:text-slate-400">
                  Gatherings across Kenyatta Estate, Ngumo, and the main sanctuary.
                </p>
              </div>
              <Button variant="ghost" size="sm" onClick={() => navigate('events')}>
                {t.sections.viewAllEvents}
              </Button>
            </div>

            <div className="mt-6">
              {loadingBundle && upcomingEvents.length === 0 ? (
                <SkeletonCard lines={4} />
              ) : upcomingEvents.length === 0 ? (
                <EmptyState
                  title="No events scheduled this week"
                  description="Sunday worship gathers as usual at 8:00 AM and 10:30 AM."
                />
              ) : (
                <div className="divide-y divide-slate-200/70 rounded-2xl border border-white/60 bg-white/76 backdrop-blur-md dark:divide-slate-700/60 dark:border-slate-700/60 dark:bg-slate-900/72">
                  {upcomingEvents.map((ev) => {
                    const start = new Date(ev.start_at);
                    return (
                      <div key={ev.id} className="flex flex-col gap-3 p-5 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                          <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                            <span className="font-semibold text-[#1E3A8A] dark:text-amber-400">{ev.category}</span>
                            <span aria-hidden="true">·</span>
                            <span className="font-mono-tabular">
                              {start.toLocaleDateString('en-KE', {weekday: 'short', month: 'short', day: 'numeric'})} ·{' '}
                              {start.toLocaleTimeString('en-KE', {hour: '2-digit', minute: '2-digit'})}
                            </span>
                          </div>
                          <h3 className="mt-1 text-base font-semibold text-slate-900 dark:text-white">
                            {lang === 'sw' && ev.title_sw ? ev.title_sw : ev.title}
                          </h3>
                          <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">{ev.location}</p>
                        </div>
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => navigate('events')}
                          className="self-start sm:self-center"
                        >
                          <Calendar className="h-3.5 w-3.5" aria-hidden="true" />
                          <span>Details &amp; RSVP</span>
                        </Button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          <div className="lg:col-span-5">
            <h2 className="font-display text-2xl font-bold text-slate-900 dark:text-white">
              {t.sections.announcements}
            </h2>
            <p className="mt-1 text-base text-slate-600 dark:text-slate-400">
              Weekly family updates &amp; ministry notices.
            </p>
            <div className="mt-6 space-y-4">
              {announcements.map((item) => (
                <Card key={item.id} padding="md">
                  <div className="flex items-center justify-between gap-2 text-xs text-slate-500 dark:text-slate-400">
                    <span className="font-semibold text-[#B45309] dark:text-amber-400">
                      {item.priority === 'important' ? 'Important Notice' : 'Church Update'}
                    </span>
                    {item.event_date && <span className="font-mono-tabular">{item.event_date}</span>}
                  </div>
                  <h3 className="mt-1.5 text-base font-semibold text-slate-900 dark:text-white">
                    {lang === 'sw' && item.title_sw ? item.title_sw : item.title}
                  </h3>
                  <p className="mt-1.5 text-base leading-relaxed text-slate-600 dark:text-slate-300">
                    {lang === 'sw' && item.body_sw ? item.body_sw : item.body}
                  </p>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Pastor Welcome & Lazy Location Map */}
      <section className="border-t border-white/50 bg-white/45 py-12 backdrop-blur-sm dark:border-slate-800/70 dark:bg-slate-950/48">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="grid items-stretch gap-8 lg:grid-cols-12">
            <div className="lg:col-span-4">
              <div className="aspect-square overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800 lg:aspect-auto lg:h-full">
                <SafeImage
                  src={CHURCH_IMAGES.pastorDavid}
                  alt="Rev. David Mwangi, Senior Pastor at PEFA Kenyatta"
                  className="h-full w-full object-cover"
                  fallbackTitle="Rev. David Mwangi"
                />
              </div>
            </div>
            <div className="flex flex-col justify-between lg:col-span-8">
              <div>
                <p className="text-xs font-semibold text-[#1E3A8A] dark:text-amber-400">
                  {t.sections.pastorWelcome}
                </p>
                <h2 className="mt-2 font-display text-2xl font-bold text-slate-900 dark:text-white sm:text-3xl">
                  “You belong before you even believe everything.”
                </h2>
                <p className="mt-4 max-w-[65ch] text-base leading-relaxed text-slate-600 dark:text-slate-300">
                  {t.sections.pastorWelcomeLead}
                </p>
                <p className="mt-3 text-sm font-semibold text-slate-900 dark:text-white">
                  — {CHURCH_CONFIG.seniorPastor}, Senior Pastor
                </p>
              </div>

              {testimonies.length > 0 && (
                <div className="mt-8 grid gap-4 border-t border-slate-200 pt-6 dark:border-slate-800 sm:grid-cols-2">
                  {testimonies.map((item) => (
                    <Card key={item.id} padding="sm" className="bg-white/70 dark:bg-slate-900/65">
                      <p className="text-xs font-semibold text-[#B45309] dark:text-amber-400">{item.title}</p>
                      <p className="mt-1.5 text-sm leading-relaxed text-slate-600 dark:text-slate-300 line-clamp-3">
                        “{item.story}”
                      </p>
                      <p className="mt-2 text-xs font-semibold text-slate-800 dark:text-slate-200">
                        {item.author_name} · PEFA Kenyatta Member
                      </p>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="mt-12 grid items-center gap-6 rounded-2xl border border-white/60 bg-white/72 p-6 backdrop-blur-md dark:border-slate-700/60 dark:bg-slate-900/70 md:grid-cols-12">
            <div className="md:col-span-7">
              <p className="text-xs font-semibold text-[#1E3A8A] dark:text-amber-400">Find Us This Sunday</p>
              <h3 className="mt-1 font-display text-xl font-bold text-slate-900 dark:text-white">
                {CHURCH_CONFIG.address}
              </h3>
              <p className="mt-2 text-base text-slate-600 dark:text-slate-300">{CHURCH_CONFIG.landmarks}</p>
              <div className="mt-4 flex flex-wrap gap-3">
                <Button onClick={() => navigate('contact')}>
                  <MapPin className="h-4 w-4" aria-hidden="true" />
                  <span>Map &amp; Directions</span>
                </Button>
                <a
                  href={`https://wa.me/${CHURCH_CONFIG.whatsappNumber}?text=${encodeURIComponent('Hello PEFA Kenyatta, I need directions for Sunday service.')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-[44px] items-center gap-2 rounded-xl border border-slate-300/80 bg-white/80 px-5 py-2.5 text-sm font-semibold text-slate-800 backdrop-blur-sm hover:bg-white dark:border-slate-700/80 dark:bg-slate-950/75 dark:text-slate-200"
                >
                  <Phone className="h-4 w-4" aria-hidden="true" />
                  <span>Chat on WhatsApp</span>
                </a>
              </div>
            </div>
            <div className="overflow-hidden rounded-xl border border-slate-200 dark:border-slate-800 md:col-span-5">
              <LazyMap heightClass="h-48" />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
