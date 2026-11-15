import React from 'react';
import {useApp} from '../context/AppContext';

interface ConsentCheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  id: string;
}

export const ConsentCheckbox: React.FC<ConsentCheckboxProps> = ({checked, onChange, id}) => {
  const {t, navigate} = useApp();

  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-3.5 dark:border-slate-800 dark:bg-slate-900/60">
      <label htmlFor={id} className="flex cursor-pointer items-start gap-3">
        <input
          id={id}
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          required
          className="mt-0.5 h-5 w-5 shrink-0 rounded border-slate-300 text-[#1E3A8A] focus:ring-[#D97706] dark:border-slate-600 dark:bg-slate-800"
        />
        <span className="text-xs leading-relaxed text-slate-600 dark:text-slate-300">
          {t.forms.consentLabel}{' '}
          <button
            type="button"
            onClick={() => navigate('privacy')}
            className="font-semibold text-[#1E3A8A] underline underline-offset-2 hover:text-amber-700 dark:text-amber-400"
          >
            {t.forms.privacyLink}
          </button>
        </span>
      </label>
    </div>
  );
};
