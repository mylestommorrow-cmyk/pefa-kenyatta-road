import React, {useState} from 'react';
import {Church} from 'lucide-react';

interface SafeImageProps {
  src?: string;
  alt: string;
  className?: string;
  fallbackTitle?: string;
  eager?: boolean;
}

export const SafeImage: React.FC<SafeImageProps> = ({
  src,
  alt,
  className = 'h-full w-full object-cover',
  fallbackTitle,
  eager = false,
}) => {
  const [failed, setFailed] = useState(false);

  if (!src || failed) {
    return (
      <div
        className={`flex flex-col items-center justify-center bg-gradient-to-br from-[#1E3A8A]/10 via-slate-100 to-amber-500/15 p-4 text-center dark:from-[#1E3A8A]/40 dark:via-slate-900 dark:to-amber-500/15 ${className}`}
        role="img"
        aria-label={alt}
      >
        <Church className="h-8 w-8 text-[#1E3A8A]/60 dark:text-amber-400/70" aria-hidden="true" />
        {fallbackTitle && (
          <span className="mt-2 max-w-[18ch] text-xs font-medium text-slate-600 dark:text-slate-300">
            {fallbackTitle}
          </span>
        )}
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      loading={eager ? 'eager' : 'lazy'}
      fetchPriority={eager ? 'high' : undefined}
      decoding="async"
      referrerPolicy="no-referrer"
      onError={() => setFailed(true)}
      className={className}
    />
  );
};
