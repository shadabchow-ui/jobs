import type { JobFixture, Job } from "~/types/page-model.types";
import type { JobListingPageData, JobListingUrlParams } from "~/types/job.types";
import type { AdzunaEnv } from "~/services/adzuna.server";
import { JOBS_FIXTURES } from "~/fixtures/jobs.fixture";
import { fetchAdzunaJobs } from "~/services/adzuna.server";

const FIXTURE_PER_PAGE = 5;
const ADZUNA_PER_PAGE = 100;

// ---------------------------------------------------------------------------
// Adzuna Job → JobFixture adapter
// ---------------------------------------------------------------------------

function adzunaJobToFixture(job: Job): JobFixture {
  const tags: string[] = [];
  if (job.categories && job.categories.length > 0) {
    for (const cat of job.categories) {
      if (cat.name) tags.push(cat.name);
    }
  }
  if (tags.length === 0) {
    tags.push(job.source);
  }

  return {
    id: job.id,
    slug: job.slug,
    title: job.title,
    company: job.company.name,
    companySlug: job.company.slug,
    location: job.location.displayName,
    remote: job.location.remote,
    salaryRange: job.salary?.displayRange ?? null,
    postedAt: job.postedAt,
    description: job.description,
    tags,
    source: job.source,
    jobType: null,
    responsibilities: [],
    requirements: [],
    benefits: [],
    applyUrl: job.applyUrl,
    aiSummary: null,
    detectedSkills: null,
    seniority: null,
    remoteType: null,
    salaryNote: null,
    matchScore: null,
    matchedSkills: null,
    missingSkills: null,
    jobQualityScore: null,
  };
}

// ---------------------------------------------------------------------------
// Fixture-based salary range parser (unchanged)
// ---------------------------------------------------------------------------

function parseSalaryRange(range: string | null): { min: number; max: number } | null {
  if (!range) return null;
  const cleaned = range.replace(/[$,]/g, "");
  const parts = cleaned.split(/\s*-\s*/).map(Number);
  if (parts.length === 2 && !isNaN(parts[0]) && !isNaN(parts[1])) {
    return { min: parts[0], max: parts[1] };
  }
  const single = Number(cleaned);
  if (!isNaN(single)) {
    return { min: single, max: single };
  }
  return null;
}

// ---------------------------------------------------------------------------
// Fixture-based filtering helpers (unchanged)
// ---------------------------------------------------------------------------

function matchesKeyword(job: JobFixture, query: string): boolean {
  const q = query.toLowerCase();
  return (
    job.title.toLowerCase().includes(q) ||
    job.company.toLowerCase().includes(q) ||
    job.description.toLowerCase().includes(q) ||
    job.tags.some((tag) => tag.toLowerCase().includes(q))
  );
}

function matchesLocation(job: JobFixture, location: string): boolean {
  const l = location.toLowerCase();
  return job.location.toLowerCase().includes(l);
}

function matchesSalary(job: JobFixture, salaryBand: string): boolean {
  if (!salaryBand) return true;
  const parsed = parseSalaryRange(job.salaryRange);
  if (!parsed) return false;
  const bands: Record<string, { min: number; max: number }> = {
    "0-50000": { min: 0, max: 50000 },
    "50000-100000": { min: 50000, max: 100000 },
    "100000-150000": { min: 100000, max: 150000 },
    "150000-200000": { min: 150000, max: 200000 },
    "200000": { min: 200000, max: Infinity },
  };
  const band = bands[salaryBand];
  if (!band) return true;
  return parsed.min >= band.min && parsed.min <= band.max;
}

