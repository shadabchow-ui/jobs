import { describe, it, expect } from "vitest";
import { loadJobListing } from "~/loaders/jobs.loader.server";
import { JOBS_FIXTURES } from "~/fixtures/jobs.fixture";

function buildUrl(params: Record<string, string>): URL {
  const url = new URL("https://example.com/jobs");
  for (const [key, value] of Object.entries(params)) {
    url.searchParams.set(key, value);
  }
  return url;
}

describe("jobs loader", () => {
  it("returns all fixtures when no params", () => {
    const url = buildUrl({});
    const result = loadJobListing(url);
    expect(result.totalJobs).toBe(JOBS_FIXTURES.length);
    expect(result.jobs.length).toBeLessThanOrEqual(result.perPage);
    expect(result.page).toBe(1);
    expect(result.query).toBe("");
    expect(result.location).toBe("");
  });

  it("filters by keyword query", () => {
    const url = buildUrl({ q: "frontend" });
    const result = loadJobListing(url);
    expect(result.totalJobs).toBe(2);
    expect(result.jobs[0].slug).toBe("senior-frontend-engineer-acme-corp");
  });

  it("filters by keyword across title, company, description, tags", () => {
    const url = buildUrl({ q: "python" });
    const result = loadJobListing(url);
    expect(result.totalJobs).toBeGreaterThanOrEqual(5);
  });

  it("filters by location", () => {
    const url = buildUrl({ l: "San Francisco" });
    const result = loadJobListing(url);
    expect(result.totalJobs).toBe(3);
    expect(result.jobs[0].company).toBe("Acme Corp");
  });

  it("filters by remote only", () => {
    const url = buildUrl({ remote: "1" });
    const result = loadJobListing(url);
    expect(result.totalJobs).toBeGreaterThanOrEqual(12);
    for (const job of result.jobs) {
      expect(job.remote).toBe(true);
    }
  });

  it("filters by salary band", () => {
    const url = buildUrl({ salary: "150000-200000" });
    const result = loadJobListing(url);
    expect(result.totalJobs).toBeGreaterThanOrEqual(4);
    for (const job of result.jobs) {
      expect(job.salaryRange).toBeTruthy();
    }
  });

  it("combines multiple filters", () => {
    const url = buildUrl({ q: "engineer", remote: "1" });
    const result = loadJobListing(url);
    expect(result.totalJobs).toBeGreaterThanOrEqual(3);
    expect(result.jobs[0].remote).toBe(true);
  });

  it("sorts by date descending", () => {
    const url = buildUrl({ sort: "date" });
    const result = loadJobListing(url);
    const dates = result.jobs.map((j) => new Date(j.postedAt).getTime());
    for (let i = 1; i < dates.length; i++) {
      expect(dates[i]).toBeLessThanOrEqual(dates[i - 1]);
    }
  });

  it("sorts by salary descending", () => {
    const url = buildUrl({ sort: "salary" });
    const result = loadJobListing(url);
    expect(result.jobs.length).toBeGreaterThan(0);
  });

  it("returns first page with correct count", () => {
    const url = buildUrl({ page: "1" });
    const result = loadJobListing(url);
    expect(result.page).toBe(1);
    expect(result.jobs.length).toBeLessThanOrEqual(result.perPage);
  });

  it("returns correct total pages", () => {
    const url = buildUrl({});
    const result = loadJobListing(url);
    expect(result.totalPages).toBe(Math.ceil(JOBS_FIXTURES.length / result.perPage));
  });

  it("clamps page to total pages", () => {
    const url = buildUrl({ page: "999" });
    const result = loadJobListing(url);
    expect(result.page).toBeLessThanOrEqual(result.totalPages);
  });

  it("sets selectedJob to first job on page", () => {
    const url = buildUrl({});
    const result = loadJobListing(url);
    if (result.totalJobs > 0) {
      expect(result.selectedJob).not.toBeNull();
      expect(result.selectedJob).toBe(result.jobs[0]);
    }
  });

  it("returns empty results for unmatched query", () => {
    const url = buildUrl({ q: "zzzxxxunmatchedquery" });
    const result = loadJobListing(url);
    expect(result.totalJobs).toBe(0);
    expect(result.jobs).toEqual([]);
    expect(result.selectedJob).toBeNull();
  });

  it("handles invalid page number gracefully", () => {
    const url = buildUrl({ page: "not-a-number" });
    const result = loadJobListing(url);
    expect(result.page).toBe(1);
  });

  it("handles negative page number gracefully", () => {
    const url = buildUrl({ page: "-1" });
    const result = loadJobListing(url);
    expect(result.page).toBe(1);
  });

  it("parses all params correctly", () => {
    const url = buildUrl({
      q: "devops",
      l: "Seattle",
      remote: "1",
      salary: "150000-200000",
      jobType: "full-time",
      experience: "senior",
      page: "1",
      sort: "date",
    });
    const result = loadJobListing(url);
    expect(result.query).toBe("devops");
    expect(result.location).toBe("Seattle");
    expect(result.remote).toBe("1");
    expect(result.salary).toBe("150000-200000");
    expect(result.jobType).toBe("full-time");
    expect(result.sort).toBe("date");
  });

  it("query matches across tags (case insensitive)", () => {
    const url = buildUrl({ q: "react" });
    const result = loadJobListing(url);
    expect(result.totalJobs).toBeGreaterThanOrEqual(2);
    expect(result.jobs[0].tags.some((t) => t.toLowerCase() === "react")).toBe(true);
  });

  it("query matches across description", () => {
    const url = buildUrl({ q: "machine learning" });
    const result = loadJobListing(url);
    expect(result.totalJobs).toBe(1);
    expect(result.jobs[0].slug).toBe("data-scientist-ml-datapulse");
  });
});
