import * as React from 'react';
import { cn } from '@/components/ui/cn';

export function Select({ className, ...props }: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return <select className={cn('h-11 w-full rounded-2xl border border-border bg-white/70 px-4 text-sm outline-none focus:border-slate-400 dark:bg-slate-950/40', className)} {...props} />;
}
