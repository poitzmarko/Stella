'use client';

import { useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { useI18n } from '@/lib/i18n';
import { phrases } from '@/lib/mock-data';
import type { Language } from '@/lib/types';

const categories = [
  { id: 'hotel', label: 'Hotel' },
  { id: 'restaurant', label: 'Restaurant' },
  { id: 'taxi', label: 'Taxi' },
  { id: 'emergency', label: 'Emergency' },
  { id: 'shopping', label: 'Shopping' }
] as const;

type Props = {
  locale: Language;
};

export function TravelPhrasesModule({ locale }: Props) {
  const { t } = useI18n();
  const [category, setCategory] = useState<(typeof categories)[number]['id']>('hotel');
  const [showLocal, setShowLocal] = useState(true);

  const filtered = useMemo(() => phrases.filter((p) => p.category === category), [category]);

  const speak = (english: string, local: string) => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const utterances = [english, showLocal ? local : null].filter(Boolean) as string[];
    utterances.forEach((text, index) => {
      const u = new SpeechSynthesisUtterance(text);
      u.lang = index === 0 ? 'en-US' : locale === 'zh' ? 'zh-CN' : `${locale}-${locale.toUpperCase()}`;
      window.setTimeout(() => window.speechSynthesis.speak(u), index * 700);
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('phrases')}</CardTitle>
        <CardDescription>{t('phrasesEmpty')}</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        <Tabs>
          <TabsList>
            {categories.map((item) => (
              <TabsTrigger key={item.id} active={item.id === category} onClick={() => setCategory(item.id)}>
                {item.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        <div className="flex items-center justify-between rounded-[1.2rem] border border-border bg-white/60 p-3 dark:bg-slate-950/30">
          <div className="text-sm font-semibold">{t('showLocalLanguage')}</div>
          <Switch checked={showLocal} onChange={(e) => setShowLocal(e.currentTarget.checked)} />
        </div>

        <div className="grid gap-2 md:grid-cols-2">
          {filtered.map((item) => (
            <div key={item.id} className="rounded-[1.2rem] border border-border bg-surface p-3 shadow-soft">
              <div className="text-sm font-semibold leading-6">{item.english}</div>
              {showLocal && <div className="mt-1 text-sm text-muted">{item.local[locale]}</div>}
              <div className="mt-3 flex flex-wrap gap-2">
                <Button size="sm" onClick={() => navigator.clipboard.writeText(item.english)} className="rounded-full">{t('copy')}</Button>
                <Button size="sm" variant="secondary" onClick={() => speak(item.english, item.local[locale])} className="rounded-full">{t('speak')}</Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
