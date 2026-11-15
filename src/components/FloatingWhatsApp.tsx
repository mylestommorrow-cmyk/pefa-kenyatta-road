import React from 'react';
import {MessageCircle} from 'lucide-react';
import {CHURCH_CONFIG} from '../config/church';
import {useApp} from '../context/AppContext';

export const FloatingWhatsApp: React.FC = () => {
  const {activeSermon, route} = useApp();
  // Keep hidden when admin workspace or sticky sermon player is open on mobile to avoid covering controls
  if (route === 'admin' || activeSermon) return null;

  const url = `https://wa.me/${CHURCH_CONFIG.whatsappNumber}?text=${encodeURIComponent(
    'Habari PEFA Kenyatta! I would like to ask a question.'
  )}`;

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with PEFA Kenyatta on WhatsApp"
      className="fixed bottom-[4.5rem] right-4 z-30 inline-flex min-h-[48px] items-center gap-2 rounded-full bg-emerald-700 px-4 text-xs font-semibold text-white shadow-md transition duration-150 hover:bg-emerald-800 active:scale-[0.98] md:bottom-6 md:right-6"
    >
      <MessageCircle className="h-5 w-5 shrink-0" aria-hidden="true" />
      <span className="hidden sm:inline">WhatsApp</span>
    </a>
  );
};
