import { Link } from "@remix-run/react";

const FOOTER_SECTIONS = [
  {
    title: "Job Seekers",
    links: [
      { label: "Find Jobs", to: "/jobs" },
      { label: "Companies", to: "/companies" },
      { label: "Salaries", to: "/salaries" },
      { label: "AI Career Tools", to: "/ai-career-tools" },
    ],
  },
  {
    title: "Employers",
    links: [
      { label: "Post a Job", to: "/employers" },
      { label: "Employer Account", to: "/employers" },
    ],
  },
  {
    title: "Help",
    links: [
      { label: "Help Center", to: "/help" },
      { label: "Contact Us", to: "/contact" },
      { label: "About", to: "/about" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy Policy", to: "/privacy" },
      { label: "Terms of Service", to: "/terms" },
      { label: "Cookie Policy", to: "/cookies" },
    ],
  },
] as const;

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="site-footer">
      <div className="site-footer__inner">
        <div className="site-footer__sections">
          {FOOTER_SECTIONS.map((section) => (
            <div key={section.title} className="site-footer__section">
              <h3 className="site-footer__section-title">{section.title}</h3>
              <ul className="site-footer__section-links">
                {section.links.map((link) => (
                  <li key={link.to}>
                    <Link to={link.to} className="site-footer__section-link">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <p className="site-footer__copyright">&copy; {year} Jobs Board. All rights reserved.</p>
      </div>
    </footer>
  );
}
