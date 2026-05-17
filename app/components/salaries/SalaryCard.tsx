import { Link } from "@remix-run/react";
import type { SalaryTitleEntry } from "~/types/page-model.types";

function formatCurrency(amount: number, currency: string): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(amount);
}

interface SalaryCardProps {
  entry: SalaryTitleEntry;
}

export function SalaryCard({ entry }: SalaryCardProps) {
  return (
    <article className="salary-card">
      <div className="salary-card__body">
        <h3 className="salary-card__title">
          <Link to={`/salaries/${entry.titleSlug}`} className="salary-card__title-link">
            {entry.title}
          </Link>
        </h3>
        <div className="salary-card__range">
          <span className="salary-card__range-value">
            {formatCurrency(entry.minSalary, entry.currency)} –{" "}
            {formatCurrency(entry.maxSalary, entry.currency)}
          </span>
        </div>
        <div className="salary-card__meta">
          <span className="salary-card__meta-item">
            Median:{" "}
            <strong>
              {formatCurrency(entry.medianSalary, entry.currency)}
            </strong>
          </span>
          <span className="salary-card__sep" aria-hidden="true">·</span>
          <span className="salary-card__meta-item">
            {entry.dataPoints.toLocaleString()} data point{entry.dataPoints !== 1 ? "s" : ""}
          </span>
        </div>
        <div className="salary-card__footer">
          {entry.topCompany ? (
            <span className="salary-card__footer-item">
              Top: {entry.topCompany}
            </span>
          ) : null}
          {entry.topLocation ? (
            <span className="salary-card__footer-item">
              {entry.topLocation}
            </span>
          ) : null}
        </div>
      </div>
    </article>
  );
}
