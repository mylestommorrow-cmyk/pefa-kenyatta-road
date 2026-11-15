import React from 'react';
import {ExternalLink, Mail, MapPin, MessageCircle, Phone} from 'lucide-react';
import {CHURCH_CONFIG} from '../config/church';
import {useApp} from '../context/AppContext';
import {LazyMap} from '../components/LazyMap';
import {Card} from '../components/ui';

export const ContactPage: React.FC = () => {
  const {lang} = useApp();

  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${CHURCH_CONFIG.coordinates.lat},${CHURCH_CONFIG.coordinates.lng}`;
  const whatsappUrl = `https://wa.me/${CHURCH_CONFIG.whatsappNumber}?text=${encodeURIComponent(
    'Habari! I would like to connect with PEFA Church, Kenyatta Branch.'
  )}`;

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <div className="max-w-2xl">
        <p className="text-xs font-semibold text-[#1E3A8A] dark:text-amber-400">
          {lang === 'sw' ? 'Mahali Tulipo & Mawasiliano' : 'Visit & Connect'}
        </p>
        <h1 className="mt-2 font-display text-3xl font-bold text-slate-900 dark:text-white sm:text-4xl">
          {lang === 'sw' ? 'Karibu PEFA Kenyatta' : 'Find us in Kenyatta, Nairobi'}
        </h1>
        <p className="mt-3 max-w-[65ch] text-base text-slate-600 dark:text-slate-300">
          {CHURCH_CONFIG.address} — {CHURCH_CONFIG.landmarks}
        </p>
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-12">
        <div className="space-y-5 lg:col-span-5">
          <Card>
            <h2 className="font-display text-lg font-bold text-slate-900 dark:text-white">Direct Contacts</h2>
            <div className="mt-4 space-y-4 text-base">
              <div className="flex items-start gap-3">
                <MapPin className="mt-1 h-4 w-4 shrink-0 text-[#1E3A8A] dark:text-amber-400" />
                <div>
                  <p className="font-semibold text-slate-900 dark:text-white">{CHURCH_CONFIG.address}</p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">{CHURCH_CONFIG.landmarks}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="h-4 w-4 shrink-0 text-[#1E3A8A] dark:text-amber-400" />
                <a href={`tel:${CHURCH_CONFIG.phone.replace(/\s+/g, '')}`} className="font-mono-tabular font-medium hover:underline">
                  {CHURCH_CONFIG.phone}
                </a>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="h-4 w-4 shrink-0 text-[#1E3A8A] dark:text-amber-400" />
                <a href={`mailto:${CHURCH_CONFIG.email}`} className="font-medium hover:underline">
                  {CHURCH_CONFIG.email}
                </a>
              </div>
            </div>

            <div className="mt-6 flex flex-col gap-2.5">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-[46px] items-center justify-center gap-2 rounded-xl bg-emerald-700 px-4 text-sm font-semibold text-white hover:bg-emerald-800"
              >
                <MessageCircle className="h-4 w-4" />
                <span>WhatsApp Church Office</span>
              </a>
              <a
                href={googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-[46px] items-center justify-center gap-2 rounded-xl border border-slate-300 px-4 text-sm font-semibold text-slate-800 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
              >
                <span>Open Directions in Google Maps</span>
                <ExternalLink className="h-4 w-4" />
              </a>
            </div>
          </Card>

          <Card>
            <h2 className="font-display text-lg font-bold text-slate-900 dark:text-white">Social Channels</h2>
            <div className="mt-3 flex flex-wrap gap-3 text-sm font-semibold text-[#1E3A8A] dark:text-amber-400">
              <a href={CHURCH_CONFIG.socials.youtube} target="_blank" rel="noopener noreferrer" className="hover:underline">YouTube</a>
              <span>·</span>
              <a href={CHURCH_CONFIG.socials.facebook} target="_blank" rel="noopener noreferrer" className="hover:underline">Facebook</a>
              <span>·</span>
              <a href={CHURCH_CONFIG.socials.instagram} target="_blank" rel="noopener noreferrer" className="hover:underline">Instagram</a>
              <span>·</span>
              <a href={CHURCH_CONFIG.socials.tiktok} target="_blank" rel="noopener noreferrer" className="hover:underline">TikTok</a>
            </div>
          </Card>
        </div>

        <div className="overflow-hidden rounded-2xl border border-white/60 bg-white/76 backdrop-blur-md dark:border-slate-700/60 dark:bg-slate-900/72 lg:col-span-7">
          <LazyMap heightClass="h-80 lg:h-full lg:min-h-[420px]" />
        </div>
      </div>
    </div>
  );
};
