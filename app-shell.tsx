'use client';

import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Globe, MoonStar, SunMedium, MapPin, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select } from '@/components/ui/select';
import { Card } from '@/components/ui/card';
import { useI18n, languageOptions } from '@/lib/i18n';
import { readStorage, writeStorage } from '@/lib/storage';
import { defaultLocation } from '@/lib/mock-data';
import { reverseGeocode } from '@/lib/sources';
import type { LocationPoint, Phase } from '@/lib/types';
import { PwaRegister } from '@/components/pwa-register';
import { ModuleTogglePanel, type ModuleVisibility } from '@/components/modules/module-toggle-panel';
import { CurrencyModule } from '@/components/modules/currency-module';
import { TravelFeedModule } from '@/components/modules/travel-feed-module';
import { TravelTimelineModule } from '@/components/modules/travel-timeline-module';
import { TravelPhrasesModule } from '@/components/modules/travel-phrases-module';
import { DiscoveryModule } from '@/components/modules/discovery-module';
import { EmergencyModule } from '@/components/modules/emergency-module';
import { MoneyModule } from '@/components/modules/money-module';
import { cn } from '@/components/ui/cn';
import { Badge } from '@/components/ui/badge';

const THEME_KEY = 'fxpro.theme';
const PHASE_KEY = 'fxpro.phase';
const MODULE_KEY = 'fxpro.modules';

const defaultModules: ModuleVisibility = {
  currency: true,
  feed: true,
  discover: true,
  phrases: true,
  timeline: true,
  money: true,
  emergency: true
};

