"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { supabase } from "@/lib/supabase";
import {
  defaultFontFamily,
  defaultThemeId,
  defaultThemeMode,
  fruitThemesById,
  getFontFamilyCss,
  getTheme,
  getThemeCssVariables,
  isFontFamily,
  isThemeMode,
  normalizeThemeId,
  type FontFamily,
  type FruitTheme,
  type ThemeMode,
  type ThemeName,
} from "@/lib/themes";

type ThemeContextValue = {
  theme: FruitTheme;
  themeId: ThemeName;
  themeMode: ThemeMode;
  fontFamily: FontFamily;
  loading: boolean;
  saving: boolean;
  error: string | null;
  setThemeId: (themeId: ThemeName) => Promise<boolean>;
  setThemeMode: (themeMode: ThemeMode) => Promise<boolean>;
  setFontFamily: (fontFamily: FontFamily) => Promise<boolean>;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

type PreferenceRow = {
  theme: string | null;
  theme_mode: string | null;
  font_family: string | null;
};

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [themeId, setThemeIdState] = useState<ThemeName>(defaultThemeId);
  const [themeMode, setThemeModeState] = useState<ThemeMode>(defaultThemeMode);
  const [fontFamily, setFontFamilyState] = useState<FontFamily>(defaultFontFamily);
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const theme = getTheme(themeId, themeMode);

  useEffect(() => {
    applyAppearance(theme, fontFamily);
  }, [fontFamily, theme]);

  useEffect(() => {
    let active = true;

    async function loadThemePreference() {
      setLoading(true);
      setError(null);

      const { data: sessionData } = await supabase.auth.getSession();
      const currentUserId = sessionData.session?.user.id ?? null;

      if (!active) return;

      setUserId(currentUserId);

      if (!currentUserId) {
        setThemeIdState(defaultThemeId);
        setThemeModeState(defaultThemeMode);
        setFontFamilyState(defaultFontFamily);
        setLoading(false);
        return;
      }

      const { data, error: selectError } = await supabase
        .from("user_preferences")
        .select("theme,theme_mode,font_family")
        .eq("user_id", currentUserId)
        .maybeSingle();

      if (!active) return;

      if (selectError) {
        setError("No se pudo cargar la apariencia. Se usara Frutilla claro.");
        setThemeIdState(defaultThemeId);
        setThemeModeState(defaultThemeMode);
        setFontFamilyState(defaultFontFamily);
        setLoading(false);
        return;
      }

      const preferences = data as PreferenceRow | null;
      const nextThemeId = normalizeThemeId(preferences?.theme);
      const nextThemeMode = isThemeMode(preferences?.theme_mode)
        ? preferences.theme_mode
        : defaultThemeMode;
      const nextFontFamily = isFontFamily(preferences?.font_family)
        ? preferences.font_family
        : defaultFontFamily;

      setThemeIdState(nextThemeId);
      setThemeModeState(nextThemeMode);
      setFontFamilyState(nextFontFamily);

      if (
        !preferences ||
        preferences.theme !== nextThemeId ||
        preferences.theme_mode !== nextThemeMode ||
        preferences.font_family !== nextFontFamily
      ) {
        await savePreferences(currentUserId, {
          theme: nextThemeId,
          theme_mode: nextThemeMode,
          font_family: nextFontFamily,
        });
      }

      if (active) setLoading(false);
    }

    loadThemePreference();

    return () => {
      active = false;
    };
  }, []);

  const persistPreference = useCallback(
    async (
      patch: Partial<{
        theme: ThemeName;
        theme_mode: ThemeMode;
        font_family: FontFamily;
      }>,
    ) => {
      if (!userId) return true;

      const { error: upsertError } = await savePreferences(userId, {
        theme: patch.theme ?? themeId,
        theme_mode: patch.theme_mode ?? themeMode,
        font_family: patch.font_family ?? fontFamily,
      });

      if (upsertError) {
        setError("No se pudo guardar la apariencia. Intentalo nuevamente.");
        return false;
      }

      return true;
    },
    [fontFamily, themeId, themeMode, userId],
  );

  const setThemeId = useCallback(
    async (nextThemeId: ThemeName) => {
      const previousThemeId = themeId;

      setError(null);
      setSaving(true);
      setThemeIdState(nextThemeId);

      const saved = await persistPreference({ theme: nextThemeId });

      if (!saved) {
        setThemeIdState(previousThemeId);
      }

      setSaving(false);
      return saved;
    },
    [persistPreference, themeId],
  );

  const setThemeMode = useCallback(
    async (nextThemeMode: ThemeMode) => {
      const previousThemeMode = themeMode;

      setError(null);
      setSaving(true);
      setThemeModeState(nextThemeMode);

      const saved = await persistPreference({ theme_mode: nextThemeMode });

      if (!saved) {
        setThemeModeState(previousThemeMode);
      }

      setSaving(false);
      return saved;
    },
    [persistPreference, themeMode],
  );

  const setFontFamily = useCallback(
    async (nextFontFamily: FontFamily) => {
      const previousFontFamily = fontFamily;

      setError(null);
      setSaving(true);
      setFontFamilyState(nextFontFamily);

      const saved = await persistPreference({ font_family: nextFontFamily });

      if (!saved) {
        setFontFamilyState(previousFontFamily);
      }

      setSaving(false);
      return saved;
    },
    [fontFamily, persistPreference],
  );

  const value = useMemo<ThemeContextValue>(
    () => ({
      theme,
      themeId,
      themeMode,
      fontFamily,
      loading,
      saving,
      error,
      setThemeId,
      setThemeMode,
      setFontFamily,
    }),
    [
      error,
      fontFamily,
      loading,
      saving,
      setFontFamily,
      setThemeId,
      setThemeMode,
      theme,
      themeId,
      themeMode,
    ],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useFruitTheme() {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error("useFruitTheme must be used within ThemeProvider");
  }

  return context;
}

function applyAppearance(theme: FruitTheme, fontFamily: FontFamily) {
  const root = document.documentElement;

  Object.entries(getThemeCssVariables(theme)).forEach(([name, value]) => {
    root.style.setProperty(name, value);
  });

  root.style.setProperty("--app-font-family", getFontFamilyCss(fontFamily));
  root.dataset.theme = theme.id;
  root.dataset.themeMode = theme.mode;
}

function savePreferences(
  userId: string,
  preferences: {
    theme: ThemeName;
    theme_mode: ThemeMode;
    font_family: FontFamily;
  },
) {
  return supabase.from("user_preferences").upsert(
    {
      user_id: userId,
      ...preferences,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "user_id" },
  );
}

export { fruitThemesById };
