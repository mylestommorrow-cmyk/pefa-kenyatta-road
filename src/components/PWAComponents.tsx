import React, {useState} from 'react';
import {Download, Smartphone, WifiOff} from 'lucide-react';
import {usePWAInstall} from '../hooks/usePWAInstall';
import {useOnlineStatus} from '../hooks/useOnlineStatus';

export const PWAInstallButton: React.FC<{compact?: boolean}> = ({compact = false}) => {
  const {isInstallable, isInstalled, isIOS, install} = usePWAInstall();
  const [showGuide, setShowGuide] = useState(false);

  if (isInstalled) return null;

  if (isInstallable) {
    return (
      <button
        type="button"
        onClick={install}
        className="inline-flex min-h-[44px] items-center gap-2 rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-[#1E3A8A] transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-amber-400 dark:hover:bg-slate-800 whitespace-nowrap shrink-0"
      >
        <Download className="h-4 w-4" aria-hidden="true" />
        <span>{compact ? 'Install App' : 'Install Church App'}</span>
      </button>
    );
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setShowGuide(true)}
        className="inline-flex min-h-[44px] items-center gap-2 rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800 whitespace-nowrap shrink-0"
      >
        <Smartphone className="h-4 w-4" aria-hidden="true" />
        <span>{isIOS ? 'Install on iPhone' : 'Add to Phone'}</span>
      </button>

      {showGuide && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-labelledby="pwa-guide-title"
        >
          <div className="w-full max-w-sm rounded-2xl border border-white/60 bg-white/86 p-6 shadow-lg backdrop-blur-xl dark:border-slate-700/70 dark:bg-slate-900/86">
            <h3 id="pwa-guide-title" className="font-display text-lg font-bold text-slate-900 dark:text-white">
              Install PEFA Kenyatta App
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
              {isIOS ? (
                <>
                  1. Tap the <strong>Share</strong> icon in Safari at the bottom of your screen.
                  <br />
                  2. Scroll down and tap <strong>Add to Home Screen</strong> for offline Sunday service times and contacts.
                </>
              ) : (
                <>
                  Open your browser menu (three dots) and choose <strong>Add to Home Screen</strong> or{' '}
                  <strong>Install App</strong> to keep service times, M-Pesa Paybill, and contacts offline.
                </>
              )}
            </p>
            <button
              type="button"
              onClick={() => setShowGuide(false)}
              className="mt-5 w-full min-h-[44px] rounded-xl bg-[#1E3A8A] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#172D6E] dark:bg-amber-500 dark:text-slate-950"
            >
              Got it
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export const OfflineIndicator: React.FC = () => {
  const isOnline = useOnlineStatus();
  if (isOnline) return null;

  return (
    <div
      role="status"
      className="fixed bottom-20 left-4 right-4 z-50 mx-auto flex max-w-md items-center gap-2.5 rounded-xl border border-amber-300 bg-amber-50 px-4 py-2.5 text-xs font-medium text-amber-950 shadow-sm md:bottom-5 md:left-5 md:right-auto dark:border-amber-700/60 dark:bg-amber-950/90 dark:text-amber-100"
    >
      <WifiOff className="h-4 w-4 shrink-0" aria-hidden="true" />
      <span>Offline mode — Service times &amp; church contacts remain available.</span>
    </div>
  );
};
