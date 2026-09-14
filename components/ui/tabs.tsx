import * as React from 'react';
import { cn } from '@/components/ui/cn';

export function Tabs({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('w-full', className)} {...props} />;
}

export function TabsList({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('flex flex-wrap gap-2', className)} {...props} />;
}

export function TabsTrigger({
  active,
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { active?: boolean }) {
  return (
    <button
      className={cn(
        'rounded-full border px-3 py-2 text-sm font-semibold transition',
        active ? 'border-transparent bg-slate-900 text-white' : 'border-border bg-surface text-text hover:bg-slate-50 dark:hover:bg-slate-800',
        className
      )}
      {...props}
    />
  );
}

export function TabsContent({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('mt-3', className)} {...props} />;
}
