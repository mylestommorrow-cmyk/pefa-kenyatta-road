import React from 'react';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  elevated?: boolean;
  padding?: 'sm' | 'md' | 'lg';
}

const PADDING_CLASSES = {
  sm: 'p-4',
  md: 'p-6',
  lg: 'p-6 sm:p-8',
};

export const Card: React.FC<CardProps> = ({
  elevated = false,
  padding = 'md',
  className = '',
  children,
  ...rest
}) => {
  return (
    <div
      className={`rounded-2xl border border-white/60 bg-white/76 backdrop-blur-md dark:border-slate-700/60 dark:bg-slate-900/72 ${
        elevated ? 'shadow-sm' : ''
      } ${PADDING_CLASSES[padding]} ${className}`}
      {...rest}
    >
      {children}
    </div>
  );
};
