import * as React from 'react';
import { cn } from '@/components/ui/cn';

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'default' | 'secondary' | 'ghost' | 'outline';
  size?: 'default' | 'sm' | 'lg';
};

const variants = {
  default: 'bg-slate-900 text-white hover:bg-slate-800 border-transparent',
  secondary: 'bg-surface text-text hover:bg-slate-50 dark:hover:bg-slate-800',
  ghost: 'bg-transparent hover:bg-slate-100 dark:hover:bg-slate-800 border-transparent shadow-none',
  outline: 'bg-transparent border-border hover:bg-slate-50 dark:hover:bg-slate-800'
};

const sizes = {
  default: 'h-11 px-4',
  sm: 'h-9 px-3 text-sm',
  lg: 'h-12 px-5 text-base'
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'default', ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center gap-2 rounded-2xl border text-sm font-semibold shadow-soft transition-all active:scale-[0.98]',
          variants[variant],
          sizes[size],
          className
        )}
        {...props}
      />
    );
  }
);
Button.displayName = 'Button';
