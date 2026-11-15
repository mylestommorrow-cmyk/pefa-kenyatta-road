import React from 'react';
import {CHURCH_CONFIG} from '../config/church';
import {useApp} from '../context/AppContext';
import {PWAInstallButton} from './PWAComponents';

export const Footer: React.FC = () => {
  const {navigate, t, lang, setLang, theme, toggleTheme} = useApp();

  return (
    <footer className="relative z-10 border-t border-white/50 bg-white/74 pb-20 pt-12 text-sm text-slate-700 backdrop-blur-md dark:border-slate-800/70 dark:bg-slate-950/74 dark:text-slate-300 md:pb-12">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="grid gap-10 md:grid-cols-4">
          <div className="md:col-span-1">
            <div className="flex items-center gap-2.5">
              <img src="/icon.svg" alt="PEFA Kenyatta emblem" className="h-7 w-7 rounded-md" />
              <span className="font-display text-lg font-bold text-slate-900 dark:text-white">
                PEFA Kenyatta
              </span>
            </div>
            <p className="mt-3 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
              {lang === 'sw' ? CHURCH_CONFIG.taglineSw : CHURCH_CONFIG.tagline}
            </p>
            <div className="mt-4 flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => setLang(lang === 'en' ? 'sw' : 'en')}
                className="min-h-[40px] rounded-lg border border-slate-200 px-3 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:text-slate-200 dark:hover:bg-slate-900"
              >
                {lang === 'en' ? 'Kiswahili' : 'English'}
              </button>
              <button
                type="button"
                onClick={toggleTheme}
                className="min-h-[40px] rounded-lg border border-slate-200 px-3 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:text-slate-200 dark:hover:bg-slate-900"
              >
                {theme === 'light' ? 'Dark' : 'Light'}
              </button>
            </div>
            <div className="mt-3">
              <PWAInstallButton compact />
            </div>
          </div>

          <div>
            <h3 className="text-xs font-semibold tracking-wider text-slate-900 dark:text-white">
              {t.footer.addressLabel}
            </h3>
            <p className="mt-3 text-sm leading-relaxed">
              {CHURCH_CONFIG.address}
              <br />
              <span className="text-xs text-slate-500 dark:text-slate-400">{CHURCH_CONFIG.landmarks}</span>
            </p>
            <p className="mt-3 font-mono-tabular text-xs text-slate-700 dark:text-slate-300">
              {CHURCH_CONFIG.phone}
              <br />
              {CHURCH_CONFIG.email}
            </p>
            <div className="mt-3 flex flex-wrap gap-3 text-xs font-medium">
              <a
                href={`https://wa.me/${CHURCH_CONFIG.whatsappNumber}?text=${encodeURIComponent('Habari! I would like to connect with PEFA Kenyatta.')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#1E3A8A] underline underline-offset-2 dark:text-amber-400"
              >
                WhatsApp
              </a>
              <a href={CHURCH_CONFIG.socials.youtube} target="_blank" rel="noopener noreferrer" className="hover:underline">
                YouTube
              </a>
              <a href={CHURCH_CONFIG.socials.facebook} target="_blank" rel="noopener noreferrer" className="hover:underline">
                Facebook
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-xs font-semibold tracking-wider text-slate-900 dark:text-white">
              {t.footer.quickLinks}
            </h3>
            <ul className="mt-3 space-y-2">
              <li><button type="button" onClick={() => navigate('visit')} className="hover:underline">{t.nav.visit}</button></li>
              <li><button type="button" onClick={() => navigate('about')} className="hover:underline">{t.nav.about}</button></li>
              <li><button type="button" onClick={() => navigate('ministries')} className="hover:underline">{t.nav.ministries}</button></li>
              <li><button type="button" onClick={() => navigate('sermons')} className="hover:underline">{t.nav.sermons}</button></li>
              <li><button type="button" onClick={() => navigate('events')} className="hover:underline">{t.nav.events}</button></li>
              <li><button type="button" onClick={() => navigate('groups')} className="hover:underline">{t.nav.groups}</button></li>
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-semibold tracking-wider text-slate-900 dark:text-white">
              {t.footer.connect}
            </h3>
            <ul className="mt-3 space-y-2">
              <li><button type="button" onClick={() => navigate('give')} className="font-semibold text-[#1E3A8A] hover:underline dark:text-amber-400">{t.nav.give}</button></li>
              <li><button type="button" onClick={() => navigate('prayer')} className="hover:underline">{t.nav.prayer}</button></li>
              <li><button type="button" onClick={() => navigate('testimonies')} className="hover:underline">{t.nav.testimonies}</button></li>
              <li><button type="button" onClick={() => navigate('news')} className="hover:underline">{t.nav.news}</button></li>
              <li><button type="button" onClick={() => navigate('member')} className="hover:underline">{t.nav.member}</button></li>
              <li><button type="button" onClick={() => navigate('admin')} className="hover:underline">{t.nav.admin}</button></li>
              <li><button type="button" onClick={() => navigate('privacy')} className="hover:underline">{t.footer.dataProtection}</button></li>
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-col justify-between gap-3 border-t border-slate-200 pt-6 text-xs text-slate-500 dark:border-slate-800 dark:text-slate-400 sm:flex-row sm:items-center">
          <p>© {new Date().getFullYear()} {t.footer.rights}</p>
          <p className="font-mono-tabular">
            M-Pesa Paybill {CHURCH_CONFIG.mpesa.paybill} · Acc: {CHURCH_CONFIG.mpesa.accountFormat}
          </p>
        </div>
      </div>
    </footer>
  );
};
