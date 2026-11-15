import React from 'react';
import {BookOpen, Calendar, HeartHandshake, Home, Menu} from 'lucide-react';
import {useApp} from '../context/AppContext';
import type {PageRoute} from '../types/church';

export const MobileBottomNav: React.FC = () => {
  const {route, navigate, t, setDirectoryOpen} = useApp();

  const tabs: Array<{id: PageRoute | 'more'; label: string; icon: React.ReactNode}> = [
    {id: 'home', label: t.nav.home, icon: <Home className="h-5 w-5" aria-hidden="true" />},
    {id: 'sermons', label: t.nav.sermons, icon: <BookOpen className="h-5 w-5" aria-hidden="true" />},
    {id: 'events', label: t.nav.events, icon: <Calendar className="h-5 w-5" aria-hidden="true" />},
    {id: 'give', label: t.nav.give, icon: <HeartHandshake className="h-5 w-5" aria-hidden="true" />},
    {id: 'more', label: t.nav.menu, icon: <Menu className="h-5 w-5" aria-hidden="true" />},
  ];

  return (
    <nav
      aria-label="Mobile quick navigation"
      className="fixed bottom-0 left-0 right-0 z-40 border-t border-white/50 bg-white/78 backdrop-blur-md dark:border-slate-800/70 dark:bg-[#080E1A]/78 md:hidden"
    >
      <div className="grid h-14 grid-cols-5 items-center">
        {tabs.map((tab) => {
          const active = tab.id !== 'more' && route === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => {
                if (tab.id === 'more') setDirectoryOpen(true);
                else navigate(tab.id);
              }}
              aria-current={active ? 'page' : undefined}
              className={`flex h-full flex-col items-center justify-center gap-0.5 text-[11px] font-semibold transition-colors ${
                active
                  ? 'text-[#1E3A8A] dark:text-amber-400'
                  : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
              }`}
            >
              {tab.icon}
              <span className="max-w-[68px] truncate">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
