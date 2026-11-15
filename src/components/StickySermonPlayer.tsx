import React, {useEffect, useRef, useState} from 'react';
import {ExternalLink, Maximize2, Minimize2, Play, X} from 'lucide-react';
import {useApp} from '../context/AppContext';

function getYoutubeId(url?: string): string | null {
  if (!url) return null;
  const match = url.match(/(?:v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
  return match ? match[1] : null;
}

export const StickySermonPlayer: React.FC = () => {
  const {activeSermon, setActiveSermon, sermonProgress, saveSermonProgress} = useApp();
  const [expanded, setExpanded] = useState(true);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (activeSermon && audioRef.current) {
      const savedSec = sermonProgress[activeSermon.id] || 0;
      if (savedSec > 2 && Math.abs(audioRef.current.currentTime - savedSec) > 3) {
        audioRef.current.currentTime = savedSec;
      }
    }
  }, [activeSermon, sermonProgress]);

  if (!activeSermon) return null;

  const ytId = getYoutubeId(activeSermon.youtube_url);
  const savedSeconds = sermonProgress[activeSermon.id] || 0;
  const savedLabel = savedSeconds > 0 ? `Resumed at ${Math.floor(savedSeconds / 60)}m ${savedSeconds % 60}s` : null;

  return (
    <aside
      aria-label="Sticky sermon player"
      className="fixed bottom-16 left-3 right-3 z-30 mx-auto max-w-2xl rounded-2xl border border-white/60 bg-white/82 p-3 shadow-lg backdrop-blur-xl dark:border-slate-700/70 dark:bg-slate-900/82 md:bottom-4"
    >
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0 flex-1">
          <p className="truncate text-xs font-semibold text-[#1E3A8A] dark:text-amber-400">
            {activeSermon.series} · {activeSermon.scripture}
            {savedLabel ? ` · ${savedLabel}` : ''}
          </p>
          <p className="truncate text-sm font-bold text-slate-900 dark:text-white">
            {activeSermon.title}
          </p>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          {activeSermon.youtube_url && (
            <a
              href={activeSermon.youtube_url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Open on YouTube"
              className="flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300"
            >
              <ExternalLink className="h-4 w-4" />
            </a>
          )}
          <button
            type="button"
            onClick={() => setExpanded((e) => !e)}
            aria-label={expanded ? 'Minimize player' : 'Expand player'}
            className="flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300"
          >
            {expanded ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
          </button>
          <button
            type="button"
            onClick={() => setActiveSermon(null)}
            aria-label="Close sermon player"
            className="flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>

      {expanded && (
        <div className="mt-3">
          {activeSermon.audio_url ? (
            <audio
              ref={audioRef}
              controls
              className="w-full"
              src={activeSermon.audio_url}
              onTimeUpdate={(e) => {
                const sec = Math.floor(e.currentTarget.currentTime);
                if (sec > 0 && sec % 5 === 0) {
                  saveSermonProgress(activeSermon.id, sec);
                }
              }}
            />
          ) : ytId ? (
            <div className="aspect-video w-full overflow-hidden rounded-xl bg-slate-950">
              <iframe
                title={activeSermon.title}
                src={`https://www.youtube.com/embed/${ytId}?rel=0${savedSeconds > 0 ? `&start=${savedSeconds}` : ''}`}
                className="h-full w-full"
                loading="lazy"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          ) : (
            <div className="flex items-center gap-2 rounded-xl bg-slate-50 p-3 text-xs text-slate-600 dark:bg-slate-950 dark:text-slate-300">
              <Play className="h-4 w-4 shrink-0" />
              <span>{activeSermon.summary}</span>
            </div>
          )}
        </div>
      )}
    </aside>
  );
};
