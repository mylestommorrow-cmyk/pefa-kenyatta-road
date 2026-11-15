import React, {useMemo, useState} from 'react';
import {Bookmark, Check, Download, Play, Search} from 'lucide-react';
import {useApp} from '../context/AppContext';
import {CHURCH_IMAGES} from '../data/assets';
import {SafeImage} from '../components/SafeImage';
import {Button, Card, EmptyState, SkeletonCard, Tabs} from '../components/ui';
import type {Sermon} from '../types/church';

export const SermonsPage: React.FC = () => {
  const {
    bundle,
    loadingBundle,
    lang,
    savedSermonIds,
    toggleSavedSermon,
    setActiveSermon,
    sermonProgress,
  } = useApp();
  const [viewTab, setViewTab] = useState<'latest' | 'series'>('latest');
  const [query, setQuery] = useState('');
  const [seriesFilter, setSeriesFilter] = useState('All');
  const [preacherFilter, setPreacherFilter] = useState('All');

  const sermons = bundle?.sermons || [];

  const seriesList = useMemo(
    () => ['All', ...Array.from(new Set(sermons.map((s) => s.series)))],
    [sermons]
  );

  const preacherList = useMemo(
    () => ['All', ...Array.from(new Set(sermons.map((s) => s.preacher)))],
    [sermons]
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return sermons.filter((s) => {
      if (seriesFilter !== 'All' && s.series !== seriesFilter) return false;
      if (preacherFilter !== 'All' && s.preacher !== preacherFilter) return false;
      if (!q) return true;
      return (
        s.title.toLowerCase().includes(q) ||
        (s.title_sw || '').toLowerCase().includes(q) ||
        s.preacher.toLowerCase().includes(q) ||
        s.scripture.toLowerCase().includes(q) ||
        s.series.toLowerCase().includes(q)
      );
    });
  }, [sermons, query, seriesFilter, preacherFilter]);

  const groupedBySeries = useMemo(() => {
    const map = new Map<string, Sermon[]>();
    filtered.forEach((s) => {
      const arr = map.get(s.series) || [];
      arr.push(s);
      map.set(s.series, arr);
    });
    return Array.from(map.entries());
  }, [filtered]);

  const downloadSermonNotes = (sermon: Sermon) => {
    const text = [
      `PEFA CHURCH, KENYATTA BRANCH — SERMON STUDY NOTES`,
      `Title: ${sermon.title}`,
      `Preacher: ${sermon.preacher}`,
      `Date: ${sermon.sermon_date}`,
      `Series: ${sermon.series}`,
      `Scripture: ${sermon.scripture}`,
      ``,
      `Summary:`,
      sermon.summary,
      ``,
      `Cell Group Discussion Questions:`,
      `1. What stood out to you most from ${sermon.scripture}?`,
      `2. How can you live out this message in your home or workplace this week?`,
    ].join('\n');

    const blob = new Blob([text], {type: 'text/plain;charset=utf-8'});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${sermon.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-notes.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const renderSermonCard = (sermon: Sermon) => {
    const isSaved = savedSermonIds.includes(sermon.id);
    const progressSec = sermonProgress[sermon.id] || 0;
    return (
      <Card key={sermon.id} padding="sm" className="flex flex-col justify-between overflow-hidden p-0">
        <div>
          <div className="relative aspect-[16/9] w-full overflow-hidden border-b border-slate-200 dark:border-slate-800">
            <SafeImage
              src={sermon.thumbnail_url || CHURCH_IMAGES.heroWorship}
              alt={`${sermon.title} sermon thumbnail`}
              className="h-full w-full object-cover"
              fallbackTitle={sermon.series}
            />
            <div className="pointer-events-none absolute bottom-2 right-2 rounded-md bg-slate-950/80 px-2 py-0.5 font-mono-tabular text-xs font-semibold text-white">
              {sermon.duration || '40 min'}
            </div>
          </div>
          <div className="p-5">
            <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
              <span className="font-semibold text-[#1E3A8A] dark:text-amber-400">{sermon.series}</span>
              <span aria-hidden="true">·</span>
              <span className="font-mono-tabular">{sermon.sermon_date}</span>
              <span aria-hidden="true">·</span>
              <span>{sermon.scripture}</span>
            </div>
            <h2 className="mt-2 font-display text-xl font-bold text-slate-900 dark:text-white">
              {lang === 'sw' && sermon.title_sw ? sermon.title_sw : sermon.title}
            </h2>
            <p className="mt-1 text-sm font-medium text-slate-600 dark:text-slate-300">
              {sermon.preacher}
              {progressSec > 0 ? ` · Left off at ${Math.floor(progressSec / 60)}m` : ''}
            </p>
            <p className="mt-2.5 max-w-[65ch] text-base leading-relaxed text-slate-600 dark:text-slate-300">
              {sermon.summary}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 border-t border-slate-100 px-5 py-4 dark:border-slate-800">
          <Button size="sm" onClick={() => setActiveSermon(sermon)}>
            <Play className="h-3.5 w-3.5" />
            <span>{progressSec > 0 ? 'Resume' : 'Watch / Listen'}</span>
          </Button>
          <Button variant="secondary" size="sm" onClick={() => downloadSermonNotes(sermon)}>
            <Download className="h-3.5 w-3.5" />
            <span>Notes</span>
          </Button>
          <Button variant="secondary" size="sm" onClick={() => toggleSavedSermon(sermon.id)}>
            {isSaved ? <Check className="h-3.5 w-3.5" /> : <Bookmark className="h-3.5 w-3.5" />}
            <span>{isSaved ? 'Saved' : 'Save'}</span>
          </Button>
        </div>
      </Card>
    );
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <p className="text-xs font-semibold text-[#1E3A8A] dark:text-amber-400">
            {lang === 'sw' ? 'Maktaba ya Mahubiri' : 'Sermon Archive'}
          </p>
          <h1 className="mt-2 font-display text-3xl font-bold text-slate-900 dark:text-white sm:text-4xl">
            {lang === 'sw' ? 'Neno la Mungu kwa Kila Wiki' : 'Watch, listen & download study notes'}
          </h1>
        </div>
        <Tabs
          ariaLabel="Sermon view"
          activeTab={viewTab}
          onChange={setViewTab}
          tabs={[
            {id: 'latest', label: 'Latest Messages'},
            {id: 'series', label: 'By Series'},
          ]}
        />
      </div>

      {/* Search & Filter Toolbar */}
      <Card padding="sm" className="mt-6 grid gap-3 md:grid-cols-12">
        <div className="relative md:col-span-5">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search title, scripture (e.g. Jeremiah 17), or preacher..."
            aria-label="Search sermons"
            className="w-full min-h-[44px] rounded-xl border border-slate-200 bg-[#FAFBFD] pl-10 pr-4 text-base text-slate-900 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
          />
        </div>

        <div className="md:col-span-4">
          <select
            aria-label="Filter by series"
            value={seriesFilter}
            onChange={(e) => setSeriesFilter(e.target.value)}
            className="w-full min-h-[44px] rounded-xl border border-slate-200 bg-[#FAFBFD] px-3.5 text-base text-slate-900 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
          >
            {seriesList.map((s) => (
              <option key={s} value={s}>
                {s === 'All' ? 'All Sermon Series' : `Series: ${s}`}
              </option>
            ))}
          </select>
        </div>

        <div className="md:col-span-3">
          <select
            aria-label="Filter by preacher"
            value={preacherFilter}
            onChange={(e) => setPreacherFilter(e.target.value)}
            className="w-full min-h-[44px] rounded-xl border border-slate-200 bg-[#FAFBFD] px-3.5 text-base text-slate-900 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
          >
            {preacherList.map((p) => (
              <option key={p} value={p}>
                {p === 'All' ? 'All Preachers' : p}
              </option>
            ))}
          </select>
        </div>
      </Card>

      {loadingBundle && sermons.length === 0 ? (
        <div className="mt-8 grid gap-6 md:grid-cols-2">
          <SkeletonCard lines={3} />
          <SkeletonCard lines={3} />
        </div>
      ) : filtered.length === 0 ? (
        <div className="mt-8">
          <EmptyState
            title="No sermons match that search"
            description="Try clearing your search keyword or resetting the series and preacher filters."
            actionLabel="Reset filters"
            onAction={() => {
              setQuery('');
              setSeriesFilter('All');
              setPreacherFilter('All');
            }}
          />
        </div>
      ) : viewTab === 'latest' ? (
        <div className="mt-8 grid gap-6 md:grid-cols-2">{filtered.map(renderSermonCard)}</div>
      ) : (
        <div className="mt-8 space-y-10">
          {groupedBySeries.map(([seriesName, items]) => (
            <section key={seriesName}>
              <h2 className="font-display text-2xl font-bold text-slate-900 dark:text-white">
                {seriesName} ({items.length})
              </h2>
              <div className="mt-4 grid gap-6 md:grid-cols-2">{items.map(renderSermonCard)}</div>
            </section>
          ))}
        </div>
      )}
    </div>
  );
};
