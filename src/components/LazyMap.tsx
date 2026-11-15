import React, {useState} from 'react';
import {MapPin} from 'lucide-react';
import {CHURCH_CONFIG} from '../config/church';

interface LazyMapProps {
  heightClass?: string;
}

export const LazyMap: React.FC<LazyMapProps> = ({heightClass = 'h-48'}) => {
  const [loaded, setLoaded] = useState(false);

  if (!loaded) {
    return (
      <div
        className={`flex flex-col items-center justify-center gap-2 bg-slate-100 p-4 text-center dark:bg-slate-950 ${heightClass}`}
      >
        <MapPin className="h-6 w-6 text-[#1E3A8A] dark:text-amber-400" aria-hidden="true" />
        <p className="text-xs font-medium text-slate-700 dark:text-slate-300">
          {CHURCH_CONFIG.address}
        </p>
        <button
          type="button"
          onClick={() => setLoaded(true)}
          className="min-h-[40px] rounded-lg border border-slate-300 bg-white px-3.5 text-xs font-semibold text-slate-900 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
        >
          Load Interactive Map
        </button>
      </div>
    );
  }

  return (
    <iframe
      title="PEFA Church Kenyatta Branch Location Map"
      src={`https://www.openstreetmap.org/export/embed.html?bbox=36.791%2C-1.310%2C36.811%2C-1.296&layer=mapnik&marker=${CHURCH_CONFIG.coordinates.lat}%2C${CHURCH_CONFIG.coordinates.lng}`}
      className={`w-full border-0 ${heightClass}`}
      loading="lazy"
    />
  );
};
