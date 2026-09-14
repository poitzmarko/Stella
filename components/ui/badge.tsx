import * as React from 'react';
import { cn } from '@/components/ui/cn';

export function Badge({ className, ...props }: React.HTMLAttributes<HTMLSpanElement>) {
  return <span className={cn('inline-flex items-center rounded-full border border-border bg-surface px-2.5 py-1 text-xs font-semibold text-muted', className)} {...props} />;
}
