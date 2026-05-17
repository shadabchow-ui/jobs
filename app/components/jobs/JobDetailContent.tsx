import { Link } from "@remix-run/react";
import type { JobFixture, CompanyFixture } from "~/types/page-model.types";

interface JobDetailContentProps {
  job: JobFixture;
  company: CompanyFixture | null;
  similarJobs: Array<{
    id: string;
    slug: string;
    title: string;
    company: string;
    location: string;
  }>;
}

export function JobDetailContent({
  job,
  company,
  similarJobs,
}: JobDetailContentProps) {
  return (
    <div className="jd-content">
      <section className="jd-content__section jd-content__section--ai-summary">
        <h2 className="jd-content__section-title">AI Job Summary</h2>
        <div className="jd-content__ai-card">
          {job.aiSummary ? (
            <p className="jd-content__text">{job.aiSummary}</p>
          ) : (
            <p className="jd-content__placeholder">
              AI summary will be available when the jobs board connects to an AI
              provider. Upload your resume to see personalized insights.
            </p>
          )}
        </div>
      </section>

      <section className="jd-content__section">
        <h2 className="jd-content__section-title">Description</h2>
        <p className="jd-content__text">{job.description}</p>
      </section>

      {job.responsibilities.length > 0 && (
        <section className="jd-content__section">
          <h2 className="jd-content__section-title">Responsibilities</h2>
          <ul className="jd-content__list">
            {job.responsibilities.map((item, i) => (
              <li key={i} className="jd-content__list-item">
                {item}
              </li>
            ))}
          </ul>
        </section>
      )}

      {job.requirements.length > 0 && (
        <section className="jd-content__section">
          <h2 className="jd-content__section-title">Requirements</h2>
          <ul className="jd-content__list">
            {job.requirements.map((item, i) => (
              <li key={i} className="jd-content__list-item">
                {item}
              </li>
            ))}
          </ul>
        </section>
      )}

      {job.benefits.length > 0 && (
        <section className="jd-content__section">
          <h2 className="jd-content__section-title">Benefits</h2>
          <ul className="jd-content__list">
            {job.benefits.map((item, i) => (
              <li key={i} className="jd-content__list-item">
                {item}
              </li>
            ))}
          </ul>
        </section>
      )}

      <section className="jd-content__section jd-content__section--skills">
        <h2 className="jd-content__section-title">Skills Detected</h2>
        {job.detectedSkills && job.detectedSkills.length > 0 ? (
          <>
            <div className="jd-content__skills-list">
              {job.detectedSkills.map((skill) => (
                <span key={skill} className="jd-content__skills-tag">
                  {skill}
                </span>
              ))}
            </div>
            <p className="jd-content__skills-note">
              Skills automatically detected from the job description.
            </p>
          </>
        ) : (
          <p className="jd-content__placeholder">
            Skills detection will be available when the jobs board connects to an
            AI provider.
          </p>
        )}
      </section>

      {company && (
        <section className="jd-content__section jd-content__section--about-company">
          <h2 className="jd-content__section-title">About {company.name}</h2>
          <p className="jd-content__text">{company.description}</p>
          <div className="jd-content__company-meta">
            {company.headquarters && (
              <span className="jd-content__company-stat">
                HQ: {company.headquarters}
              </span>
            )}
            {company.employeeCount && (
              <span className="jd-content__company-stat">
                {company.employeeCount.toLocaleString()} employees
              </span>
            )}
            {company.foundedYear && (
              <span className="jd-content__company-stat">
                Founded {company.foundedYear}
              </span>
            )}
            <Link
              to={`/companies/${company.slug}`}
              className="jd-content__company-link"
            >
              View full company profile →
            </Link>
          </div>
        </section>
      )}

      {similarJobs.length > 0 && (
        <section className="jd-content__section">
          <h2 className="jd-content__section-title">Similar Jobs</h2>
          <div className="jd-content__similar-list">
            {similarJobs.map((similar) => (
              <Link
                key={similar.id}
                to={`/jobs/${similar.slug}`}
                className="jd-content__similar-card"
              >
                <h3 className="jd-content__similar-title">{similar.title}</h3>
                <p className="jd-content__similar-company">
                  {similar.company}
                </p>
                <p className="jd-content__similar-meta">{similar.location}</p>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