export function AppShell() {
  const { t, locale, setLocale } = useI18n();
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [modules, setModules] = useState<ModuleVisibility>(defaultModules);
  const [phase, setPhase] = useState<Phase>('hotel');
  const [location, setLocation] = useState<LocationPoint | null>(null);
  const [cityLabel, setCityLabel] = useState<string>('');
  const [geoState, setGeoState] = useState<'idle' | 'loading' | 'ready' | 'denied' | 'error'>('idle');

  useEffect(() => {
    const storedTheme = readStorage<'light' | 'dark'>(THEME_KEY, 'light');
    const storedPhase = readStorage<Phase>(PHASE_KEY, 'hotel');
    const storedModules = readStorage<ModuleVisibility>(MODULE_KEY, defaultModules);
    setTheme(storedTheme);
    setPhase(storedPhase);
    setModules(storedModules);
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    writeStorage(THEME_KEY, theme);
  }, [theme]);

  useEffect(() => writeStorage(PHASE_KEY, phase), [phase]);
  useEffect(() => writeStorage(MODULE_KEY, modules), [modules]);

  useEffect(() => {
    const bootstrap = async () => {
      try {
        const saved = readStorage<LocationPoint | null>('fxpro.location', null);
        if (saved) {
          setLocation(saved);
          setCityLabel(await reverseGeocode(saved));
        } else {
          setLocation(defaultLocation);
          setCityLabel('Local area');
        }
      } catch {
        setLocation(defaultLocation);
        setCityLabel('Local area');
      }
    };
    bootstrap();
  }, []);

  const requestLocation = async () => {
    if (!navigator.geolocation) {
      setGeoState('error');
      return;
    }

    setGeoState('loading');
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const next = { lat: pos.coords.latitude, lon: pos.coords.longitude, accuracy: pos.coords.accuracy };
        setLocation(next);
        writeStorage('fxpro.location', next);
        const city = await reverseGeocode(next);
        setCityLabel(city);
        setGeoState('ready');
      },
      () => setGeoState('denied'),
      { enableHighAccuracy: true, timeout: 12000, maximumAge: 60000 }
    );
  };

  const phaseLabel = useMemo(() => {
    const map: Record<Phase, string> = {
      home: t('phaseHome'),
      airport: t('phaseAirport'),
      hotel: t('phaseHotel'),
      holiday: t('phaseHoliday'),
      emergency: t('phaseEmergency'),
      return: t('phaseReturn')
    } as any;
    return map[phase] || phase;
  }, [phase, t]);

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,rgba(99,102,241,.12),transparent_30%),linear-gradient(180deg,var(--bg2),var(--bg))] text-text">
      <PwaRegister />
      <header className="sticky top-0 z-40 border-b border-border/70 bg-surface/85 backdrop-blur-xl">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-3 px-3 py-3 sm:px-4 lg:px-6 xl:flex-row xl:items-center xl:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-[1.25rem] bg-gradient-to-br from-violet-500 via-sky-500 to-emerald-500 text-white shadow-premium">
              <Globe className="h-6 w-6" />
            </div>
            <div>
              <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted">{t('brand')}</div>
              <h1 className="text-lg font-bold tracking-tight sm:text-xl">{t('slogan')}</h1>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Select value={locale} onChange={(e) => setLocale(e.target.value as any)} className="w-[140px]">
              {languageOptions.map((item) => (
                <option key={item.code} value={item.code}>{item.label}</option>
              ))}
            </Select>

            <Button variant="secondary" onClick={() => setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'))} className="rounded-full">
              {theme === 'dark' ? <SunMedium className="h-4 w-4" /> : <MoonStar className="h-4 w-4" />}
              {t('navTheme')}
            </Button>

            <Badge>{phaseLabel}</Badge>

            <Button onClick={requestLocation} className="rounded-full">
              <MapPin className="h-4 w-4" /> {t('requestLocation')}
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto grid w-full max-w-7xl gap-4 px-3 py-4 sm:px-4 lg:px-6 xl:grid-cols-[1fr_320px]">
        <div className="grid gap-4">
          <motion.section initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
            <Card className="p-5">
              <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                <div className="max-w-3xl">
                  <div className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-3 py-1 text-xs font-semibold text-muted shadow-soft">
                    <Sparkles className="h-3.5 w-3.5" /> {t('travelFeedTitle')}
                  </div>
                  <div className="mt-3 text-2xl font-bold tracking-tight sm:text-3xl">{cityLabel || t('locationHint')}</div>
                  <div className="mt-2 max-w-2xl text-sm text-muted">
                    {t('phaseHint')} {location ? `${t('city')}: ${cityLabel}` : t('deniedLocation')}
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  {(['home', 'airport', 'hotel', 'holiday', 'emergency', 'return'] as Phase[]).map((p) => (
                    <Button key={p} variant={p === phase ? 'default' : 'secondary'} size="sm" className="rounded-full" onClick={() => setPhase(p)}>
                      {p === 'home' ? t('phaseHome') : p === 'airport' ? t('phaseAirport') : p === 'hotel' ? t('phaseHotel') : p === 'holiday' ? t('phaseHoliday') : p === 'emergency' ? t('phaseEmergency') : t('phaseReturn')}
                    </Button>
                  ))}
                </div>
              </div>
            </Card>
          </motion.section>

          {modules.feed && <TravelFeedModule phase={phase} cityLabel={cityLabel} location={location} />}
          {modules.currency && <CurrencyModule />}
          {modules.timeline && <TravelTimelineModule phase={phase} onChange={setPhase} />}
          {modules.phrases && <TravelPhrasesModule locale={locale} />}
          {modules.discover && <DiscoveryModule location={location} cityLabel={cityLabel} />}
          {modules.money && <MoneyModule />}
          {modules.emergency && <EmergencyModule />}
        </div>

        <aside className="grid gap-4 self-start">
          <ModuleTogglePanel value={modules} onChange={setModules} />
          <Card className="p-4">
            <div className="text-sm font-semibold">{t('location')}</div>
            <div className="mt-2 text-sm text-muted">{location ? `${location.lat.toFixed(4)}, ${location.lon.toFixed(4)}` : t('deniedLocation')}</div>
            <div className="mt-1 text-sm text-muted">{cityLabel || t('locationHint')}</div>
            <div className="mt-4 text-xs text-muted">{t('moneyTip')}</div>
          </Card>
        </aside>
      </main>
    </div>
  );
}
