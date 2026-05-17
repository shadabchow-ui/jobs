import type { CompanyFixture, JobFixture } from "~/types/page-model.types";
import { Link } from "@remix-run/react";

interface CompanyProfileContentProps {
  company: CompanyFixture;
  jobs: JobFixture[];
  salaryRoles: { title: string; medianSalary: number; currency: string }[];
  similarCompanies: CompanyFixture[];
}

export function CompanyProfileContent({
  company,
  jobs,
  salaryRoles,
  similarCompanies,
}: CompanyProfileContentProps) {
  return (
    <div className="company-profile">
      <section className="company-profile__section">
        <h2 className="company-profile__section-title">Overview</h2>
        <p className="company-profile__description">{company.description}</p>
      </section>

      <section className="company-profile__section">
        <h2 className="company-profile__section-title">Ratings & Reviews</h2>
        <div className="company-profile__rating-card">
          {company.rating != null ? (
            <>
              <p className="company-profile__rating-value">
                {company.rating.toFixed(1)}
                <span className="company-profile__rating-max"> / 5</span>
              </p>
              <p className="company-profile__rating-sub">
                Based on {company.reviewCount?.toLocaleString() ?? 0} reviews
              </p>
              <p className="company-profile__placeholder-note">
                Detailed review breakdowns and employee testimonials coming soon.
              </p>
            </>
          ) : (
            <p className="company-profile__placeholder-note">
              Ratings and reviews are not yet available for this company.
            </p>
          )}
        </div>
      </section>

      <section className="company-profile__section">
        <h2 className="company-profile__section-title">AI Company Snapshot</h2>
        <div className="company-profile__ai-card">
          <p className="company-profile__placeholder-note">
            AI-powered company analysis including culture insights, interview tips, and competitive positioning will appear here.
          </p>
        </div>
      </section>

      {jobs.length > 0 && (
        <section className="company-profile__section">
          <h2 className="company-profile__section-title">
            Open Jobs at {company.name}
          </h2>
          <div className="company-profile__jobs">
            {jobs.map((job) => (
              <Link
                key={job.id}
                to={`/jobs/${job.slug}`}
                className="company-profile__job-card"
              >
                <h3 className="company-profile__job-title">{job.title}</h3>
                <p className="company-profile__job-meta">
                  {job.location}
                  {job.remote && <span className="company-profile__remote-badge">Remote</span>}
                  {job.salaryRange && <> · {job.salaryRange}</>}
                </p>
                <p className="company-profile__job-desc">{job.description}</p>
              </Link>
            ))}
          </div>
        </section>
      )}

      {salaryRoles.length > 0 && (
        <section className="company-profile__section">
          <h2 className="company-profile__section-title">Salary Insights</h2>
          <div className="company-profile__salary-list">
            {salaryRoles.map((role) => (
              <div key={role.title} className="company-profile__salary-item">
                <span className="company-profile__salary-role">{role.title}</span>
                <span className="company-profile__salary-value">
                  {new Intl.NumberFormat("en-US", {
                    style: "currency",
                    currency: role.currency,
                    maximumFractionDigits: 0,
                  }).format(role.medianSalary)}{" "}
                  <span className="company-profile__salary-label">median</span>
                </span>
              </div>
            ))}
          </div>
          <Link to="/salaries" className="company-profile__salary-link">
            View all salary data →
          </Link>
        </section>
      )}

      {similarCompanies.length > 0 && (
        <section className="company-profile__section">
          <h2 className="company-profile__section-title">Similar Companies</h2>
          <div className="company-profile__similar">
            {similarCompanies.map((similar) => (
              <Link
                key={similar.id}
                to={`/companies/${similar.slug}`}
                className="company-profile__similar-card"
              >
                <span className="company-profile__similar-name">{similar.name}</span>
                <span className="company-profile__similar-industry">
                  {similar.industry}
                </span>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
