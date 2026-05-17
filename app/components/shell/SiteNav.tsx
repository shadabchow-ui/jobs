import { Link } from "@remix-run/react";

const NAV_ITEMS = [
  { label: "Home", href: "/" },
  { label: "Find Jobs", href: "/jobs" },
  { label: "Companies", href: "/companies" },
  { label: "Salaries", href: "/salaries" },
  { label: "AI Career Tools", href: "/ai-career-tools" },
  { label: "My Jobs", href: "/my-jobs" },
  { label: "Profile", href: "/profile" },
] as const;

export function SiteNav() {
  return (
    <nav className="site-nav" aria-label="Main navigation">
      <div className="site-nav__inner">
        <ul className="site-nav__list">
          {NAV_ITEMS.map((item) => (
            <li key={item.href} className="site-nav__item">
              <Link to={item.href} className="site-nav__link">
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
