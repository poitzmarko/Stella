'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useI18n } from '@/lib/i18n';
import { emergencyActions } from '@/lib/mock-data';

export function EmergencyModule() {
  const { t } = useI18n();

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('sosTitle')}</CardTitle>
        <CardDescription>{t('sosHint')}</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-3 md:grid-cols-2">
        {emergencyActions.map((item) => (
          <div key={item.title} className="rounded-[1.2rem] border border-border bg-surface p-3 shadow-soft">
            <div className="flex items-start gap-3">
              <div className="text-2xl">{item.icon}</div>
              <div className="min-w-0">
                <div className="text-sm font-semibold">{item.title}</div>
                <div className="mt-1 text-sm text-muted">{item.note}</div>
                <div className="mt-3 flex flex-wrap gap-2">
                  <Button size="sm" className="rounded-full">{t('copy')}</Button>
                  <Button size="sm" variant="secondary" className="rounded-full">{t('openInMaps')}</Button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
