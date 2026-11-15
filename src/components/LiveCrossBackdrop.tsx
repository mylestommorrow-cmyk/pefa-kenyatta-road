import React from 'react';
import {CHURCH_IMAGES} from '../data/assets';

/**
 * Ambient fixed live background featuring Jesus on the cross at Calvary
 * with slow compositor-only Ken Burns motion, breathing sunbeams, and drifting mist.
 * Automatically pauses animations when prefers-reduced-motion is enabled.
 */
export const LiveCrossBackdrop: React.FC = () => {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 select-none overflow-hidden"
    >
      {/* Layer 1: High-res Calvary Cross scene with slow Ken Burns motion */}
      <img
        src={CHURCH_IMAGES.calvaryBackdrop}
        alt=""
        loading="eager"
        fetchPriority="high"
        decoding="async"
        referrerPolicy="no-referrer"
        className="live-cross-motion h-full w-full object-cover object-[72%_32%] sm:object-center"
      />

      {/* Layer 2: Soft breathing golden sunbeams radiating behind the cross */}
      <div
        className="live-sunbeam-motion absolute -top-24 right-[-10%] h-[75vh] w-[85vw] rounded-full opacity-55 mix-blend-screen"
        style={{
          background:
            'radial-gradient(circle at 65% 42%, rgba(251, 191, 36, 0.42) 0%, rgba(245, 158, 11, 0.18) 38%, rgba(30, 58, 138, 0) 72%)',
        }}
      />

      {/* Layer 3: Subtle drifting dawn mist across the valley */}
      <div
        className="live-mist-motion absolute inset-x-[-15%] bottom-[-10%] h-[55vh] opacity-40"
        style={{
          background:
            'radial-gradient(ellipse at 40% 70%, rgba(255, 255, 255, 0.38) 0%, rgba(226, 232, 240, 0.14) 48%, transparent 78%)',
        }}
      />

      {/* Layer 4: Balanced translucent light/dark veil keeping foreground headings & glass readable */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#FAFBFD]/64 via-[#FAFBFD]/44 to-[#FAFBFD]/58 transition-colors duration-300 dark:from-[#080E1A]/68 dark:via-[#080E1A]/52 dark:to-[#080E1A]/70" />
    </div>
  );
};
