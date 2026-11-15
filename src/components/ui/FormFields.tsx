import React from 'react';

interface FieldBaseProps {
  label?: string;
  error?: string;
  hint?: string;
  id?: string;
}

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement>, FieldBaseProps {}
interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement>, FieldBaseProps {}
interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement>, FieldBaseProps {}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  hint,
  id,
  className = '',
  ...rest
}) => {
  const inputId = id || (label ? label.toLowerCase().replace(/[^a-z0-9]+/g, '-') : undefined);
  return (
    <div className="w-full">
      {label && (
        <label htmlFor={inputId} className="mb-1.5 block text-xs font-semibold text-slate-700 dark:text-slate-200">
          {label}
        </label>
      )}
      <input
        id={inputId}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${inputId}-error` : undefined}
        className={`w-full min-h-[44px] rounded-xl border bg-white/80 backdrop-blur-sm px-3.5 text-base text-slate-900 placeholder:text-slate-400 transition focus:outline-none dark:bg-slate-950/75 dark:text-white ${
          error
            ? 'border-red-500 focus:ring-2 focus:ring-red-500/30'
            : 'border-slate-300 focus:border-[#1E3A8A] dark:border-slate-700 dark:focus:border-amber-400'
        } ${className}`}
        {...rest}
      />
      {hint && !error && <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{hint}</p>}
      {error && (
        <p id={`${inputId}-error`} role="alert" className="mt-1 text-xs font-medium text-red-700 dark:text-red-400">
          {error}
        </p>
      )}
    </div>
  );
};

export const Select: React.FC<SelectProps> = ({
  label,
  error,
  hint,
  id,
  className = '',
  children,
  ...rest
}) => {
  const selectId = id || (label ? label.toLowerCase().replace(/[^a-z0-9]+/g, '-') : undefined);
  return (
    <div className="w-full">
      {label && (
        <label htmlFor={selectId} className="mb-1.5 block text-xs font-semibold text-slate-700 dark:text-slate-200">
          {label}
        </label>
      )}
      <select
        id={selectId}
        aria-invalid={Boolean(error)}
        className={`w-full min-h-[44px] rounded-xl border bg-white/80 backdrop-blur-sm px-3.5 text-base text-slate-900 transition dark:bg-slate-950/75 dark:text-white ${
          error ? 'border-red-500' : 'border-slate-300 dark:border-slate-700'
        } ${className}`}
        {...rest}
      >
        {children}
      </select>
      {hint && !error && <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{hint}</p>}
      {error && (
        <p role="alert" className="mt-1 text-xs font-medium text-red-700 dark:text-red-400">
          {error}
        </p>
      )}
    </div>
  );
};

export const Textarea: React.FC<TextareaProps> = ({
  label,
  error,
  hint,
  id,
  className = '',
  ...rest
}) => {
  const areaId = id || (label ? label.toLowerCase().replace(/[^a-z0-9]+/g, '-') : undefined);
  return (
    <div className="w-full">
      {label && (
        <label htmlFor={areaId} className="mb-1.5 block text-xs font-semibold text-slate-700 dark:text-slate-200">
          {label}
        </label>
      )}
      <textarea
        id={areaId}
        aria-invalid={Boolean(error)}
        className={`w-full rounded-xl border bg-white/80 backdrop-blur-sm p-3.5 text-base text-slate-900 placeholder:text-slate-400 transition dark:bg-slate-950/75 dark:text-white ${
          error ? 'border-red-500' : 'border-slate-300 dark:border-slate-700'
        } ${className}`}
        {...rest}
      />
      {hint && !error && <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{hint}</p>}
      {error && (
        <p role="alert" className="mt-1 text-xs font-medium text-red-700 dark:text-red-400">
          {error}
        </p>
      )}
    </div>
  );
};
