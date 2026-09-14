'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useI18n } from '@/lib/i18n';
import { moneyTopics } from '@/lib/mock-data';

export function MoneyModule() {
  const { t } = useI18n();

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('money')}</CardTitle>
        <CardDescription>{t('moneyHint')}</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-3 md:grid-cols-2">
        {moneyTopics.map((item) => (
          <div key={item.title} className="rounded-[1.2rem] border border-border bg-surface p-3 shadow-soft">
            <div className="text-sm font-semibold">{item.title}</div>
            <div className="mt-1 text-sm text-muted">{item.note}</div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
