// src/lib/constants.ts
export const DISCIPLINES = [
  { value: "desain", label: "Desain" },
  { value: "ilustrasi", label: "Ilustrasi" },
  { value: "fotografi", label: "Fotografi" },
  { value: "seni", label: "Seni rupa" },
] as const;

export type Discipline = (typeof DISCIPLINES)[number]["value"];

export function isDiscipline(value: string | undefined): value is Discipline {
  return DISCIPLINES.some((d) => d.value === value);
}

export const NAV_ITEMS = [
  { href: "/", label: "Galeri", icon: "home" },
  { href: "/explore", label: "Eksplorasi", icon: "search" },
  { href: "/studio/projects/new", label: "Buat", icon: "plus" },
  { href: "/masuk", label: "Profil", icon: "user" },
] as const;