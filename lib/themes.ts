export const themeNames = [
  "strawberry",
  "kiwi",
  "blueberry",
  "mango",
  "pineapple",
  "melon",
  "rose",
  "tulip",
  "sunflower",
  "orchid",
  "chamomile",
  "lily",
  "chocolate",
  "mint",
  "cotton_candy",
  "caramel",
  "walnut",
  "cheesecake",
] as const;

export const themeModes = ["light", "dark"] as const;
export const fontFamilies = ["quicksand", "lora", "times"] as const;

export type ThemeName = (typeof themeNames)[number];
export type ThemeMode = (typeof themeModes)[number];
export type FontFamily = "quicksand" | "lora" | "times";
export type ThemeCategory = "fruits" | "flowers" | "sweets";

export type ThemePalette = {
  primary: string;
  secondary: string;
  background: string;
  foreground: string;
  muted: string;
  border: string;
  card: string;
  primaryForeground: string;
  softBg: string;
  active: string;
};

export type AppTheme = {
  id: ThemeName;
  label: string;
  category: ThemeCategory;
  palettes: Record<ThemeMode, ThemePalette>;
};

export type FruitThemeId = ThemeName;
export type FruitTheme = ThemePalette & {
  id: ThemeName;
  label: string;
  category: ThemeCategory;
  mode: ThemeMode;
  primaryHover: string;
  primaryDeep: string;
  accent: string;
  secondarySoft: string;
  textPrimary: string;
  textSecondary: string;
};

export const defaultThemeId: ThemeName = "strawberry";
export const defaultThemeMode: ThemeMode = "light";
export const defaultFontFamily: FontFamily = "quicksand";
export const fruitThemeIds = themeNames;
export const legacyFlowerThemeIds = ["lavender", "sakura", "hydrangea", "dahlia"] as const;

export const fontFamilyOptions: Array<{ id: FontFamily; label: string; css: string }> = [
  {
    id: "quicksand",
    label: "Quicksand",
    css: 'var(--font-quicksand), ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
  },
  {
    id: "lora",
    label: "Lora",
    css: 'var(--font-lora), Georgia, Cambria, "Times New Roman", serif',
  },
  {
    id: "times",
    label: "Times",
    css: '"Times New Roman", Times, Georgia, serif',
  },
];

