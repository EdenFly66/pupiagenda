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
  defaultThemeId,
  fruitThemesById,
  getFruitTheme,
  getThemeCssVariables,
  isFruitThemeId,
  type FruitTheme,
  type FruitThemeId,
} from "@/lib/themes";

type ThemeContextValue = {
  theme: FruitTheme;
  themeId: FruitThemeId;
  loading: boolean;
  saving: boolean;
  error: string | null;
  setThemeId: (themeId: FruitThemeId) => Promise<boolean>;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [themeId, setThemeIdState] = useState<FruitThemeId>(defaultThemeId);
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const theme = fruitThemesById[themeId];

  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  useEffect(() => {
    let active = true;

    async function loadThemePreference() {
      setLoading(true);
      setError(null);

      const { data: sessionData } = await supabase.auth.getSession();
      const currentUserId = sessionData.session?.user.id ?? null;

      if (!active) {
        return;
      }

      setUserId(currentUserId);

      if (!currentUserId) {
        setThemeIdState(defaultThemeId);
        setLoading(false);
        return;
      }

      const { data, error: selectError } = await supabase
        .from("user_preferences")
        .select("theme")
        .eq("user_id", currentUserId)
        .maybeSingle();

      if (!active) {
        return;
      }

      if (selectError) {
        setError("No se pudo cargar la paleta. Se usara Frutilla.");
        setThemeIdState(defaultThemeId);
        setLoading(false);
        return;
      }

      if (isFruitThemeId(data?.theme)) {
        setThemeIdState(data.theme);
        setLoading(false);
        return;
      }

      setThemeIdState(defaultThemeId);
      await supabase.from("user_preferences").upsert({
        user_id: currentUserId,
        theme: defaultThemeId,
        updated_at: new Date().toISOString(),
      });

      if (active) {
        setLoading(false);
      }
    }

    loadThemePreference();

    return () => {
      active = false;
    };
  }, []);

  const setThemeId = useCallback(
    async (nextThemeId: FruitThemeId) => {
      const nextTheme = getFruitTheme(nextThemeId);
      const previousThemeId = themeId;

      setError(null);
      setSaving(true);
      setThemeIdState(nextTheme.id);

      if (!userId) {
        setSaving(false);
        return true;
      }

      const { error: upsertError } = await supabase
        .from("user_preferences")
        .upsert({
          user_id: userId,
          theme: nextTheme.id,
          updated_at: new Date().toISOString(),
        });

      if (upsertError) {
        setThemeIdState(previousThemeId);
        setError("No se pudo guardar la paleta. Intentalo nuevamente.");
        setSaving(false);
        return false;
      }

      setSaving(false);
      return true;
    },
    [themeId, userId],
  );

  const value = useMemo<ThemeContextValue>(
    () => ({
      theme,
      themeId,
      loading,
      saving,
      error,
      setThemeId,
    }),
    [error, loading, saving, setThemeId, theme, themeId],
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

function applyTheme(theme: FruitTheme) {
  const root = document.documentElement;

  Object.entries(getThemeCssVariables(theme)).forEach(([name, value]) => {
    root.style.setProperty(name, value);
  });
}
