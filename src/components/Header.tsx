import React from 'react';
import {useApp} from '../context/AppContext';
import type {PageRoute} from '../types/church';

export const Header: React.FC = () => {
  const {route, navigate, t, setDirectoryOpen} = useApp();

  const navItems: Array<{id: PageRoute | 'directory'; label: string}> = [
    {id: 'visit', label: t.nav.visit},
    {id: 'sermons', label: t.nav.sermons},
    {id: 'events', label: t.nav.events},
    {id: 'ministries', label: t.nav.ministries},
    {id: 'directory', label: t.nav.menu},
  ];

  return (
    <header className="sticky top-0 z-40 h-14 border-b border-white/50 bg-[#FAFBFD]/72 backdrop-blur-md dark:border-slate-800/70 dark:bg-[#080E1A]/72 md:h-16">
      <div className="mx-auto flex h-full max-w-6xl items-center justify-between gap-8 px-4 sm:px-6">
        {/* Zone 1: Brand Wordmark */}
        <button
          type="button"
          onClick={() => navigate('home')}
          className="flex min-h-[44px] items-center gap-2.5 text-left whitespace-nowrap shrink-0"
        >
          <img src="/icon.svg" alt="PEFA Kenyatta logo" className="h-7 w-7 rounded-md shrink-0" />
          <span className="font-display text-lg font-bold tracking-tight text-slate-900 dark:text-white whitespace-nowrap shrink-0">
            PEFA Kenyatta
          </span>
        </button>

        {/* Zone 2: 5 single-line navigation links */}
        <nav aria-label="Primary navigation" className="hidden items-center gap-6 md:flex">
          {navItems.map((item) => {
            const isActive = item.id !== 'directory' && route === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  if (item.id === 'directory') setDirectoryOpen(true);
                  else navigate(item.id);
                }}
                className={`min-h-[44px] text-sm font-medium transition-colors whitespace-nowrap shrink-0 hover:underline hover:underline-offset-4 ${
                  isActive
                    ? 'text-[#1E3A8A] underline underline-offset-4 dark:text-amber-400'
                    : 'text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: Primary Give Action */}
        <div className="flex items-center shrink-0">
          <button
            type="button"
            onClick={() => navigate('give')}
            className="min-h-[44px] rounded-lg bg-[#1E3A8A] px-4 py-2 text-xs font-semibold text-white transition hover:bg-[#172D6E] dark:bg-amber-500 dark:text-slate-950 dark:hover:bg-amber-400 whitespace-nowrap shrink-0"
          >
            {t.nav.give}
          </button>
        </div>
      </div>
    </header>
  );
};
