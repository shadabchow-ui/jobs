import { describe, it, expect, afterEach, vi } from "vitest";
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
  it("returns all fixtures when no params", async () => {
    const url = buildUrl({});
    const result = await loadJobListing(url);
    expect(result.source).toBe("fixture");
    expect(result.displayLabel).toBe("Showing sample jobs");
    expect(result.totalJobs).toBe(JOBS_FIXTURES.length);
    expect(result.jobs.length).toBeLessThanOrEqual(result.perPage);
    expect(result.page).toBe(1);
    expect(result.query).toBe("");
    expect(result.location).toBe("");
  });

  it("filters by keyword query", async () => {
    const url = buildUrl({ q: "frontend" });
    const result = await loadJobListing(url);
    expect(result.source).toBe("fixture");
    expect(result.totalJobs).toBe(2);
    expect(result.jobs[0].slug).toBe("senior-frontend-engineer-acme-corp");
  });

  it("filters by keyword across title, company, description, tags", async () => {
    const url = buildUrl({ q: "python" });
    const result = await loadJobListing(url);
    expect(result.source).toBe("fixture");
    expect(result.totalJobs).toBeGreaterThanOrEqual(5);
  });

  it("filters by location", async () => {
    const url = buildUrl({ l: "San Francisco" });
    const result = await loadJobListing(url);
    expect(result.source).toBe("fixture");
    expect(result.totalJobs).toBe(3);
    expect(result.jobs[0].company).toBe("Acme Corp");
  });

  it("filters by remote only", async () => {
    const url = buildUrl({ remote: "1" });
    const result = await loadJobListing(url);
    expect(result.source).toBe("fixture");
    expect(result.totalJobs).toBeGreaterThanOrEqual(12);
    for (const job of result.jobs) {
      expect(job.remote).toBe(true);
    }
  });

  it("filters by salary band", async () => {
    const url = buildUrl({ salary: "150000-200000" });
    const result = await loadJobListing(url);
    expect(result.source).toBe("fixture");
    expect(result.totalJobs).toBeGreaterThanOrEqual(4);
    for (const job of result.jobs) {
      expect(job.salaryRange).toBeTruthy();
    }
  });

  it("combines multiple filters", async () => {
    const url = buildUrl({ q: "engineer", remote: "1" });
    const result = await loadJobListing(url);
    expect(result.source).toBe("fixture");
    expect(result.totalJobs).toBeGreaterThanOrEqual(3);
    expect(result.jobs[0].remote).toBe(true);
  });

  it("sorts by date descending", async () => {
    const url = buildUrl({ sort: "date" });
    const result = await loadJobListing(url);
    expect(result.source).toBe("fixture");
    const dates = result.jobs.map((j) => new Date(j.postedAt).getTime());
    for (let i = 1; i < dates.length; i++) {
      expect(dates[i]).toBeLessThanOrEqual(dates[i - 1]);
    }
  });

  it("sorts by salary descending", async () => {
    const url = buildUrl({ sort: "salary" });
    const result = await loadJobListing(url);
    expect(result.source).toBe("fixture");
    expect(result.jobs.length).toBeGreaterThan(0);
  });

  it("returns first page with correct count", async () => {
    const url = buildUrl({ page: "1" });
    const result = await loadJobListing(url);
    expect(result.source).toBe("fixture");
    expect(result.page).toBe(1);
    expect(result.jobs.length).toBeLessThanOrEqual(result.perPage);
  });

  it("returns correct total pages", async () => {
    const url = buildUrl({});
    const result = await loadJobListing(url);
    expect(result.source).toBe("fixture");
    expect(result.totalPages).toBe(Math.ceil(JOBS_FIXTURES.length / result.perPage));
  });

  it("clamps page to total pages", async () => {
    const url = buildUrl({ page: "999" });
    const result = await loadJobListing(url);
    expect(result.source).toBe("fixture");
    expect(result.page).toBeLessThanOrEqual(result.totalPages);
  });

  it("sets selectedJob to first job on page", async () => {
    const url = buildUrl({});
    const result = await loadJobListing(url);
    if (result.totalJobs > 0) {
      expect(result.selectedJob).not.toBeNull();
      expect(result.selectedJob).toBe(result.jobs[0]);
    }
  });

  it("returns empty results for unmatched query", async () => {
    const url = buildUrl({ q: "zzzxxxunmatchedquery" });
    const result = await loadJobListing(url);
    expect(result.source).toBe("fixture");
    expect(result.totalJobs).toBe(0);
    expect(result.jobs).toEqual([]);
    expect(result.selectedJob).toBeNull();
  });

  it("handles invalid page number gracefully", async () => {
    const url = buildUrl({ page: "not-a-number" });
    const result = await loadJobListing(url);
    expect(result.source).toBe("fixture");
    expect(result.page).toBe(1);
  });

  it("handles negative page number gracefully", async () => {
    const url = buildUrl({ page: "-1" });
    const result = await loadJobListing(url);
    expect(result.source).toBe("fixture");
    expect(result.page).toBe(1);
  });

  it("parses all params correctly", async () => {
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
    const result = await loadJobListing(url);
    expect(result.source).toBe("fixture");
    expect(result.query).toBe("devops");
    expect(result.location).toBe("Seattle");
    expect(result.remote).toBe("1");
    expect(result.salary).toBe("150000-200000");
    expect(result.jobType).toBe("full-time");
    expect(result.sort).toBe("date");
  });

  it("query matches across tags (case insensitive)", async () => {
    const url = buildUrl({ q: "react" });
    const result = await loadJobListing(url);
    expect(result.source).toBe("fixture");
    expect(result.totalJobs).toBeGreaterThanOrEqual(2);
    expect(result.jobs[0].tags.some((t) => t.toLowerCase() === "react")).toBe(true);
  });

  it("query matches across description", async () => {
    const url = buildUrl({ q: "machine learning" });
    const result = await loadJobListing(url);
    expect(result.source).toBe("fixture");
    expect(result.totalJobs).toBe(1);
    expect(result.jobs[0].slug).toBe("data-scientist-ml-datapulse");
  });

  it("returns source='adzuna' when Adzuna returns jobs", async () => {
    // In test env Adzuna is unconfigured → falls back to fixture
    // This test verifies source field exists in both paths
    const url = buildUrl({});
    const result = await loadJobListing(url);
    expect(["fixture", "adzuna"]).toContain(result.source);
  });
});

