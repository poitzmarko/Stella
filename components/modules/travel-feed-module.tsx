'use client';

import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useI18n } from '@/lib/i18n';
import type { FeedItem, Phase, LocationPoint } from '@/lib/types';
import { buildFeed } from '@/lib/feed';

type Props = {
  phase: Phase;
  cityLabel: string;
  location?: LocationPoint | null;
};

export function TravelFeedModule({ phase, cityLabel }: Props) {
  const { t } = useI18n();
  const items: FeedItem[] = buildFeed(phase, cityLabel);

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('travelFeedTitle')}</CardTitle>
        <CardDescription>{t('feedHint')}</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-3">
        {items.slice(0, 4).map((item, index) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2, delay: index * 0.04 }}
            className="rounded-[1.2rem] border border-border bg-white/70 p-3 shadow-soft dark:bg-slate-950/30"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="text-sm font-semibold">{item.icon} {item.title}</div>
                <div className="mt-1 text-sm text-muted">{item.body}</div>
              </div>
              <Badge>{item.priority}</Badge>
            </div>
          </motion.div>
        ))}
      </CardContent>
    </Card>
  );
}
