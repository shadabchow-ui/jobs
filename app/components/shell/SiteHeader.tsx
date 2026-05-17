import { Link } from "@remix-run/react";

interface SiteHeaderProps {
  currentUrl: string;
}

export function SiteHeader({ currentUrl }: SiteHeaderProps) {
  const profileActive = currentUrl.includes("/profile");
  const employersActive = currentUrl.includes("/employers");

  return (
    <header className="site-header">
      <div className="site-header__inner">
        <Link to="/" className="site-header__logo" aria-label="Jobs Board — Home">
          <span className="site-header__logo-text">Jobs Board</span>
        </Link>

        <nav className="site-header__actions" aria-label="Account">
          <Link
            to="/profile"
            className={`site-header__link${profileActive ? " site-header__link--active" : ""}`}
          >
            Sign In
          </Link>
          <Link
            to="/employers"
            className={`site-header__link site-header__link--employer${
              employersActive ? " site-header__link--active" : ""
            }`}
          >
            Employers / Post Job
          </Link>
        </nav>
      </div>
    </header>
  );
}
