export const fruitThemeIds = [
  "strawberry",
  "blueberry",
  "kiwi",
  "mango",
  "peach",
  "cherry",
  "grape",
  "pineapple",
  "watermelon",
  "orange",
  "green_apple",
  "lemon",
] as const;

export type FruitThemeId = (typeof fruitThemeIds)[number];

export type FruitTheme = {
  id: FruitThemeId;
  label: string;
  emoji?: string;
  primary: string;
  primaryHover: string;
  primaryDeep: string;
  softBg: string;
  accent: string;
  secondary: string;
  secondarySoft: string;
  textPrimary: string;
  textSecondary: string;
  border: string;
};

export const defaultThemeId: FruitThemeId = "strawberry";

export const fruitThemes: FruitTheme[] = [
  {
    id: "strawberry",
    label: "Frutilla",
    primary: "#C9436E",
    primaryHover: "#A63A5C",
    primaryDeep: "#8E2E4A",
    softBg: "#FDECEF",
    accent: "#F28BA8",
    secondary: "#5CA46E",
    secondarySoft: "#E6F4EA",
    textPrimary: "#2E2A2A",
    textSecondary: "#6B5F5F",
    border: "#E8DCDC",
  },
  {
    id: "blueberry",
    label: "Arándano",
    primary: "#5B6CBF",
    primaryHover: "#4A5AA6",
    primaryDeep: "#3A4682",
    softBg: "#EEF1FF",
    accent: "#8FA2FF",
    secondary: "#7C8AE6",
    secondarySoft: "#E3E7FF",
    textPrimary: "#2E2A2A",
    textSecondary: "#6B5F5F",
    border: "#DDE2F5",
  },
  {
    id: "kiwi",
    label: "Kiwi",
    primary: "#5CA46E",
    primaryHover: "#4B8C5C",
    primaryDeep: "#3A6F49",
    softBg: "#E6F4EA",
    accent: "#8ED19B",
    secondary: "#7A5A3A",
    secondarySoft: "#F2EDE6",
    textPrimary: "#2E2A2A",
    textSecondary: "#6B5F5F",
    border: "#DDEBDD",
  },
  {
    id: "mango",
    label: "Mango",
    primary: "#E07A3F",
    primaryHover: "#C46832",
    primaryDeep: "#9F5228",
    softBg: "#FDF1E8",
    accent: "#F3A66E",
    secondary: "#C9436E",
    secondarySoft: "#FDECEF",
    textPrimary: "#2E2A2A",
    textSecondary: "#6B5F5F",
    border: "#EAD7C8",
  },
  {
    id: "peach",
    label: "Durazno",
    primary: "#E89C8B",
    primaryHover: "#D48573",
    primaryDeep: "#B36A5B",
    softBg: "#FDF1EE",
    accent: "#F5B7A8",
    secondary: "#A36F5C",
    secondarySoft: "#F3E8E3",
    textPrimary: "#2E2A2A",
    textSecondary: "#6B5F5F",
    border: "#EAD8D1",
  },
  {
    id: "cherry",
    label: "Cereza",
    primary: "#A8324A",
    primaryHover: "#8E2A3E",
    primaryDeep: "#6F1F30",
    softBg: "#F9ECEF",
    accent: "#D86A7F",
    secondary: "#5CA46E",
    secondarySoft: "#E6F4EA",
    textPrimary: "#2E2A2A",
    textSecondary: "#6B5F5F",
    border: "#EAD4DA",
  },
  {
    id: "grape",
    label: "Uva",
    primary: "#8E6BBE",
    primaryHover: "#7758A3",
    primaryDeep: "#5F4580",
    softBg: "#F3F0FA",
    accent: "#B49BDA",
    secondary: "#6B5F5F",
    secondarySoft: "#F0ECEC",
    textPrimary: "#2E2A2A",
    textSecondary: "#6B5F5F",
    border: "#DED6EA",
  },
  {
    id: "pineapple",
    label: "Piña",
    primary: "#4CAF7A",
    primaryHover: "#3F9567",
    primaryDeep: "#31724F",
    softBg: "#EAF7F0",
    accent: "#A8E0C0",
    secondary: "#D8A85B",
    secondarySoft: "#F5ECD9",
    textPrimary: "#2E2A2A",
    textSecondary: "#6B5F5F",
    border: "#D7E9DE",
  },
  {
    id: "watermelon",
    label: "Sandía",
    primary: "#E35D87",
    primaryHover: "#C94C73",
    primaryDeep: "#A53C5D",
    softBg: "#FDECEF",
    accent: "#F28BA8",
    secondary: "#5CA46E",
    secondarySoft: "#E6F4EA",
    textPrimary: "#2E2A2A",
    textSecondary: "#6B5F5F",
    border: "#EAD6DC",
  },
  {
    id: "orange",
    label: "Naranja",
    primary: "#E67E22",
    primaryHover: "#C96C1D",
    primaryDeep: "#9F5416",
    softBg: "#FDF2E7",
    accent: "#F3A66E",
    secondary: "#2E7D32",
    secondarySoft: "#E6F4EA",
    textPrimary: "#2E2A2A",
    textSecondary: "#6B5F5F",
    border: "#EAD8C6",
  },
  {
    id: "green_apple",
    label: "Manzana verde",
    primary: "#6BBF59",
    primaryHover: "#5AA64A",
    primaryDeep: "#46823A",
    softBg: "#EEF8EC",
    accent: "#A6E59A",
    secondary: "#6B5F5F",
    secondarySoft: "#F0ECEC",
    textPrimary: "#2E2A2A",
    textSecondary: "#6B5F5F",
    border: "#DAEBD6",
  },
  {
    id: "lemon",
    label: "Limón",
    primary: "#9DBF3B",
    primaryHover: "#859F31",
    primaryDeep: "#6A7F27",
    softBg: "#F6FBEA",
    accent: "#CFE88A",
    secondary: "#5CA46E",
    secondarySoft: "#E6F4EA",
    textPrimary: "#2E2A2A",
    textSecondary: "#6B5F5F",
    border: "#E3EBCF",
  },
];

export const fruitThemesById = Object.fromEntries(
  fruitThemes.map((theme) => [theme.id, theme]),
) as Record<FruitThemeId, FruitTheme>;

export function isFruitThemeId(value: unknown): value is FruitThemeId {
  return (
    typeof value === "string" &&
    fruitThemeIds.includes(value as FruitThemeId)
  );
}

export function getFruitTheme(id: unknown): FruitTheme {
  return fruitThemesById[isFruitThemeId(id) ? id : defaultThemeId];
}

export function getThemeCssVariables(theme: FruitTheme): Record<string, string> {
  return {
    "--theme-primary": theme.primary,
    "--theme-primary-hover": theme.primaryHover,
    "--theme-primary-deep": theme.primaryDeep,
    "--theme-soft-bg": theme.softBg,
    "--theme-accent": theme.accent,
    "--theme-secondary": theme.secondary,
    "--theme-secondary-soft": theme.secondarySoft,
    "--theme-text-primary": theme.textPrimary,
    "--theme-text-secondary": theme.textSecondary,
    "--theme-border": theme.border,
  };
}
