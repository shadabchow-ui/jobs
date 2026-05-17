import { Link } from "@remix-run/react";
import type { JobFixture } from "~/types/page-model.types";

interface JobCardProps {
  job: JobFixture;
  isSelected?: boolean;
}

export function JobCard({ job, isSelected = false }: JobCardProps) {
  return (
    <article
      className={`job-card${isSelected ? " job-card--selected" : ""}`}
      aria-labelledby={`job-title-${job.id}`}
    >
      <header className="job-card__header">
        <h2 id={`job-title-${job.id}`} className="job-card__title">
          <Link to={`/jobs/${job.slug}`} className="job-card__title-link">
            {job.title}
          </Link>
        </h2>
        <p className="job-card__company">{job.company}</p>
      </header>

      <p className="job-card__location">
        {job.location}
        {job.remote && <span className="job-card__remote-badge">Remote</span>}
      </p>

      {job.salaryRange && (
        <p className="job-card__salary">{job.salaryRange}</p>
      )}

      <p className="job-card__description">{job.description}</p>

      {job.tags.length > 0 && (
        <ul className="job-card__tags">
          {job.tags.map((tag) => (
            <li key={tag} className="job-card__tag">
              {tag}
            </li>
          ))}
        </ul>
      )}

      <footer className="job-card__footer">
        <span className="job-card__date">
          {new Date(job.postedAt).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
          })}
        </span>
      </footer>
    </article>
  );
}
