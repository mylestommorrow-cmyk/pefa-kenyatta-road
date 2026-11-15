import React from 'react';
import {AlertCircle, CheckCircle2, Clock, Info} from 'lucide-react';

export type BadgeTone = 'success' | 'warning' | 'error' | 'neutral';

interface BadgeProps {
  tone?: BadgeTone;
  children: React.ReactNode;
}

const TONE_MAP: Record<BadgeTone, {classes: string; icon: React.ReactNode}> = {
  success: {
    classes: 'border-emerald-200 bg-emerald-50 text-emerald-900 dark:border-emerald-900/60 dark:bg-emerald-950/50 dark:text-emerald-200',
    icon: <CheckCircle2 className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />,
  },
  warning: {
    classes: 'border-amber-200 bg-amber-50 text-amber-900 dark:border-amber-900/60 dark:bg-amber-950/50 dark:text-amber-200',
    icon: <Clock className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />,
  },
  error: {
    classes: 'border-red-200 bg-red-50 text-red-900 dark:border-red-900/60 dark:bg-red-950/50 dark:text-red-200',
    icon: <AlertCircle className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />,
  },
  neutral: {
    classes: 'border-slate-200 bg-slate-50 text-slate-700 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300',
    icon: <Info className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />,
  },
};

export const Badge: React.FC<BadgeProps> = ({tone = 'neutral', children}) => {
  const cfg = TONE_MAP[tone];
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-md border px-2 py-0.5 text-xs font-semibold ${cfg.classes}`}>
      {cfg.icon}
      <span>{children}</span>
    </span>
  );
};