function sortJobs(jobs: JobFixture[], sort: string): JobFixture[] {
  const sorted = [...jobs];
  switch (sort) {
    case "date":
      return sorted.sort(
        (a, b) => new Date(b.postedAt).getTime() - new Date(a.postedAt).getTime(),
      );
    case "salary": {
      return sorted.sort((a, b) => {
        const sa = parseSalaryRange(a.salaryRange);
        const sb = parseSalaryRange(b.salaryRange);
        if (!sa && !sb) return 0;
        if (!sa) return 1;
        if (!sb) return -1;
        return sb.max - sa.max;
      });
    }
    case "relevance":
    default:
      return sorted;
  }
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

export function parseJobListingParams(url: URL): JobListingUrlParams {
  return {
    q: url.searchParams.get("q"),
    l: url.searchParams.get("l"),
    remote: url.searchParams.get("remote"),
    salary: url.searchParams.get("salary"),
    jobType: url.searchParams.get("jobType"),
    experience: url.searchParams.get("experience"),
    page: url.searchParams.get("page"),
    sort: url.searchParams.get("sort"),
  };
}

/**
 * Load job listing — tries Adzuna first, falls back to local fixtures.
 * Safe to call in any loader; never throws.
 *
 * @param env  Optional Cloudflare env (from context.cloudflare.env) for Adzuna credentials.
 */
export async function loadJobListing(
  url: URL,
  env?: AdzunaEnv,
): Promise<JobListingPageData> {
  const params = parseJobListingParams(url);
  const query = (params.q ?? "").trim();
  const location = (params.l ?? "").trim();
  const sort = params.sort ?? "relevance";

  const liveResult = await tryAdzuna(query, location, params, env);

  if (liveResult && liveResult.jobs.length > 0) {
    const page = parseInt(params.page ?? "1", 10);
    return buildAdzunaResult(liveResult.jobs, {
      query,
      location,
      sort,
      page: isNaN(page) || page < 1 ? 1 : page,
      count: liveResult.count,
    });
  }

  return buildFixtureResult(url, { query, location, sort });
}

// ---------------------------------------------------------------------------
// Adzuna path
// ---------------------------------------------------------------------------

async function tryAdzuna(
  query: string,
  location: string,
  params: JobListingUrlParams,
  env?: AdzunaEnv,
): Promise<{ jobs: JobFixture[]; count: number } | null> {
  const page = parseInt(params.page ?? "1", 10);
  const result = await fetchAdzunaJobs({
    keyword: query || undefined,
    location: location || undefined,
    page: isNaN(page) || page < 1 ? 1 : page,
    resultsPerPage: ADZUNA_PER_PAGE,
  }, env);

  if (!result) return null;
  return {
    jobs: result.jobs.map(adzunaJobToFixture),
    count: result.count,
  };
}

function buildAdzunaResult(
  jobs: JobFixture[],
  meta: { query: string; location: string; sort: string; page: number; count: number },
): JobListingPageData {
  const totalPages = Math.max(1, Math.ceil(meta.count / ADZUNA_PER_PAGE));
  return {
    jobs,
    selectedJob: jobs.length > 0 ? jobs[0] : null,
    query: meta.query,
    location: meta.location,
    remote: "",
    salary: "",
    jobType: "",
    experience: "",
    page: meta.page,
    perPage: ADZUNA_PER_PAGE,
    totalJobs: meta.count,
    totalPages,
    sort: meta.sort,
    source: "adzuna",
    displayLabel: "Showing live jobs",
  };
}

// ---------------------------------------------------------------------------
// Fixture fallback path (preserves existing filtering logic)
// ---------------------------------------------------------------------------

function buildFixtureResult(
  url: URL,
  meta: { query: string; location: string; sort: string },
): JobListingPageData {
  const params = parseJobListingParams(url);

  const query = meta.query;
  const location = meta.location;
  const remote = params.remote ?? "";
  const salary = params.salary ?? "";
  const jobType = params.jobType ?? "";
  const experience = params.experience ?? "";
  const sort = meta.sort;

  let page = parseInt(params.page ?? "1", 10);
  if (isNaN(page) || page < 1) page = 1;

  let filtered = [...JOBS_FIXTURES];

  if (query) {
    filtered = filtered.filter((j) => matchesKeyword(j, query));
  }

  if (location) {
    filtered = filtered.filter((j) => matchesLocation(j, location));
  }

  if (remote === "1") {
    filtered = filtered.filter((j) => j.remote);
  }

  if (jobType) {
    filtered = filtered.filter((j) => {
      if (!j.jobType) return false;
      return j.jobType.toLowerCase() === jobType.toLowerCase();
    });
  }

  if (salary) {
    filtered = filtered.filter((j) => matchesSalary(j, salary));
  }

  filtered = sortJobs(filtered, sort);

  const totalJobs = filtered.length;
  const totalPages = Math.max(1, Math.ceil(totalJobs / FIXTURE_PER_PAGE));
  if (page > totalPages) page = totalPages;

  const start = (page - 1) * FIXTURE_PER_PAGE;
  const pagedJobs = filtered.slice(start, start + FIXTURE_PER_PAGE);

  return {
    jobs: pagedJobs,
    selectedJob: pagedJobs.length > 0 ? pagedJobs[0] : null,
    query,
    location,
    remote,
    salary,
    jobType,
    experience,
    page,
    perPage: FIXTURE_PER_PAGE,
    totalJobs,
    totalPages,
    sort,
    source: "fixture",
    displayLabel: "Showing sample jobs",
  };
}
