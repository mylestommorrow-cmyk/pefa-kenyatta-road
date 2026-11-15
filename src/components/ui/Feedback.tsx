import React from 'react';
import {AlertTriangle, CheckCircle2, RefreshCw, X} from 'lucide-react';
import {Button} from './Button';

export const SkeletonCard: React.FC<{lines?: number}> = ({lines = 3}) => (
  <div className="animate-pulse rounded-2xl border border-white/60 bg-white/70 p-6 backdrop-blur-md dark:border-slate-700/60 dark:bg-slate-900/68">
    <div className="h-3.5 w-28 rounded bg-slate-200 dark:bg-slate-800" />
    <div className="mt-3 h-6 w-3/4 rounded bg-slate-200 dark:bg-slate-800" />
    <div className="mt-4 space-y-2">
      {Array.from({length: lines}).map((_, i) => (
        <div key={i} className="h-3.5 w-full rounded bg-slate-200 dark:bg-slate-800" />
      ))}
    </div>
  </div>
);

export const EmptyState: React.FC<{
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}> = ({title, description, actionLabel, onAction}) => (
  <div className="rounded-2xl border border-white/60 bg-white/75 p-10 text-center backdrop-blur-md dark:border-slate-700/60 dark:bg-slate-900/72">
    <h2 className="font-display text-xl font-bold text-slate-900 dark:text-white">{title}</h2>
    <p className="mx-auto mt-2 max-w-md text-sm text-slate-600 dark:text-slate-300">{description}</p>
    {actionLabel && onAction && (
      <div className="mt-5">
        <Button variant="secondary" onClick={onAction}>
          {actionLabel}
        </Button>
      </div>
    )}
  </div>
);

export const ErrorState: React.FC<{
  message: string;
  onRetry: () => void;
}> = ({message, onRetry}) => (
  <div
    role="alert"
    className="rounded-2xl border border-red-200 bg-red-50 p-6 text-center dark:border-red-900/60 dark:bg-red-950/40"
  >
    <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-300">
      <AlertTriangle className="h-5 w-5" />
    </div>
    <h2 className="mt-3 text-base font-bold text-red-950 dark:text-red-100">
      Connection interrupted
    </h2>
    <p className="mt-1 text-sm text-red-800 dark:text-red-200">{message}</p>
    <div className="mt-4">
      <Button variant="secondary" onClick={onRetry}>
        <RefreshCw className="h-4 w-4" />
        <span>Try Again</span>
      </Button>
    </div>
  </div>
);

export interface ToastItem {
  message: string;
  tone: 'success' | 'error';
}

export const Toast: React.FC<{
  toast: ToastItem | null;
  onDismiss: () => void;
}> = ({toast, onDismiss}) => {
  if (!toast) return null;
  const isError = toast.tone === 'error';
  return (
    <div
      role="status"
      className={`fixed bottom-20 right-4 z-50 flex max-w-sm items-center gap-3 rounded-xl border px-4 py-3 text-xs font-semibold shadow-md md:bottom-6 ${
        isError
          ? 'border-red-300 bg-red-50 text-red-950 dark:border-red-800 dark:bg-red-950 dark:text-red-100'
          : 'border-emerald-300 bg-emerald-50 text-emerald-950 dark:border-emerald-800 dark:bg-emerald-950 dark:text-emerald-100'
      }`}
    >
      {isError ? <AlertTriangle className="h-4 w-4 shrink-0" /> : <CheckCircle2 className="h-4 w-4 shrink-0" />}
      <span className="flex-1">{toast.message}</span>
      <button
        type="button"
        onClick={onDismiss}
        aria-label="Dismiss notification"
        className="flex h-7 w-7 items-center justify-center rounded-lg hover:bg-black/5"
      >
        <X className="h-3.5 w-3.5" />
      </button>
    </div>
  );
};
