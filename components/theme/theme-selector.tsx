"use client";

import { Check, Moon, Sun } from "lucide-react";
import { useState } from "react";
import { useFruitTheme } from "@/components/theme/theme-provider";
import {
  fontFamilyOptions,
  themeGroups,
  type FontFamily,
  type ThemeMode,
  type ThemeName,
} from "@/lib/themes";
import { cn } from "@/lib/utils";

export function ThemeSelector() {
  const {
    themeId,
    themeMode,
    fontFamily,
    setThemeId,
    setThemeMode,
    setFontFamily,
    saving,
    loading,
    error,
  } = useFruitTheme();
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  async function handleThemeSelect(nextThemeId: ThemeName) {
    if (nextThemeId === themeId || saving) return;

    setSuccessMessage(null);
    const saved = await setThemeId(nextThemeId);

    if (saved) setSuccessMessage("Paleta actualizada");
  }

  async function handleModeSelect(nextThemeMode: ThemeMode) {
    if (nextThemeMode === themeMode || saving) return;

    setSuccessMessage(null);
    const saved = await setThemeMode(nextThemeMode);

    if (saved) setSuccessMessage("Modo actualizado");
  }

  async function handleFontSelect(nextFontFamily: FontFamily) {
    if (nextFontFamily === fontFamily || saving) return;

    setSuccessMessage(null);
    const saved = await setFontFamily(nextFontFamily);

    if (saved) setSuccessMessage("Tipografia actualizada");
  }

  return (
    <div className="space-y-7">
      <section className="space-y-3">
        <h4 className="text-sm font-semibold text-foreground">Modo</h4>
        <div className="inline-grid w-full grid-cols-2 gap-2 rounded-2xl border border-border bg-background p-1 sm:w-auto">
          <ModeButton
            active={themeMode === "light"}
            disabled={loading || saving}
            icon={Sun}
            label="Claro"
            onClick={() => handleModeSelect("light")}
          />
          <ModeButton
            active={themeMode === "dark"}
            disabled={loading || saving}
            icon={Moon}
            label="Oscuro"
            onClick={() => handleModeSelect("dark")}
          />
        </div>
      </section>

      <section className="space-y-3">
        <h4 className="text-sm font-semibold text-foreground">Tipografia</h4>
        <div className="grid gap-2 sm:grid-cols-3">
          {fontFamilyOptions.map((option) => {
            const selected = option.id === fontFamily;

            return (
              <button
                key={option.id}
                type="button"
                disabled={loading || saving}
                onClick={() => handleFontSelect(option.id)}
                className={cn(
                  "rounded-2xl border px-4 py-3 text-left text-sm font-semibold shadow-sm transition focus:outline-none focus:ring-4 focus:ring-rose-soft disabled:cursor-wait disabled:opacity-75",
                  selected
                    ? "border-brand bg-brand text-brand-foreground"
                    : "border-border bg-surface text-foreground hover:border-brand hover:bg-rose-50",
                )}
                style={{ fontFamily: option.css }}
              >
                {option.label}
              </button>
            );
          })}
        </div>
      </section>

      <div className="space-y-6" role="radiogroup" aria-label="Paletas visuales">
        {themeGroups.map((group) => (
          <section key={group.id} className="space-y-3">
            <h4 className="text-sm font-semibold text-foreground">
              {group.label}
            </h4>
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
              {group.themes.map((theme) => {
                const selected = theme.id === themeId;
                const palette = theme.palettes[themeMode];

                return (
                  <button
                    key={theme.id}
                    type="button"
                    role="radio"
                    aria-checked={selected}
                    disabled={loading || saving}
                    onClick={() => handleThemeSelect(theme.id)}
                    className={cn(
                      "group min-h-28 rounded-lg border bg-surface p-4 text-left shadow-sm transition focus:outline-none focus:ring-4 focus:ring-rose-soft disabled:cursor-wait disabled:opacity-75",
                      selected
                        ? "border-brand"
                        : "border-border hover:border-brand hover:bg-rose-50",
                    )}
                    style={
                      selected
                        ? {
                            backgroundColor: palette.primary,
                            color: palette.primaryForeground,
                          }
                        : undefined
                    }
                  >
                    <span className="flex items-start justify-between gap-3">
                      <span>
                        <span
                          className={cn(
                            "block text-sm font-semibold",
                            selected ? "" : "text-foreground",
                          )}
                        >
                          {theme.label}
                        </span>
                        <span
                          className={cn(
                            "mt-1 block text-xs leading-5",
                            selected ? "" : "text-muted",
                          )}
                        >
                          Paleta de {group.label.toLowerCase()}
                        </span>
                      </span>
                      <span
                        className={cn(
                          "flex size-6 shrink-0 items-center justify-center rounded-full border",
                          selected
                            ? "border-current bg-transparent"
                            : "border-border bg-white text-transparent",
                        )}
                        aria-hidden="true"
                      >
                        <Check className="size-4" strokeWidth={2.4} />
                      </span>
                    </span>

                    <span
                      className="mt-4 flex items-center gap-2"
                      aria-hidden="true"
                    >
                      <span
                        className="size-8 rounded-full border border-white shadow-sm"
                        style={{ backgroundColor: palette.primary }}
                      />
                      <span
                        className="size-8 rounded-full border border-white shadow-sm"
                        style={{ backgroundColor: palette.secondary }}
                      />
                      <span
                        className="size-8 rounded-full border border-border shadow-sm"
                        style={{ backgroundColor: palette.background }}
                      />
                    </span>
                  </button>
                );
              })}
            </div>
          </section>
        ))}
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

function ModeButton({
  active,
  disabled,
  icon: Icon,
  label,
  onClick,
}: {
  active: boolean;
  disabled: boolean;
  icon: typeof Sun;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={cn(
        "inline-flex h-10 items-center justify-center gap-2 rounded-xl px-4 text-sm font-semibold transition focus:outline-none focus:ring-4 focus:ring-rose-soft disabled:cursor-wait disabled:opacity-75",
        active
          ? "bg-brand text-brand-foreground shadow-sm"
          : "text-muted hover:bg-leaf-soft hover:text-leaf-strong",
      )}
    >
      <Icon className="size-4" aria-hidden="true" />
      {label}
    </button>
  );
}
