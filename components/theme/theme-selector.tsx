"use client";

import { Check } from "lucide-react";
import { useState } from "react";
import { useFruitTheme } from "@/components/theme/theme-provider";
import { fruitThemes, type FruitThemeId } from "@/lib/themes";
import { cn } from "@/lib/utils";

export function ThemeSelector() {
  const { themeId, setThemeId, saving, loading, error } = useFruitTheme();
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  async function handleSelect(nextThemeId: FruitThemeId) {
    if (nextThemeId === themeId || saving) {
      return;
    }

    setSuccessMessage(null);
    const saved = await setThemeId(nextThemeId);

    if (saved) {
      setSuccessMessage("Paleta actualizada");
    }
  }

  return (
    <div className="space-y-4">
      <div
        className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3"
        role="radiogroup"
        aria-label="Paletas visuales"
      >
        {fruitThemes.map((theme) => {
          const selected = theme.id === themeId;

          return (
            <button
              key={theme.id}
              type="button"
              role="radio"
              aria-checked={selected}
              disabled={loading || saving}
              onClick={() => handleSelect(theme.id)}
              className={cn(
                "group min-h-28 rounded-lg border bg-surface p-4 text-left shadow-sm transition focus:outline-none focus:ring-4 focus:ring-rose-soft disabled:cursor-wait disabled:opacity-75",
                selected
                  ? "border-brand bg-rose-soft"
                  : "border-border hover:border-brand hover:bg-rose-50",
              )}
            >
              <span className="flex items-start justify-between gap-3">
                <span>
                  <span
                    className={cn(
                      "block text-sm font-semibold",
                      selected ? "text-brand-active" : "text-foreground",
                    )}
                  >
                    {theme.label}
                  </span>
                  <span className="mt-1 block text-xs leading-5 text-muted">
                    Paleta frutal predefinida
                  </span>
                </span>
                <span
                  className={cn(
                    "flex size-6 shrink-0 items-center justify-center rounded-full border",
                    selected
                      ? "border-brand bg-brand text-brand-foreground"
                      : "border-border bg-white text-transparent",
                  )}
                  aria-hidden="true"
                >
                  <Check className="size-4" strokeWidth={2.4} />
                </span>
              </span>

              <span className="mt-4 flex items-center gap-2" aria-hidden="true">
                <span
                  className="size-8 rounded-full border border-white shadow-sm"
                  style={{ backgroundColor: theme.primary }}
                />
                <span
                  className="size-8 rounded-full border border-white shadow-sm"
                  style={{ backgroundColor: theme.secondary }}
                />
                <span
                  className="size-8 rounded-full border border-border shadow-sm"
                  style={{ backgroundColor: theme.softBg }}
                />
              </span>
            </button>
          );
        })}
      </div>

      <div className="min-h-6" aria-live="polite" aria-atomic="true">
        {error ? (
          <p className="text-sm font-medium text-danger">{error}</p>
        ) : successMessage ? (
          <p className="text-sm font-medium text-brand-active">
            {successMessage}
          </p>
        ) : null}
      </div>
    </div>
  );
}
