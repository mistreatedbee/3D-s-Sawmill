import React, { forwardRef } from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import { cn } from '../../utils/cn';
interface ButtonProps extends HTMLMotionProps<'button'> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'glass' | 'destructive';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(({
  className,
  variant = 'primary',
  size = 'md',
  isLoading,
  leftIcon,
  rightIcon,
  children,
  ...props
}, ref) => {
  const variants = {
    primary: 'bg-wood-800 text-white hover:bg-wood-700 shadow-lg shadow-wood-800/20 border border-transparent',
    secondary: 'bg-forest-700 text-white hover:bg-forest-600 shadow-lg shadow-forest-700/20 border border-transparent',
    outline: 'bg-transparent border-2 border-wood-800 text-wood-800 hover:bg-wood-50 dark:border-wood-400 dark:text-wood-400 dark:hover:bg-wood-900/30',
    ghost: 'bg-transparent text-wood-800 hover:bg-wood-100 dark:text-wood-300 dark:hover:bg-wood-900/30',
    glass: 'backdrop-blur-md bg-white/20 border border-white/30 text-white hover:bg-white/30 shadow-lg',
    destructive: 'bg-red-600 text-white hover:bg-red-700 shadow-lg shadow-red-600/20 border border-transparent dark:bg-red-700 dark:hover:bg-red-800'
  };
  const sizes = {
    sm: 'h-8 px-3 text-sm',
    md: 'h-10 px-4 py-2',
    lg: 'h-12 px-6 text-lg'
  };
  return <motion.button ref={ref} whileHover={{
    scale: 1.02
  }} whileTap={{
    scale: 0.98
  }} className={cn('inline-flex items-center justify-center rounded-lg font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-wood-500 disabled:pointer-events-none disabled:opacity-50', variants[variant], sizes[size], className)} disabled={isLoading || props.disabled} {...props}>
        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {!isLoading && leftIcon && <span className="mr-2">{leftIcon}</span>}
        {children}
        {!isLoading && rightIcon && <span className="ml-2">{rightIcon}</span>}
      </motion.button>;
});
Button.displayName = 'Button';