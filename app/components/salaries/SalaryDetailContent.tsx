import { Link } from "@remix-run/react";
import type {
  SalaryDetailLocationEntry,
  SalaryDetailCompanyEntry,
  SalaryTitleEntry,
} from "~/types/page-model.types";

function formatCurrency(amount: number, currency: string): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(amount);
}

interface SalaryDetailContentProps {
  byLocation: SalaryDetailLocationEntry[];
  byCompany: SalaryDetailCompanyEntry[];
  relatedTitles: SalaryTitleEntry[];
}

export function SalaryDetailContent({
  byLocation,
  byCompany,
  relatedTitles,
}: SalaryDetailContentProps) {
  return (
    <div className="salary-detail-content">
      {byLocation.length > 0 && (
        <section className="salary-detail-section">
          <h2 className="salary-detail-section__title">By Location</h2>
          <div className="salary-detail-section__table">
            <div className="salary-detail-section__table-header">
              <span className="salary-detail-section__th">Location</span>
              <span className="salary-detail-section__th salary-detail-section__th--numeric">
                Median
              </span>
              <span className="salary-detail-section__th salary-detail-section__th--numeric">
                Range
              </span>
              <span className="salary-detail-section__th salary-detail-section__th--numeric">
                Data Points
              </span>
            </div>
            {byLocation.map((loc, i) => (
              <div key={i} className="salary-detail-section__row">
                <span className="salary-detail-section__cell">{loc.location}</span>
                <span className="salary-detail-section__cell salary-detail-section__cell--numeric">
                  {formatCurrency(loc.medianSalary, "USD")}
                </span>
                <span className="salary-detail-section__cell salary-detail-section__cell--numeric">
                  {formatCurrency(loc.minSalary, "USD")} –{" "}
                  {formatCurrency(loc.maxSalary, "USD")}
                </span>
                <span className="salary-detail-section__cell salary-detail-section__cell--numeric">
                  {loc.dataPoints.toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        </section>
      )}

      {byCompany.length > 0 && (
        <section className="salary-detail-section">
          <h2 className="salary-detail-section__title">By Company</h2>
          <div className="salary-detail-section__table">
            <div className="salary-detail-section__table-header">
              <span className="salary-detail-section__th">Company</span>
              <span className="salary-detail-section__th salary-detail-section__th--numeric">
                Median
              </span>
              <span className="salary-detail-section__th salary-detail-section__th--numeric">
                Range
              </span>
              <span className="salary-detail-section__th salary-detail-section__th--numeric">
                Data Points
              </span>
            </div>
            {byCompany.map((comp, i) => (
              <div key={i} className="salary-detail-section__row">
                <span className="salary-detail-section__cell">{comp.company}</span>
                <span className="salary-detail-section__cell salary-detail-section__cell--numeric">
                  {formatCurrency(comp.medianSalary, "USD")}
                </span>
                <span className="salary-detail-section__cell salary-detail-section__cell--numeric">
                  {formatCurrency(comp.minSalary, "USD")} –{" "}
                  {formatCurrency(comp.maxSalary, "USD")}
                </span>
                <span className="salary-detail-section__cell salary-detail-section__cell--numeric">
                  {comp.dataPoints.toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        </section>
      )}

      {relatedTitles.length > 0 && (
        <section className="salary-detail-section">
          <h2 className="salary-detail-section__title">Related Roles</h2>
          <div className="salary-detail-section__grid">
            {relatedTitles.map((t) => (
              <Link
                key={t.titleSlug}
                to={`/salaries/${t.titleSlug}`}
                className="salary-detail-section__card"
              >
                <span className="salary-detail-section__card-title">{t.title}</span>
                <span className="salary-detail-section__card-range">
                  {formatCurrency(t.medianSalary, t.currency)} median
                </span>
              </Link>
            ))}
          </div>
        </section>
      )}

      <section className="salary-detail-section salary-detail-section--muted">
        <h2 className="salary-detail-section__title">AI-Powered Insights</h2>
        <p className="salary-detail-section__placeholder">
          Future: AI-generated compensation analysis, market trends, and salary
          negotiation tips will appear here.
        </p>
        <p className="salary-detail-section__placeholder-note">
          Salary data shown is based on sample estimates and may not reflect
          current market rates.
        </p>
      </section>
    </div>
  );
}
