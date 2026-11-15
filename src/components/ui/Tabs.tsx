import React from 'react';

export interface TabOption<T extends string> {
  id: T;
  label: string;
}

interface TabsProps<T extends string> {
  tabs: Array<TabOption<T>>;
  activeTab: T;
  onChange: (id: T) => void;
  ariaLabel: string;
}

export function Tabs<T extends string>({tabs, activeTab, onChange, ariaLabel}: TabsProps<T>) {
  return (
    <div
      role="tablist"
      aria-label={ariaLabel}
      className="inline-flex flex-wrap items-center gap-1 rounded-xl border border-slate-200 bg-white p-1 dark:border-slate-800 dark:bg-slate-900"
    >
      {tabs.map((tab) => {
        const active = tab.id === activeTab;
        return (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onChange(tab.id)}
            className={`min-h-[40px] rounded-lg px-4 text-xs font-semibold transition duration-150 whitespace-nowrap shrink-0 ${
              active
                ? 'bg-[#1E3A8A] text-white dark:bg-amber-500 dark:text-slate-950'
                : 'text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white'
            }`}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}
