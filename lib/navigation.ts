import {
  ClipboardPlus,
  History,
  LayoutDashboard,
  Megaphone,
  MessageSquarePlus,
  Settings,
  ShieldCheck,
  Users,
  type LucideIcon,
} from "lucide-react";

export type NavigationItem = {
  href: string;
  label: string;
  shortLabel: string;
  icon: LucideIcon;
};

export const navigationItems: NavigationItem[] = [
  {
    href: "/dashboard",
    label: "Dashboard",
    shortLabel: "Inicio",
    icon: LayoutDashboard,
  },
  {
    href: "/pacientes",
    label: "Pacientes",
    shortLabel: "Pacientes",
    icon: Users,
  },
  {
    href: "/sesiones/nueva",
    label: "Nueva sesion",
    shortLabel: "Sesion",
    icon: ClipboardPlus,
  },
  {
    href: "/historial",
    label: "Historial",
    shortLabel: "Historial",
    icon: History,
  },
  {
    href: "/anuncios",
    label: "Anuncios",
    shortLabel: "Avisos",
    icon: Megaphone,
  },
  {
    href: "/sugerencias",
    label: "Sugerencias",
    shortLabel: "Ideas",
    icon: MessageSquarePlus,
  },
  {
    href: "/configuracion",
    label: "Configuracion",
    shortLabel: "Ajustes",
    icon: Settings,
  },
];

export const adminNavigationItem: NavigationItem = {
  href: "/admin",
  label: "Admin",
  shortLabel: "Admin",
  icon: ShieldCheck,
};

export const adminNavigationItems: NavigationItem[] = [
  adminNavigationItem,
  {
    href: "/sugerencias",
    label: "Sugerencias",
    shortLabel: "Ideas",
    icon: MessageSquarePlus,
  },
  {
    href: "/anuncios",
    label: "Anuncios",
    shortLabel: "Avisos",
    icon: Megaphone,
  },
  {
    href: "/configuracion",
    label: "Configuracion",
    shortLabel: "Ajustes",
    icon: Settings,
  },
];
