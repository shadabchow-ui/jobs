import type {
  Job,
  JobSearchFilters,
  JobSearchResultPageModel,
  JobDetailPageModel,
  SavedJobState,
  JobCategory,
} from "~/types/page-model.types";
import { getRichJobs } from "~/fixtures/jobs.fixture";
import { CATEGORY_FIXTURES } from "~/fixtures/categories.fixture";
import { enrichJobs, type EnrichedJob } from "~/services/ai-enrichment.server";

export function buildSearchPageModel(
  filters: JobSearchFilters,
  page: number = 1,
  pageSize: number = 20,
): JobSearchResultPageModel {
  const JOBS_FIXTURES_RICH = getRichJobs();
  let results = [...JOBS_FIXTURES_RICH];

  if (filters.query) {
    const q = filters.query.toLowerCase();
    results = results.filter(
      (j) =>
        j.title.toLowerCase().includes(q) ||
        j.company.name.toLowerCase().includes(q) ||
        j.description.toLowerCase().includes(q),
    );
  }

  if (filters.location) {
    const loc = filters.location.toLowerCase();
    results = results.filter(
      (j) =>
        j.location.city.toLowerCase().includes(loc) ||
        j.location.displayName.toLowerCase().includes(loc),
    );
  }

  if (filters.remote !== null) {
    results = results.filter((j) => j.location.remote === filters.remote);
  }

  if (filters.categories.length > 0) {
    results = results.filter((j) =>
      j.categoryIds.some((id) => filters.categories.includes(id)),
    );
  }

  if (filters.companyIds.length > 0) {
    results = results.filter((j) => filters.companyIds.includes(j.company.id));
  }

  const totalResults = results.length;
  const totalPages = Math.max(1, Math.ceil(totalResults / pageSize));
  const start = (page - 1) * pageSize;
  const pageJobs = results.slice(start, start + pageSize);

  return {
    query: filters.query,
    totalResults,
    page,
    pageSize,
    totalPages,
    jobs: pageJobs,
    facets: CATEGORY_FIXTURES,
    fallbackState: {
      isDegraded: false,
      reason: null,
      userMessage: null,
    },
  };
}

export function buildDetailPageModel(
  job: Job,
  savedState: SavedJobState | null = null,
  maxRelated: number = 4,
): JobDetailPageModel {
  const JOBS_FIXTURES_RICH = getRichJobs();
  const relatedJobs = JOBS_FIXTURES_RICH.filter(
    (j) =>
      j.id !== job.id &&
      j.categoryIds.some((id) => job.categoryIds.includes(id)),
  ).slice(0, maxRelated);

  return {
    job,
    relatedJobs,
    savedState,
  };
}

export function filterJobsByFilters(
  jobs: Job[],
  filters: Partial<JobSearchFilters>,
): Job[] {
  let filtered = [...jobs];

  if (filters.query) {
    const q = filters.query.toLowerCase();
    filtered = filtered.filter(
      (j) =>
        j.title.toLowerCase().includes(q) ||
        j.company.name.toLowerCase().includes(q) ||
        j.description.toLowerCase().includes(q),
    );
  }

  if (filters.location) {
    const loc = filters.location.toLowerCase();
    filtered = filtered.filter(
      (j) =>
        j.location.city.toLowerCase().includes(loc) ||
        j.location.displayName.toLowerCase().includes(loc),
    );
  }

  if (filters.remote !== undefined && filters.remote !== null) {
    filtered = filtered.filter((j) => j.location.remote === filters.remote);
  }

  if (filters.categories && filters.categories.length > 0) {
    filtered = filtered.filter((j) =>
      j.categoryIds.some((id) => filters.categories!.includes(id)),
    );
  }

  if (filters.companyIds && filters.companyIds.length > 0) {
    filtered = filtered.filter((j) => filters.companyIds!.includes(j.company.id));
  }

  return filtered;
}

export function getFacetCategories(): JobCategory[] {
  return CATEGORY_FIXTURES;
}

// ---------------------------------------------------------------------------
// Enriched page model builders — apply deterministic AI enrichment.
// Safe to call in any loader; never throws.
// ---------------------------------------------------------------------------

export async function buildEnrichedSearchPageModel(
  filters: JobSearchFilters,
  page: number = 1,
  pageSize: number = 20,
): Promise<{
  query: string;
  totalResults: number;
  page: number;
  pageSize: number;
  totalPages: number;
  jobs: EnrichedJob[];
  facets: JobCategory[];
  fallbackState: { isDegraded: boolean; reason: string | null; userMessage: string | null };
}> {
  const model = buildSearchPageModel(filters, page, pageSize);
  const enriched = await enrichJobs(model.jobs);
  return { ...model, jobs: enriched };
}

export async function buildEnrichedDetailPageModel(
  job: Job,
  savedState: SavedJobState | null = null,
  maxRelated: number = 4,
): Promise<{
  job: EnrichedJob;
  relatedJobs: EnrichedJob[];
  savedState: SavedJobState | null;
}> {
  const model = buildDetailPageModel(job, savedState, maxRelated);
  const [enrichedJob, enrichedRelated] = await Promise.all([
    enrichJobs([model.job]),
    enrichJobs(model.relatedJobs),
  ]);
  return {
    job: enrichedJob[0],
    relatedJobs: enrichedRelated,
    savedState: model.savedState,
  };
}
