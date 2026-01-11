import React, { forwardRef } from 'react';
import { cn } from '../../utils/cn';
export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
}
export const Input = forwardRef<HTMLInputElement, InputProps>(({
  className,
  label,
  error,
  icon,
  ...props
}, ref) => {
  return <div className="w-full">
        {label && <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
            {label}
          </label>}
        <div className="relative">
          {icon && <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              {icon}
            </div>}
          <input className={cn('flex h-10 w-full rounded-lg border border-gray-300 bg-white/50 px-3 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-wood-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-700 dark:bg-gray-900/50 dark:ring-offset-gray-950 dark:placeholder:text-gray-400', icon && 'pl-10', error && 'border-red-500 focus-visible:ring-red-500', className)} ref={ref} {...props} />
        </div>
        {error && <p className="mt-1 text-sm text-red-500 animate-pulse">{error}</p>}
      </div>;
});
Input.displayName = 'Input';