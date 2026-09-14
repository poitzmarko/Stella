'use client';

import { useEffect, useMemo, useState } from 'react';
import { ArrowRightLeft, Copy, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useI18n } from '@/lib/i18n';
import { currencyCatalog } from '@/lib/mock-data';
import { fetchExchangeRates } from '@/lib/sources';
import { readStorage, writeStorage } from '@/lib/storage';

const FAVORITES_KEY = 'fxpro.currency.favorites';
const HISTORY_KEY = 'fxpro.currency.history';

export function CurrencyModule() {
  const { t } = useI18n();
  const [from, setFrom] = useState('EUR');
  const [to, setTo] = useState('USD');
  const [amount, setAmount] = useState('250');
  const [rates, setRates] = useState<Record<string, number> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [history, setHistory] = useState<string[]>([]);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setFavorites(readStorage<string[]>(FAVORITES_KEY, ['USD', 'GBP', 'CHF', 'PLN']));
    setHistory(readStorage<string[]>(HISTORY_KEY, ['EUR', 'USD', 'GBP', 'CHF', 'PLN']));
    fetchExchangeRates()
      .then((data) => setRates(data))
      .catch(() => setError('rates'))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    writeStorage(FAVORITES_KEY, favorites);
  }, [favorites]);

  useEffect(() => {
    writeStorage(HISTORY_KEY, history);
  }, [history]);

  const fromRate = rates?.[from] ?? currencyCatalog.find((c) => c.code === from)?.rateToEUR ?? 1;
  const toRate = rates?.[to] ?? currencyCatalog.find((c) => c.code === to)?.rateToEUR ?? 1;
  const rate = fromRate / toRate;
  const value = Number(amount.replace(',', '.'));
  const result = Number.isFinite(value) ? (value * fromRate) / toRate : 0;

  const quickSwitch = useMemo(() => currencyCatalog.filter((c) => favorites.includes(c.code)).slice(0, 6), [favorites]);

  const copyRate = async () => {
    const text = `1 ${from} = ${rate.toFixed(4)} ${to}`;
    await navigator.clipboard.writeText(text);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 900);
  };

  const swap = () => {
    setFrom(to);
    setTo(from);
  };

  const toggleFavorite = () => {
    setFavorites((prev) => (prev.includes(to) ? prev.filter((c) => c !== to) : [...prev, to].slice(0, 6)));
  };

  const markHistory = (code: string) => {
    setHistory((prev) => [code, ...prev.filter((c) => c !== code)].slice(0, 5));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('currencyHint')}</CardTitle>
        <CardDescription>{loading ? t('loading') : error ? t('error') : t('liveRates')}</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className="grid gap-3 rounded-[1.35rem] border border-border bg-white/60 p-3 dark:bg-slate-950/30">
          <div className="grid grid-cols-[1fr_auto] gap-3 md:grid-cols-[1.1fr_.9fr]">
            <div className="space-y-2">
              <div className="text-[11px] font-semibold uppercase tracking-[0.12em] text-muted">{t('from')}</div>
              <Select value={from} onChange={(e) => { setFrom(e.target.value); markHistory(e.target.value); }}>
                {currencyCatalog.map((c) => <option key={c.code} value={c.code}>{c.flag} {c.code} — {c.name}</option>)}
              </Select>
            </div>
            <div className="space-y-2">
              <div className="text-[11px] font-semibold uppercase tracking-[0.12em] text-muted">{t('amount')}</div>
              <Input value={amount} onChange={(e) => setAmount(e.target.value)} inputMode="decimal" className="text-right text-2xl font-semibold md:text-3xl" />
            </div>
          </div>

          <div className="flex items-center justify-center">
            <Button variant="secondary" size="sm" onClick={swap} className="rounded-full">
              <ArrowRightLeft className="h-4 w-4" /> {t('swap')}
            </Button>
          </div>

          <div className="grid grid-cols-[1fr_auto] gap-3 md:grid-cols-[1.1fr_.9fr]">
            <div className="space-y-2">
              <div className="text-[11px] font-semibold uppercase tracking-[0.12em] text-muted">{t('to')}</div>
              <Select value={to} onChange={(e) => { setTo(e.target.value); markHistory(e.target.value); }}>
                {currencyCatalog.map((c) => <option key={c.code} value={c.code}>{c.flag} {c.code} — {c.name}</option>)}
              </Select>
            </div>
            <div className="rounded-[1.2rem] border border-border bg-surface p-4 text-right">
              <div className="text-xs font-semibold uppercase tracking-[0.12em] text-muted">{t('result')}</div>
              <div className="mt-1 text-2xl font-bold tracking-tight md:text-3xl">{result.toFixed(2)} {to}</div>
              <div className="mt-1 text-sm text-muted">{t('rate')}: 1 {from} = {rate.toFixed(4)} {to}</div>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button onClick={copyRate} className="rounded-full">
              <Copy className="h-4 w-4" /> {copied ? t('success') : t('copyRate')}
            </Button>
            <Button variant="secondary" onClick={toggleFavorite} className="rounded-full">
              <Star className="h-4 w-4" /> {t('favorite')}
            </Button>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="text-sm font-semibold text-text">{t('quickSwitch')}</div>
            <Badge>{favorites.length}</Badge>
          </div>
          <div className="flex flex-wrap gap-2">
            {quickSwitch.map((c) => (
              <button
                key={c.code}
                onClick={() => setTo(c.code)}
                className="rounded-full border border-border bg-surface px-3 py-2 text-sm font-semibold text-text transition hover:bg-slate-50 dark:hover:bg-slate-800"
              >
                {c.flag} {c.code}
              </button>
            ))}
          </div>
          <div className="text-xs text-muted">{t('history')}: {history.join(' · ')}</div>
        </div>
      </CardContent>
    </Card>
  );
}
