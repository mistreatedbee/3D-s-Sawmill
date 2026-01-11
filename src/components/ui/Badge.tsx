import React from 'react';
import { cn } from '../../utils/cn';
interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'success' | 'warning' | 'error' | 'outline';
}
export const Badge = ({
  className,
  variant = 'default',
  ...props
}: BadgeProps) => {
  const variants = {
    default: 'bg-wood-100 text-wood-800 dark:bg-wood-900/50 dark:text-wood-300',
    success: 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300',
    warning: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300',
    error: 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300',
    outline: 'border border-gray-200 text-gray-800 dark:border-gray-700 dark:text-gray-300'
  };
  return <span className={cn('inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2', variants[variant], className)} {...props} />;
};