export type NavItem = {
  href: string;
  label: string;
};

export type NavGroup = {
  label: string;
  items: NavItem[];
};

export const learningNav: NavGroup = {
  label: "Learning",
  items: [
    { href: "/", label: "Home" },
    { href: "/role", label: "Target role" },
    { href: "/gaps", label: "Skill gaps" },
    { href: "/roadmap/review", label: "Review plan" },
    { href: "/roadmap", label: "Roadmap" },
    { href: "/sessions", label: "Sessions" },
    { href: "/progress", label: "Progress" },
    { href: "/plans", label: "Plans" },
  ],
};

export const applicationsNav: NavGroup = {
  label: "Applications",
  items: [{ href: "/applications", label: "Job Applications" }],
};