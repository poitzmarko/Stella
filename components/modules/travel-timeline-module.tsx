'use client';

import { useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useI18n } from '@/lib/i18n';
import { timelinePhases } from '@/lib/mock-data';
import type { Phase } from '@/lib/types';
import { cn } from '@/components/ui/cn';

type Props = {
  phase: Phase;
  onChange: (phase: Phase) => void;
};

export function TravelTimelineModule({ phase, onChange }: Props) {
  const { t } = useI18n();
  const active = useMemo(() => timelinePhases.find((item) => item.id === phase) ?? timelinePhases[0], [phase]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('timeline')}</CardTitle>
        <CardDescription>{t('phaseHint')}</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className="flex flex-wrap gap-2">
          {timelinePhases.map((item) => (
            <Button
              key={item.id}
              variant={item.id === phase ? 'default' : 'secondary'}
              size="sm"
              onClick={() => onChange(item.id)}
              className="rounded-full"
            >
              {item.title}
            </Button>
          ))}
        </div>

        <div className="rounded-[1.2rem] border border-border bg-white/60 p-4 dark:bg-slate-950/30">
          <div className="text-base font-bold">{active.title}</div>
          <div className="mt-1 text-sm text-muted">{active.description}</div>
          <div className="mt-3 grid gap-2 md:grid-cols-2">
            {active.highlights.map((bullet) => (
              <div key={bullet} className="rounded-2xl border border-border bg-surface p-3 text-sm">{bullet}</div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