const lightPalettes: Record<ThemeName, Omit<ThemePalette, "softBg" | "active">> = {
  strawberry: {
    primary: "#C73D6F",
    secondary: "#4E9F6D",
    background: "#FFF6F8",
    foreground: "#2B1A1F",
    muted: "#6E4A54",
    border: "#F1C7D2",
    card: "#FFFFFF",
    primaryForeground: "#FFFFFF",
  },
  kiwi: {
    primary: "#4CAF50",
    secondary: "#7A5C3E",
    background: "#F4FAF1",
    foreground: "#1F2A1F",
    muted: "#566352",
    border: "#CFE5C8",
    card: "#FFFFFF",
    primaryForeground: "#FFFFFF",
  },
  blueberry: {
    primary: "#3F51B5",
    secondary: "#7986CB",
    background: "#F4F6FF",
    foreground: "#1C2038",
    muted: "#555D82",
    border: "#CCD3F2",
    card: "#FFFFFF",
    primaryForeground: "#FFFFFF",
  },
  mango: {
    primary: "#F57C00",
    secondary: "#D84315",
    background: "#FFF8ED",
    foreground: "#2F1E12",
    muted: "#77553A",
    border: "#FFD6A3",
    card: "#FFFFFF",
    primaryForeground: "#1F1308",
  },
  pineapple: {
    primary: "#F2B705",
    secondary: "#2E7D32",
    background: "#FFFBEA",
    foreground: "#2B2410",
    muted: "#6E6238",
    border: "#F6E3A1",
    card: "#FFFFFF",
    primaryForeground: "#2B2410",
  },
  melon: {
    primary: "#F6A06D",
    secondary: "#8BC34A",
    background: "#FFF6EF",
    foreground: "#2F1E17",
    muted: "#7A5B4D",
    border: "#F3D0BC",
    card: "#FFFFFF",
    primaryForeground: "#2F1E17",
  },
  rose: {
    primary: "#B8325E",
    secondary: "#6A994E",
    background: "#FFF5F7",
    foreground: "#2D151E",
    muted: "#744654",
    border: "#E8B8C8",
    card: "#FFFFFF",
    primaryForeground: "#FFFFFF",
  },
  tulip: {
    primary: "#E85D3F",
    secondary: "#2A9D8F",
    background: "#FFF6F1",
    foreground: "#301812",
    muted: "#7B5147",
    border: "#F2B8A8",
    card: "#FFFFFF",
    primaryForeground: "#2B120D",
  },
  sunflower: {
    primary: "#E3A600",
    secondary: "#5C8A32",
    background: "#FFFBEA",
    foreground: "#2D2412",
    muted: "#6B5B2F",
    border: "#F2DD8A",
    card: "#FFFFFF",
    primaryForeground: "#2D2412",
  },
  orchid: {
    primary: "#8E24AA",
    secondary: "#26A69A",
    background: "#FCF4FF",
    foreground: "#2B1233",
    muted: "#6B4B73",
    border: "#DDB5E6",
    card: "#FFFFFF",
    primaryForeground: "#FFFFFF",
  },
  chamomile: {
    primary: "#F6C445",
    secondary: "#6B8E23",
    background: "#FFFDF2",
    foreground: "#2B2410",
    muted: "#6D613A",
    border: "#EEDC9A",
    card: "#FFFFFF",
    primaryForeground: "#2B2410",
  },
  lily: {
    primary: "#6D8F71",
    secondary: "#D9A5B3",
    background: "#FAFFF8",
    foreground: "#17251A",
    muted: "#526452",
    border: "#CFE1CD",
    card: "#FFFFFF",
    primaryForeground: "#FFFFFF",
  },
  chocolate: {
    primary: "#4E342E",
    secondary: "#8D6E63",
    background: "#FAF6F3",
    foreground: "#241815",
    muted: "#6C5A54",
    border: "#D8C8C0",
    card: "#FFFFFF",
    primaryForeground: "#FFFFFF",
  },
  mint: {
    primary: "#2ECC71",
    secondary: "#66BB6A",
    background: "#F1FFF7",
    foreground: "#133325",
    muted: "#4C715F",
    border: "#BCEFD2",
    card: "#FFFFFF",
    primaryForeground: "#10301F",
  },
  cotton_candy: {
    primary: "#64B5F6",
    secondary: "#F48FB1",
    background: "#F6FBFF",
    foreground: "#182B3A",
    muted: "#557083",
    border: "#CBE7FA",
    card: "#FFFFFF",
    primaryForeground: "#102333",
  },
  caramel: {
    primary: "#D2691E",
    secondary: "#FFB74D",
    background: "#FFF8EF",
    foreground: "#2E1A0B",
    muted: "#755331",
    border: "#F0C99B",
    card: "#FFFFFF",
    primaryForeground: "#FFFFFF",
  },
  walnut: {
    primary: "#795548",
    secondary: "#A1887F",
    background: "#FAF5F1",
    foreground: "#261A16",
    muted: "#6F5A52",
    border: "#D7C3B8",
    card: "#FFFFFF",
    primaryForeground: "#FFFFFF",
  },
  cheesecake: {
    primary: "#F6C453",
    secondary: "#C97C5D",
    background: "#FFF9EC",
    foreground: "#2D2111",
    muted: "#765F39",
    border: "#F0D9A6",
    card: "#FFFFFF",
    primaryForeground: "#2D2111",
  },
};

const darkPalettes: Record<ThemeName, Omit<ThemePalette, "softBg" | "active">> = {
  strawberry: dark("#F26D99", "#77D49B", "#211017", "#FFF1F5", "#E8B8C8", "#5C2A39", "#2D1720", "#2B1A1F"),
  kiwi: dark("#7DD882", "#C2A27A", "#101C11", "#F1FAF0", "#C4D8C1", "#38553A", "#172617", "#102010"),
  blueberry: dark("#8FA2FF", "#AAB6FF", "#11162E", "#F0F3FF", "#C6CDEF", "#394374", "#181F3F", "#111827"),
  mango: dark("#FFB15C", "#FF7A45", "#221406", "#FFF4E6", "#F3C79A", "#70451D", "#2F1C0B", "#2F1E12"),
  pineapple: dark("#FFD95A", "#73D17A", "#201A07", "#FFF7D8", "#EAD58C", "#675719", "#2B230B", "#2B2410"),
  melon: dark("#FFB58A", "#B3E36D", "#23130E", "#FFF0E7", "#E9B89F", "#704C3B", "#301B13", "#2F1E17"),
  rose: dark("#F06A93", "#A9D87D", "#211018", "#FFF0F5", "#E9BAC8", "#693047", "#2F1721", "#2D151E"),
  tulip: dark("#FF8A70", "#63D5C8", "#24120D", "#FFF1EA", "#E9B9AA", "#74392D", "#321A13", "#301812"),
  sunflower: dark("#FFD96A", "#A3CF63", "#211906", "#FFF8D8", "#E8D28B", "#675418", "#2E240B", "#2D2412"),
  orchid: dark("#D96EF0", "#6FE1D5", "#1F0B26", "#FDEEFF", "#E5B5ED", "#65306F", "#2D1236", "#1F0B26"),
  chamomile: dark("#FFE08A", "#B9D46A", "#201B08", "#FFF9DE", "#E5D694", "#665A1F", "#2B240D", "#2B2410"),
  lily: dark("#A9D3AD", "#F0C3CF", "#0F1C12", "#F1FFF2", "#BDD7BF", "#385B3D", "#172818", "#0F1C12"),
  chocolate: dark("#B98A78", "#D0B2A6", "#1C110E", "#FAEFEA", "#D8BEB4", "#5A4038", "#281915", "#1C110E"),
  mint: dark("#62E99B", "#8DE094", "#0D2118", "#EFFFF5", "#BDE8D0", "#2C5E45", "#132D20", "#0D2118"),
  cotton_candy: dark("#91CEFF", "#FFADD0", "#0F1C28", "#EFF8FF", "#C5DEF0", "#315975", "#162A3A", "#0F1C28"),
  caramel: dark("#F2A25C", "#FFD08A", "#211205", "#FFF0DE", "#E6C099", "#70451F", "#2F1A09", "#211205"),
  walnut: dark("#B9907E", "#CDB7AE", "#1C120F", "#F8EEE8", "#D6BFB4", "#584037", "#281A16", "#1C120F"),
  cheesecake: dark("#FFE08A", "#E9A180", "#211908", "#FFF5D8", "#E7D299", "#6E5520", "#2C220C", "#2D2111"),
};

