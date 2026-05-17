import { Link } from "@remix-run/react";
import type { JobFixture } from "~/types/page-model.types";

interface JobDetailHeaderProps {
  job: JobFixture;
}

function postedAgo(postedAt: string): string {
  const diffMs = Date.now() - new Date(postedAt).getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  if (diffDays < 1) return "Today";
  if (diffDays === 1) return "1 day ago";
  if (diffDays < 30) return `${diffDays} days ago`;
  const diffMonths = Math.floor(diffDays / 30);
  if (diffMonths === 1) return "1 month ago";
  return `${diffMonths} months ago`;
}

export function JobDetailHeader({ job }: JobDetailHeaderProps) {
  return (
    <header className="jd-header">
      <h1 className="jd-header__title">{job.title}</h1>

      <div className="jd-header__meta">
        <Link to={`/companies/${job.companySlug}`}>
          {job.company}
        </Link>
        <span className="jd-header__meta-sep" aria-hidden="true">
          ·
        </span>
        <span>{job.location}</span>
      </div>

      <div className="jd-header__badges">
        {job.jobType && (
          <span className="jd-header__badge jd-header__badge--type">
            {job.jobType}
          </span>
        )}
        {job.remote && (
          <span className="jd-header__badge jd-header__badge--remote">
            Remote
          </span>
        )}
        {job.salaryRange && (
          <span className="jd-header__badge jd-header__badge--salary">
            {job.salaryRange}
          </span>
        )}
      </div>

      <p className="jd-header__posted">Posted {postedAgo(job.postedAt)}</p>
    </header>
  );
}