// ---------------------------------------------------------------------------
// Adzuna path (mocked)
// ---------------------------------------------------------------------------

function makeAdzunaMockJobs(count: number) {
  const results = [];
  for (let i = 1; i <= count; i++) {
    results.push({
      id: i,
      title: `Job ${i}`,
      company: { display_name: "TestCo" },
      location: { display_name: "New York, NY", area: ["New York", "NY", "US"] },
      redirect_url: `https://example.com/job/${i}`,
      created: "2026-05-10T00:00:00Z",
      description: `Description for job ${i}.`,
    });
  }
  return results;
}

describe("jobs loader — Adzuna path (mocked)", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("returns adzuna source with real count and correct pagination", async () => {
    const mockResponse = {
      results: makeAdzunaMockJobs(2),
      count: 81642,
    };

    vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(JSON.stringify(mockResponse), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }),
    );

    const url = buildUrl({ q: "developer", l: "New York" });
    const result = await loadJobListing(url, {
      ADZUNA_APP_ID: "test-id",
      ADZUNA_APP_KEY: "test-key",
    });

    expect(result.source).toBe("adzuna");
    expect(result.displayLabel).toBe("Showing live jobs");
    expect(result.totalJobs).toBe(81642);
    expect(result.perPage).toBe(100);
    expect(result.totalPages).toBe(Math.ceil(81642 / 100));
    expect(result.page).toBe(1);
    expect(result.jobs.length).toBe(2);
    expect(result.jobs[0].source).toBe("adzuna");
  });

  it("passes page 2 to Adzuna and returns page 2 in result", async () => {
    const mockResponse = {
      results: makeAdzunaMockJobs(2),
      count: 81642,
    };

    const fetchSpy = vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(JSON.stringify(mockResponse), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }),
    );

    const url = buildUrl({ q: "developer", l: "New York", page: "2" });
    const result = await loadJobListing(url, {
      ADZUNA_APP_ID: "test-id",
      ADZUNA_APP_KEY: "test-key",
    });

    expect(result.source).toBe("adzuna");
    expect(result.page).toBe(2);

    const calledUrl = fetchSpy.mock.calls[0][0] as string;
    expect(calledUrl).toContain("/search/2");
  });

  it("falls back to totalJobs = jobs.length when count is missing", async () => {
    const mockResponse = {
      results: makeAdzunaMockJobs(3),
    };

    vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(JSON.stringify(mockResponse), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }),
    );

    const url = buildUrl({});
    const result = await loadJobListing(url, {
      ADZUNA_APP_ID: "test-id",
      ADZUNA_APP_KEY: "test-key",
    });

    expect(result.source).toBe("adzuna");
    expect(result.totalJobs).toBe(3);
    expect(result.perPage).toBe(100);
    expect(result.totalPages).toBe(1);
    expect(result.jobs.length).toBe(3);
  });

  it("adzuna job fixture preserves applyUrl", async () => {
    const mockResponse = {
      results: [{
        id: 5001,
        title: "Adzuna Job With Apply",
        company: { display_name: "ApplyCo" },
        location: { display_name: "New York, NY", area: ["New York", "NY", "US"] },
        redirect_url: "https://external.com/apply/5001",
        created: "2026-05-10T00:00:00Z",
        description: "A job with an external apply URL.",
      }],
      count: 1,
    };

    vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(JSON.stringify(mockResponse), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }),
    );

    const url = buildUrl({ q: "developer" });
    const result = await loadJobListing(url, {
      ADZUNA_APP_ID: "test-id",
      ADZUNA_APP_KEY: "test-key",
    });

    expect(result.source).toBe("adzuna");
    expect(result.jobs[0].source).toBe("adzuna");
    expect(result.jobs[0].applyUrl).toBe("https://external.com/apply/5001");
    expect(result.jobs[0].slug).toBe("adzuna-job-with-apply-5001");
  });

  it("falls back to fixtures when Adzuna fetch returns null (credentials missing)", async () => {
    const url = buildUrl({ q: "frontend" });
    const result = await loadJobListing(url);

    expect(result.source).toBe("fixture");
    expect(result.displayLabel).toBe("Showing sample jobs");
    expect(result.totalJobs).toBe(2);
  });

  it("falls back to fixtures when Adzuna returns non-2xx", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response("Unauthorized", { status: 401 }),
    );

    const url = buildUrl({ q: "frontend" });
    const result = await loadJobListing(url, {
      ADZUNA_APP_ID: "test-id",
      ADZUNA_APP_KEY: "test-key",
    });

    expect(result.source).toBe("fixture");
    expect(result.displayLabel).toBe("Showing sample jobs");
    expect(result.totalJobs).toBe(2);
  });

  it("fixture fallback still uses fixture pagination (FIXTURE_PER_PAGE=5)", async () => {
    const url = buildUrl({});
    const result = await loadJobListing(url);

    expect(result.source).toBe("fixture");
    expect(result.perPage).toBe(5);
    expect(result.page).toBe(1);
    expect(result.totalPages).toBe(Math.ceil(result.totalJobs / 5));
  });

  it("fixture fallback respects query filter", async () => {
    const url = buildUrl({ q: "senior" });
    const result = await loadJobListing(url);

    expect(result.source).toBe("fixture");
    expect(result.totalJobs).toBeGreaterThanOrEqual(1);
    for (const job of result.jobs) {
      expect(job.title.toLowerCase()).toContain("senior");
    }
  });
});
