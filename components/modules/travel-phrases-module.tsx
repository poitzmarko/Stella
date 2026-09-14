"use client";

import { useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tabs,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";

import { useI18n } from "@/lib/i18n";
import { phrases } from "@/lib/mock-data";
import type { Language } from "@/lib/types";

const categories = [
  {
    id: "hotel",
    label: "Hotel",
  },
  {
    id: "restaurant",
    label: "Restaurant",
  },
  {
    id: "taxi",
    label: "Taxi",
  },
  {
    id: "emergency",
    label: "Emergency",
  },
  {
    id: "shopping",
    label: "Shopping",
  },
] as const;

type PhraseCategory =
  (typeof categories)[number]["id"];

type Props = {
  locale: Language;
};

/**
 * Returns the localized phrase where possible.
 *
 * The application uses "zhHans" as its language code,
 * while some phrase data can use "zh".
 */
function getLocalPhrase(
  local: Record<string, string>,
  locale: Language,
): string {
  const localKey =
    locale === "zhHans"
      ? "zh"
      : locale;

  return (
    local[localKey] ??
    local.en ??
    local.de ??
    ""
  );
}

/**
 * Maps application languages to browser speech-synthesis
 * language identifiers.
 */
function getSpeechLanguage(
  locale: Language,
): string {
  switch (locale) {
    case "de":
      return "de-DE";

    case "en":
      return "en-US";

    case "es":
      return "es-ES";

    case "fr":
      return "fr-FR";

    case "it":
      return "it-IT";

    case "pt":
      return "pt-PT";

    case "zhHans":
      return "zh-CN";
  }
}

/**
 * Category labels.
 *
 * This uses a typed lookup instead of an exhaustive switch,
 * avoiding "never" inference problems in TypeScript.
 */
const categoryLabels: Record<
  PhraseCategory,
  string
> = {
  hotel: "Hotel",
  restaurant: "Restaurant",
  taxi: "Taxi",
  emergency: "Emergency",
  shopping: "Shopping",
};

export function TravelPhrasesModule({
  locale,
}: Props) {
  const { t } = useI18n();

  const [
    category,
    setCategory,
  ] = useState<PhraseCategory>(
    "hotel",
  );

  const [
    showLocal,
    setShowLocal,
  ] = useState(true);

  const filtered = useMemo(
    () =>
      phrases.filter(
        (phrase) =>
          phrase.category === category,
      ),
    [category],
  );

  const speak = (
    english: string,
    local: string,
  ) => {
    if (
      !(
        "speechSynthesis" in
        window
      )
    ) {
      return;
    }

    window.speechSynthesis.cancel();

    const texts = [
      english,
      ...(showLocal && local
        ? [local]
        : []),
    ];

    texts.forEach(
      (text, index) => {
        const utterance =
          new SpeechSynthesisUtterance(
            text,
          );

        utterance.lang =
          index === 0
            ? "en-US"
            : getSpeechLanguage(
                locale,
              );

        window.setTimeout(
          () => {
            window.speechSynthesis.speak(
              utterance,
            );
          },
          index * 700,
        );
      },
    );
  };

  const copyPhrase = async (
    phrase: string,
  ) => {
    try {
      await navigator.clipboard.writeText(
        phrase,
      );
    } catch {
      /*
       * Clipboard access can be denied in
       * restricted browser contexts.
       */
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {t("phrases")}
        </CardTitle>

        <CardDescription>
          {t("phrasesHint")}
        </CardDescription>
      </CardHeader>

      <CardContent className="grid gap-4">
        <div className="overflow-x-auto pb-1">
          <Tabs>
            <TabsList>
              {categories.map(
                (item) => (
                  <TabsTrigger
                    key={item.id}
                    active={
                      item.id ===
                      category
                    }
                    onClick={() =>
                      setCategory(
                        item.id,
                      )
                    }
                  >
                    {categoryLabels[
                      item.id
                    ]}
                  </TabsTrigger>
                ),
              )}
            </TabsList>
          </Tabs>
        </div>

        <div className="flex items-center justify-between gap-3 rounded-[1.2rem] border border-border bg-white/60 p-3 dark:bg-slate-950/30">
          <div>
            <div className="text-sm font-semibold">
              {t("showLocal")}
            </div>

            <div className="mt-1 text-xs text-muted">
              {locale ===
              "zhHans"
                ? "English + 中文"
                : `English + ${locale.toUpperCase()}`}
            </div>
          </div>

          <Switch
            checked={showLocal}
            onChange={(event) =>
              setShowLocal(
                event.currentTarget
                  .checked,
              )
            }
          />
        </div>

        <div className="grid gap-2 md:grid-cols-2">
          {filtered.map(
            (item) => {
              const localPhrase =
                getLocalPhrase(
                  item.local as Record<
                    string,
                    string
                  >,
                  locale,
                );

              return (
                <div
                  key={item.id}
                  className="rounded-[1.2rem] border border-border bg-surface p-3 shadow-soft"
                >
                  <div className="text-sm font-semibold leading-6">
                    {item.english}
                  </div>

                  {showLocal &&
                    localPhrase && (
                      <div className="mt-1 text-sm text-muted">
                        {
                          localPhrase
                        }
                      </div>
                    )}

                  <div className="mt-3 flex flex-wrap gap-2">
                    <Button
                      size="sm"
                      className="rounded-full"
                      onClick={() =>
                        void copyPhrase(
                          item.english,
                        )
                      }
                    >
                      📋 Copy
                    </Button>

                    <Button
                      size="sm"
                      variant="secondary"
                      className="rounded-full"
                      onClick={() =>
                        speak(
                          item.english,
                          localPhrase,
                        )
                      }
                    >
                      🔊{" "}
                      {t("speak")}
                    </Button>
                  </div>
                </div>
              );
            },
          )}
        </div>

        {filtered.length === 0 && (
          <div className="rounded-[1.2rem] border border-border bg-surface p-4 text-sm text-muted">
            {t("empty")}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
