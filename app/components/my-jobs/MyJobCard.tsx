import { Link } from "@remix-run/react";
import type { JobFixture } from "~/types/page-model.types";
import type { SavedJobEntry } from "~/fixtures/saved-jobs.fixture";

interface MyJobCardProps {
  savedEntry: SavedJobEntry;
  job: JobFixture;
}

const STATUS_LABELS: Record<string, string> = {
  saved: "Saved",
  applied: "Applied",
  interviewing: "Interviewing",
  offered: "Offer",
  rejected: "Rejected",
  archived: "Archived",
};

export function MyJobCard({ savedEntry, job }: MyJobCardProps) {
  const state = savedEntry.savedState;
  const updatedLabel = savedEntry.updatedAt
    ? new Date(savedEntry.updatedAt).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : null;
  const savedLabel = new Date(savedEntry.savedAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <article className="my-jobs-card" aria-labelledby={`my-job-title-${job.id}`}>
      <div className="my-jobs-card__top">
        <div className="my-jobs-card__info">
          <h2 id={`my-job-title-${job.id}`} className="my-jobs-card__title">
            <Link to={`/jobs/${job.slug}`} className="my-jobs-card__title-link">
              {job.title}
            </Link>
          </h2>
          <p className="my-jobs-card__company">{job.company}</p>
          <div className="my-jobs-card__meta">
            <span>{job.location}</span>
            {job.remote && (
              <>
                <span className="my-jobs-card__meta-sep" aria-hidden="true">·</span>
                <span>Remote</span>
              </>
            )}
            {job.salaryRange && (
              <>
                <span className="my-jobs-card__meta-sep" aria-hidden="true">·</span>
                <span className="my-jobs-card__salary">{job.salaryRange}</span>
              </>
            )}
          </div>
        </div>
        <span className={`my-jobs-card__status my-jobs-card__status--${state}`}>
          {STATUS_LABELS[state] ?? state}
        </span>
      </div>

      <div className="my-jobs-card__bottom">
        <span className="my-jobs-card__date">
          {updatedLabel ? `Updated ${updatedLabel}` : `Saved ${savedLabel}`}
        </span>

        <div className="my-jobs-card__actions">
          {savedEntry.notes && (
            <span className="my-jobs-card__action-btn" role="note" tabIndex={0}>
              {savedEntry.notes.length > 40
                ? `${savedEntry.notes.slice(0, 40)}…`
                : savedEntry.notes}
            </span>
          )}
          <Link
            to={`/jobs/${job.slug}`}
            className="my-jobs-card__action-btn my-jobs-card__action-btn--primary"
          >
            View Job
          </Link>
        </div>
      </div>
    </article>
  );
}
