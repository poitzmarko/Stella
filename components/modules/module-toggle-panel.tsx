'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { useI18n } from '@/lib/i18n';

export type ModuleVisibility = {
  currency: boolean;
  feed: boolean;
  timeline: boolean;
  phrases: boolean;
  discover: boolean;
  money: boolean;
  emergency: boolean;
};

type Props = {
  value: ModuleVisibility;
  onChange: (next: ModuleVisibility) => void;
};

export function ModuleTogglePanel({ value, onChange }: Props) {
  const { t } = useI18n();

  const set = (key: keyof ModuleVisibility, checked: boolean) => onChange({ ...value, [key]: checked });

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('modules')}</CardTitle>
        <CardDescription>{t('modulesHint')}</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        {[
          ['currency', t('navCurrency')],
          ['feed', t('navFeed')],
          ['discover', t('navDiscover')],
          ['phrases', t('navPhrases')],
          ['timeline', t('navTimeline')],
          ['money', t('navMoney')],
          ['emergency', t('navEmergency')]
        ].map(([key, label]) => (
          <div key={key} className="flex items-center justify-between rounded-[1.2rem] border border-border bg-surface p-3 shadow-soft">
            <div className="text-sm font-semibold">{label}</div>
            <Switch checked={value[key as keyof ModuleVisibility]} onChange={(e) => set(key as keyof ModuleVisibility, e.currentTarget.checked)} />
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
