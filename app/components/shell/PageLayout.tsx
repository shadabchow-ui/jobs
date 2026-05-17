import type { ReactNode } from "react";

interface PageLayoutProps {
  children: ReactNode;
  title?: string;
  subtitle?: string;
  wide?: boolean;
}

export function PageLayout({ children, title, subtitle, wide }: PageLayoutProps) {
  return (
    <div className={`page-layout${wide ? " page-layout--wide" : ""}`}>
      <div className="page-layout__inner">
        {title && (
          <div className="page-layout__heading">
            <h1 className="page-layout__title">{title}</h1>
            {subtitle && <p className="page-layout__subtitle">{subtitle}</p>}
          </div>
        )}
        {children}
      </div>
    </div>
  );
}
