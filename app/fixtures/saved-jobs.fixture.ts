import type { SavedJobState } from "~/types/page-model.types";

export interface SavedJobEntry {
  userId: string;
  jobId: string;
  jobSlug: string;
  savedState: SavedJobState;
  savedAt: string;
  updatedAt: string | null;
  notes: string | null;
}

export const SAVED_JOB_FIXTURES: SavedJobEntry[] = [
  {
    userId: "user-001",
    jobId: "job-001",
    jobSlug: "senior-frontend-engineer-acme-corp",
    savedState: "saved",
    savedAt: "2026-05-11T10:00:00Z",
    updatedAt: null,
    notes: null,
  },
  {
    userId: "user-001",
    jobId: "job-003",
    jobSlug: "data-scientist-ml-datapulse",
    savedState: "applied",
    savedAt: "2026-05-12T14:00:00Z",
    updatedAt: "2026-05-13T09:00:00Z",
    notes: "Applied via company website. Follow up in 2 weeks.",
  },
  {
    userId: "user-001",
    jobId: "job-010",
    jobSlug: "ml-researcher-pioneer-ml",
    savedState: "interviewing",
    savedAt: "2026-05-10T08:00:00Z",
    updatedAt: "2026-05-15T16:00:00Z",
    notes: "Phone screen completed. On-site scheduled for next week.",
  },
  {
    userId: "user-001",
    jobId: "job-020",
    jobSlug: "ml-engineer-pioneer-ml",
    savedState: "saved",
    savedAt: "2026-05-14T11:00:00Z",
    updatedAt: null,
    notes: null,
  },
  {
    userId: "user-001",
    jobId: "job-008",
    jobSlug: "security-engineer-vertex-security",
    savedState: "archived",
    savedAt: "2026-04-20T09:00:00Z",
    updatedAt: "2026-05-01T12:00:00Z",
    notes: "Decided to focus on ML roles instead.",
  },
  {
    userId: "user-002",
    jobId: "job-005",
    jobSlug: "devops-engineer-cloudscale",
    savedState: "saved",
    savedAt: "2026-05-15T15:00:00Z",
    updatedAt: null,
    notes: null,
  },
  {
    userId: "user-002",
    jobId: "job-025",
    jobSlug: "sre-cloudscale",
    savedState: "applied",
    savedAt: "2026-05-12T10:00:00Z",
    updatedAt: "2026-05-13T08:00:00Z",
    notes: "Application submitted via LinkedIn.",
  },
  {
    userId: "user-002",
    jobId: "job-015",
    jobSlug: "cloud-architect-cloudscale",
    savedState: "offered",
    savedAt: "2026-04-25T09:00:00Z",
    updatedAt: "2026-05-14T11:00:00Z",
    notes: "Received offer letter. Reviewing terms.",
  },
  {
    userId: "user-003",
    jobId: "job-002",
    jobSlug: "product-manager-growth-globaltech",
    savedState: "rejected",
    savedAt: "2026-05-08T08:00:00Z",
    updatedAt: "2026-05-20T10:00:00Z",
    notes: "Rejected after final round. Got good feedback.",
  },
  {
    userId: "user-003",
    jobId: "job-021",
    jobSlug: "engineering-manager-acme-corp",
    savedState: "saved",
    savedAt: "2026-05-16T11:00:00Z",
    updatedAt: null,
    notes: null,
  },
];

export const SAVED_STATE_VALUES: SavedJobState[] = [
  "saved",
  "applied",
  "interviewing",
  "offered",
  "rejected",
  "archived",
];

export function getSavedJobsForUser(userId: string): SavedJobEntry[] {
  return SAVED_JOB_FIXTURES.filter((s) => s.userId === userId);
}

export function filterSavedJobsByState(
  entries: SavedJobEntry[],
  states: SavedJobState[],
): SavedJobEntry[] {
  return entries.filter((e) => states.includes(e.savedState));
}

export function validateSavedJobEntry(entry: SavedJobEntry): string[] {
  const errors: string[] = [];
  if (!entry.userId) errors.push("SavedJobEntry missing userId");
  if (!entry.jobId) errors.push("SavedJobEntry missing jobId");
  if (!entry.jobSlug) errors.push("SavedJobEntry missing jobSlug");
  if (!SAVED_STATE_VALUES.includes(entry.savedState)) {
    errors.push(`SavedJobEntry invalid savedState: ${entry.savedState}`);
  }
  return errors;
}
