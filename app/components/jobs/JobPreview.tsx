import type { JobFixture } from "~/types/page-model.types";

interface JobPreviewProps {
  job: JobFixture | null;
}

export function JobPreview({ job }: JobPreviewProps) {
  if (!job) {
    return (
      <aside className="job-preview job-preview--empty" aria-label="Job preview">
        <div className="job-preview__placeholder">
          <p>Select a job to view details</p>
        </div>
      </aside>
    );
  }

  const isAdzuna = job.source === "adzuna";
  const hasApplyUrl = !!job.applyUrl;

  return (
    <aside className="job-preview" aria-label={`Preview: ${job.title}`}>
      <header className="job-preview__header">
        <h1 className="job-preview__title">{job.title}</h1>
        <p className="job-preview__company">{job.company}</p>
        <p className="job-preview__location">
          {job.location}
          {job.remote && (
            <span className="job-preview__remote-badge">Remote</span>
          )}
        </p>
        {job.salaryRange && (
          <p className="job-preview__salary">{job.salaryRange}</p>
        )}
      </header>

      <section className="job-preview__body">
        <p className="job-preview__description">{job.description}</p>

        {job.tags.length > 0 && (
          <ul className="job-preview__tags">
            {job.tags.map((tag) => (
              <li key={tag} className="job-preview__tag">
                {tag}
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="job-preview__ai" aria-label="AI tools">
        <div className="job-preview__ai-card">
          <p className="job-preview__ai-title">AI summary available</p>
          <p className="job-preview__ai-body">
            Upload resume to see match
          </p>
        </div>
      </section>

      <footer className="job-preview__actions">
        <button className="job-preview__save-btn" type="button">
          Save Job
        </button>
        {isAdzuna && hasApplyUrl ? (
          <a
            href={job.applyUrl!}
            className="job-preview__apply-btn"
            target="_blank"
            rel="noopener noreferrer sponsored"
          >
            Apply Now
          </a>
        ) : (
          <button className="job-preview__apply-btn" type="button">
            Apply Now
          </button>
        )}
      </footer>
    </aside>
  );
}
