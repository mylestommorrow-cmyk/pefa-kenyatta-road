import React from 'react';
import {
  BookOpen,
  Calendar,
  HeartHandshake,
  Home,
  Info,
  Lock,
  MapPin,
  MessageSquareQuote,
  Moon,
  Newspaper,
  ShieldCheck,
  Sun,
  UserCheck,
  Users,
  X,
} from 'lucide-react';
import {useApp} from '../context/AppContext';
import {PWAInstallButton} from './PWAComponents';
import type {PageRoute} from '../types/church';

export const DirectoryDrawer: React.FC = () => {
  const {directoryOpen, setDirectoryOpen, route, navigate, lang, setLang, theme, toggleTheme, t} = useApp();

  if (!directoryOpen) return null;

  const links: Array<{id: PageRoute; label: string; icon: React.ReactNode}> = [
    {id: 'home', label: t.nav.home, icon: <Home className="h-4 w-4" />},
    {id: 'visit', label: t.nav.visit, icon: <UserCheck className="h-4 w-4" />},
    {id: 'sermons', label: t.nav.sermons, icon: <BookOpen className="h-4 w-4" />},
    {id: 'events', label: t.nav.events, icon: <Calendar className="h-4 w-4" />},
    {id: 'ministries', label: t.nav.ministries, icon: <Users className="h-4 w-4" />},
    {id: 'groups', label: t.nav.groups, icon: <Users className="h-4 w-4" />},
    {id: 'prayer', label: t.nav.prayer, icon: <HeartHandshake className="h-4 w-4" />},
    {id: 'testimonies', label: t.nav.testimonies, icon: <MessageSquareQuote className="h-4 w-4" />},
    {id: 'news', label: t.nav.news, icon: <Newspaper className="h-4 w-4" />},
    {id: 'about', label: t.nav.about, icon: <Info className="h-4 w-4" />},
    {id: 'contact', label: t.nav.contact, icon: <MapPin className="h-4 w-4" />},
    {id: 'privacy', label: t.nav.privacy, icon: <ShieldCheck className="h-4 w-4" />},
  ];

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-950/50 backdrop-blur-sm" role="dialog" aria-modal="true" aria-label="Church directory">
      <div className="flex h-full w-full max-w-sm flex-col overflow-y-auto border-l border-white/50 bg-white/85 p-6 backdrop-blur-xl dark:border-slate-800/70 dark:bg-slate-950/85">
        <div className="flex items-center justify-between border-b border-slate-200 pb-4 dark:border-slate-800">
          <span className="font-display text-lg font-bold text-slate-900 dark:text-white">PEFA Kenyatta</span>
          <button
            type="button"
            onClick={() => setDirectoryOpen(false)}
            aria-label="Close directory"
            className="flex h-11 w-11 items-center justify-center rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-100 dark:border-slate-800 dark:text-slate-200 dark:hover:bg-slate-800"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Language & Theme Controls */}
        <div className="mt-5 flex flex-wrap items-center gap-3">
          <div className="flex items-center rounded-lg border border-slate-200 bg-slate-100 p-1 dark:border-slate-800 dark:bg-slate-900" role="group" aria-label="Language toggle">
            <button
              type="button"
              onClick={() => setLang('en')}
              className={`min-h-[36px] rounded-md px-3 text-xs font-semibold transition ${
                lang === 'en'
                  ? 'bg-white text-slate-900 shadow-sm dark:bg-slate-800 dark:text-white'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              English
            </button>
            <button
              type="button"
              onClick={() => setLang('sw')}
              className={`min-h-[36px] rounded-md px-3 text-xs font-semibold transition ${
                lang === 'sw'
                  ? 'bg-white text-slate-900 shadow-sm dark:bg-slate-800 dark:text-white'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              Kiswahili
            </button>
          </div>

          <button
            type="button"
            onClick={toggleTheme}
            aria-label="Toggle light or dark mode"
            className="inline-flex min-h-[44px] items-center gap-2 rounded-lg border border-slate-200 px-3.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:text-slate-200 dark:hover:bg-slate-900"
          >
            {theme === 'light' ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
            <span>{theme === 'light' ? 'Dark Mode' : 'Light Mode'}</span>
          </button>
        </div>

        {/* Navigation Links */}
        <div className="mt-6 grid grid-cols-1 gap-1">
          {links.map((item) => {
            const active = route === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => navigate(item.id)}
                className={`flex min-h-[44px] items-center gap-3 rounded-lg px-3 py-2 text-left text-sm font-medium transition ${
                  active
                    ? 'bg-[#1E3A8A]/10 text-[#1E3A8A] dark:bg-amber-500/15 dark:text-amber-300'
                    : 'text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-900'
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>

        {/* Portals & Install */}
        <div className="mt-6 space-y-2.5 border-t border-slate-200 pt-5 dark:border-slate-800">
          <button
            type="button"
            onClick={() => navigate('member')}
            className="flex min-h-[44px] w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm font-semibold text-slate-900 hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-900 dark:text-white dark:hover:bg-slate-800"
          >
            <UserCheck className="h-4 w-4" />
            <span>{t.nav.member}</span>
          </button>

          <button
            type="button"
            onClick={() => navigate('admin')}
            className="flex min-h-[44px] w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200 dark:hover:bg-slate-900"
          >
            <Lock className="h-4 w-4" />
            <span>{t.nav.admin}</span>
          </button>

          <div className="pt-2">
            <PWAInstallButton />
          </div>
        </div>
      </div>
    </div>
  );
};
