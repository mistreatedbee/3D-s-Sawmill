import React, { forwardRef } from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';
import { cn } from '../../utils/cn';
interface CardProps extends HTMLMotionProps<'div'> {
  variant?: 'default' | 'glass' | 'flat';
  hoverEffect?: boolean;
}
export const Card = forwardRef<HTMLDivElement, CardProps>(({
  className,
  variant = 'default',
  hoverEffect = false,
  children,
  ...props
}, ref) => {
  const variants = {
    default: 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm',
    glass: 'glass-panel glass-panel-dark',
    flat: 'bg-gray-50 dark:bg-gray-900 border border-transparent'
  };
  return <motion.div ref={ref} whileHover={hoverEffect ? {
    y: -5,
    boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)'
  } : undefined} transition={{
    duration: 0.2
  }} className={cn('rounded-xl overflow-hidden', variants[variant], className)} {...props}>
        {children}
      </motion.div>;
});
Card.displayName = 'Card';