const themeMeta: Record<ThemeName, { label: string; category: ThemeCategory }> = {
  strawberry: { label: "Frutilla", category: "fruits" },
  kiwi: { label: "Kiwi", category: "fruits" },
  blueberry: { label: "Arándano", category: "fruits" },
  mango: { label: "Mango", category: "fruits" },
  pineapple: { label: "Piña", category: "fruits" },
  melon: { label: "Melón", category: "fruits" },
  rose: { label: "Rosa", category: "flowers" },
  tulip: { label: "Tulipán", category: "flowers" },
  sunflower: { label: "Girasol", category: "flowers" },
  orchid: { label: "Orquídea", category: "flowers" },
  chamomile: { label: "Manzanilla", category: "flowers" },
  lily: { label: "Lirio", category: "flowers" },
  chocolate: { label: "Chocolate", category: "sweets" },
  mint: { label: "Menta", category: "sweets" },
  cotton_candy: { label: "Algodón de azúcar", category: "sweets" },
  caramel: { label: "Caramelo", category: "sweets" },
  walnut: { label: "Nuez", category: "sweets" },
  cheesecake: { label: "Cheesecake", category: "sweets" },
};

export const themes = Object.fromEntries(
  themeNames.map((id) => [
    id,
    {
      id,
      label: themeMeta[id].label,
      category: themeMeta[id].category,
      palettes: {
        light: createPalette(lightPalettes[id]),
        dark: createPalette(darkPalettes[id]),
      },
    },
  ]),
) as Record<ThemeName, AppTheme>;

export const themeGroups: Array<{
  id: ThemeCategory;
  label: string;
  themes: AppTheme[];
}> = [
  { id: "fruits", label: "Frutas", themes: themeNames.filter((id) => themes[id].category === "fruits").map((id) => themes[id]) },
  { id: "flowers", label: "Flores", themes: themeNames.filter((id) => themes[id].category === "flowers").map((id) => themes[id]) },
  { id: "sweets", label: "Dulces", themes: themeNames.filter((id) => themes[id].category === "sweets").map((id) => themes[id]) },
];

export const fruitThemesById = Object.fromEntries(
  themeNames.map((id) => [id, getTheme(id, defaultThemeMode)]),
) as Record<ThemeName, FruitTheme>;

export const fruitThemes = themeNames.map((id) => fruitThemesById[id]);

export function isFruitThemeId(value: unknown): value is ThemeName {
  return typeof value === "string" && themeNames.includes(value as ThemeName);
}

export function normalizeThemeId(value: unknown): ThemeName {
  if (isFruitThemeId(value)) return value;
  if (
    typeof value === "string" &&
    legacyFlowerThemeIds.includes(value as (typeof legacyFlowerThemeIds)[number])
  ) {
    return "rose";
  }
  return defaultThemeId;
}

export function isThemeMode(value: unknown): value is ThemeMode {
  return typeof value === "string" && themeModes.includes(value as ThemeMode);
}

export function isFontFamily(value: unknown): value is FontFamily {
  return typeof value === "string" && fontFamilies.includes(value as FontFamily);
}

export function getFruitTheme(id: unknown): FruitTheme {
  return getTheme(normalizeThemeId(id), defaultThemeMode);
}

