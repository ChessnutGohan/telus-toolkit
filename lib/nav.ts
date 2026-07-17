import type { DictKey } from "./i18n";

export type NavItem = {
  href: string;
  labelKey: DictKey;
  code: string;
  ready: boolean;
};

export const navItems: NavItem[] = [
  { href: "/", labelKey: "navHome", code: "00", ready: true },
  { href: "/vocabulaire", labelKey: "navVocabulaire", code: "01", ready: true },
  { href: "/script", labelKey: "navScript", code: "02", ready: false },
  { href: "/smart-script", labelKey: "navSmartScript", code: "03", ready: false },
  { href: "/technologies", labelKey: "navTechnologies", code: "04", ready: false },
  { href: "/provinces", labelKey: "navProvinces", code: "05", ready: false },
  { href: "/code-postal", labelKey: "navCodePostal", code: "06", ready: false },
  { href: "/dictee", labelKey: "navDictee", code: "07", ready: false },
];
