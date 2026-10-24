export type NavItem = {
  href: string;
  label: string;
};

export type NavGroup = {
  label: string;
  items: NavItem[];
};

export const nav: NavGroup[] = [
  {
    label: "Learning",
    items: [
      { href: "/", label: "Home" },
      { href: "/role", label: "Target role" },
      { href: "/gaps", label: "Skill gaps" },
      { href: "/roadmap", label: "Roadmap" },
      { href: "/sessions", label: "Sessions" },
      { href: "/progress", label: "Progress" },
    ],
  },
  {
    label: "Your plans",
    items: [
      { href: "/roadmap/review", label: "Review plan" },
      { href: "/plans", label: "Plans" },
    ]
  }
];