export function getTheme(id: ThemeName, mode: ThemeMode): FruitTheme {
  const theme = themes[id];
  const palette = theme.palettes[mode];

  return {
    ...palette,
    id,
    label: theme.label,
    category: theme.category,
    mode,
    primaryHover: mixHex(palette.primary, palette.foreground, mode === "dark" ? 0.88 : 0.82),
    primaryDeep: mixHex(palette.primary, palette.foreground, mode === "dark" ? 0.68 : 0.62),
    accent: palette.secondary,
    secondarySoft: mixHex(palette.secondary, palette.card, mode === "dark" ? 0.28 : 0.16),
    textPrimary: palette.foreground,
    textSecondary: palette.muted,
  };
}

export function getFontFamilyCss(fontFamily: FontFamily) {
  return fontFamilyOptions.find((option) => option.id === fontFamily)?.css ?? fontFamilyOptions[0].css;
}

export function getThemeCssVariables(theme: FruitTheme): Record<string, string> {
  return {
    "--theme-primary": theme.primary,
    "--theme-secondary": theme.secondary,
    "--theme-background": theme.background,
    "--theme-foreground": theme.foreground,
    "--theme-muted": theme.muted,
    "--theme-border": theme.border,
    "--theme-card": theme.card,
    "--theme-primary-foreground": theme.primaryForeground,
    "--theme-soft-bg": theme.softBg,
    "--theme-active": theme.active,
    "--theme-primary-hover": theme.primaryHover,
    "--theme-primary-deep": theme.primaryDeep,
    "--theme-accent": theme.accent,
    "--theme-secondary-soft": theme.secondarySoft,
    "--theme-text-primary": theme.textPrimary,
    "--theme-text-secondary": theme.textSecondary,
  };
}

export function getContrastText(hex: string): "#111827" | "#FFFFFF" {
  return getLuminance(hex) > 0.45 ? "#111827" : "#FFFFFF";
}

function createPalette(palette: Omit<ThemePalette, "softBg" | "active">): ThemePalette {
  const primaryForeground = getAccessibleTextColor(
    palette.primary,
    palette.primaryForeground,
    palette.foreground,
  );

  return {
    ...palette,
    primaryForeground,
    softBg: mixHex(palette.primary, palette.background, 0.08),
    active: palette.primary,
  };
}

function dark(
  primary: string,
  secondary: string,
  background: string,
  foreground: string,
  muted: string,
  border: string,
  card: string,
  primaryForeground: string,
): Omit<ThemePalette, "softBg" | "active"> {
  return { primary, secondary, background, foreground, muted, border, card, primaryForeground };
}

function getAccessibleTextColor(background: string, preferredText: string, fallbackText: string) {
  if (getContrastRatio(background, preferredText) >= 4.5) return preferredText;
  if (getContrastRatio(background, fallbackText) >= 4.5) return fallbackText;
  return getContrastText(background);
}

function normalizeHex(hex: string) {
  const cleanHex = hex.replace("#", "").trim();

  if (cleanHex.length === 3) {
    return cleanHex
      .split("")
      .map((character) => `${character}${character}`)
      .join("");
  }

  return cleanHex.padEnd(6, "0").slice(0, 6);
}

function getLinearChannel(value: number) {
  const channel = value / 255;
  return channel <= 0.03928
    ? channel / 12.92
    : ((channel + 0.055) / 1.055) ** 2.4;
}

function getLuminance(hex: string) {
  const normalizedHex = normalizeHex(hex);
  const red = Number.parseInt(normalizedHex.slice(0, 2), 16);
  const green = Number.parseInt(normalizedHex.slice(2, 4), 16);
  const blue = Number.parseInt(normalizedHex.slice(4, 6), 16);

  return (
    0.2126 * getLinearChannel(red) +
    0.7152 * getLinearChannel(green) +
    0.0722 * getLinearChannel(blue)
  );
}

function getContrastRatio(background: string, text: string) {
  const backgroundLuminance = getLuminance(background);
  const textLuminance = getLuminance(text);
  const lighter = Math.max(backgroundLuminance, textLuminance);
  const darker = Math.min(backgroundLuminance, textLuminance);

  return (lighter + 0.05) / (darker + 0.05);
}

function mixHex(hexA: string, hexB: string, weightA: number) {
  const colorA = normalizeHex(hexA);
  const colorB = normalizeHex(hexB);
  const weightB = 1 - weightA;
  const channels = [0, 2, 4].map((start) => {
    const channelA = Number.parseInt(colorA.slice(start, start + 2), 16);
    const channelB = Number.parseInt(colorB.slice(start, start + 2), 16);
    return Math.round(channelA * weightA + channelB * weightB)
      .toString(16)
      .padStart(2, "0");
  });

  return `#${channels.join("")}`;
}
