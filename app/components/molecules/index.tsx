import type { ReactNode } from "react";

interface BadgeProps {
  children: ReactNode;
  variant?: "default" | "success" | "warning";
}

export function Badge({ children, variant = "default" }: BadgeProps) {
  const classNames = [`badge`, variant !== "default" ? `badge--${variant}` : ""]
    .filter(Boolean)
    .join(" ");

  return <span className={classNames}>{children}</span>;
}
