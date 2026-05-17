import type { JobFixture } from "~/types/page-model.types";
import { JobDetailHeader } from "./JobDetailHeader";
import { JobDetailContent } from "./JobDetailContent";

interface JobDetailPanelProps {
  job: JobFixture | null;
}

export function JobDetailPanel({ job }: JobDetailPanelProps) {
  if (!job) {
    return (
      <aside
        className="jd-panel jd-panel--empty"
        aria-label="Job detail panel"
      >
        <div className="jd-panel__placeholder">
          <p className="jd-panel__placeholder-text">
            Select a job to view details
          </p>
        </div>
      </aside>
    );
  }

  return (
    <aside className="jd-panel" aria-label={`Job detail: ${job.title}`}>
      <div className="jd-panel__inner">
        <JobDetailHeader job={job} />
        <JobDetailContent job={job} company={null} similarJobs={[]} />
      </div>
    </aside>
  );
}
