import * as React from 'react';
import { cn } from '@/components/ui/cn';

type Props = React.InputHTMLAttributes<HTMLInputElement>;

export function Switch({ className, ...props }: Props) {
  return (
    <label className={cn('relative inline-flex h-7 w-12 cursor-pointer items-center', className)}>
      <input type="checkbox" className="peer sr-only" {...props} />
      <span className="absolute inset-0 rounded-full bg-slate-200 transition peer-checked:bg-slate-900 dark:bg-slate-700" />
      <span className="absolute left-1 h-5 w-5 rounded-full bg-white shadow-soft transition peer-checked:translate-x-5" />
    </label>
  );
}
