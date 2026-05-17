import type { JobFixture } from "~/types/page-model.types";
import type { JobListingPageData, JobListingUrlParams } from "~/types/job.types";
import { JOBS_FIXTURES } from "~/fixtures/jobs.fixture";

const DEFAULT_PER_PAGE = 5;

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

export function loadJobListing(url: URL): JobListingPageData {
  const params = parseJobListingParams(url);

  const query = (params.q ?? "").trim();
  const location = (params.l ?? "").trim();
  const remote = params.remote ?? "";
  const salary = params.salary ?? "";
  const jobType = params.jobType ?? "";
  const experience = params.experience ?? "";
  const sort = params.sort ?? "relevance";

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
  const totalPages = Math.max(1, Math.ceil(totalJobs / DEFAULT_PER_PAGE));
  if (page > totalPages) page = totalPages;

  const start = (page - 1) * DEFAULT_PER_PAGE;
  const pagedJobs = filtered.slice(start, start + DEFAULT_PER_PAGE);

  const selectedJob = pagedJobs.length > 0 ? pagedJobs[0] : null;

  return {
    jobs: pagedJobs,
    selectedJob,
    query,
    location,
    remote,
    salary,
    jobType,
    experience,
    page,
    perPage: DEFAULT_PER_PAGE,
    totalJobs,
    totalPages,
    sort,
  };
}
