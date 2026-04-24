export type NavigationItem = {
  href: string;
  label: string;
  shortLabel: string;
  icon: string;
};

export const navigationItems: NavigationItem[] = [
  {
    href: "/dashboard",
    label: "Dashboard",
    shortLabel: "Inicio",
    icon: "D",
  },
  {
    href: "/pacientes",
    label: "Pacientes",
    shortLabel: "Pacientes",
    icon: "P",
  },
  {
    href: "/sesiones/nueva",
    label: "Nueva sesión",
    shortLabel: "Sesión",
    icon: "S",
  },
  {
    href: "/historial",
    label: "Historial",
    shortLabel: "Historial",
    icon: "H",
  },
  {
    href: "/configuracion",
    label: "Configuración",
    shortLabel: "Ajustes",
    icon: "C",
  },
];
