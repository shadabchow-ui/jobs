import { Link, useLocation } from "@remix-run/react";
import type { ReactNode } from "react";

interface AccountPageLayoutProps {
  children: ReactNode;
  title?: string;
}

const ACCOUNT_NAV = [
  { to: "/my-jobs", label: "My Jobs" },
  { to: "/profile", label: "Profile" },
  { to: "/ai-career-tools", label: "AI Career Tools" },
];

const ACCOUNT_SUPPORT = [
  { to: "/help", label: "Help & Support" },
  { to: "/contact", label: "Contact Us" },
  { to: "/privacy", label: "Privacy Notice" },
];

export function AccountPageLayout({ children, title }: AccountPageLayoutProps) {
  const { pathname } = useLocation();

  return (
    <div className="account-layout">
      <div className="account-layout__inner">
        <aside className="account-layout__sidebar">
          <p className="account-layout__sidebar-heading">My Account</p>

          <ul className="account-layout__nav-list">
            {ACCOUNT_NAV.map(({ to, label }) => (
              <li key={to}>
                <Link
                  to={to}
                  className={`account-layout__nav-link${
                    pathname === to ? " account-layout__nav-link--active" : ""
                  }`}
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>

          <div className="account-layout__sidebar-divider" />

          <p className="account-layout__sidebar-subheading">Support</p>
          <ul className="account-layout__nav-list">
            {ACCOUNT_SUPPORT.map(({ to, label }) => (
              <li key={to}>
                <Link
                  to={to}
                  className={`account-layout__nav-link${
                    pathname === to ? " account-layout__nav-link--active" : ""
                  }`}
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </aside>

        <main className="account-layout__content">
          {title && <h1 className="account-layout__page-title">{title}</h1>}
          {children}
        </main>
      </div>
    </div>
  );
}
