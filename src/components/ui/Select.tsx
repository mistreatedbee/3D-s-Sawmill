import React, { forwardRef } from 'react';
import { cn } from '../../utils/cn';
export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options?: {
    label: string;
    value: string;
  }[];
}
export const Select = forwardRef<HTMLSelectElement, SelectProps>(({
  className,
  label,
  error,
  options,
  children,
  ...props
}, ref) => {
  return <div className="w-full">
        {label && <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
            {label}
          </label>}
        <div className="relative">
          <select className={cn('flex h-10 w-full rounded-lg border border-gray-300 bg-white/50 px-3 py-2 text-sm ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-wood-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-700 dark:bg-gray-900/50 dark:ring-offset-gray-950 dark:text-gray-100', error && 'border-red-500 focus-visible:ring-red-500', className)} ref={ref} {...props}>
            {options ? options.map(opt => <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>) : children}
          </select>
        </div>
        {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
      </div>;
});
Select.displayName = 'Select';