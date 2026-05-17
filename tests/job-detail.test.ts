import { describe, it, expect } from "vitest";
import { JOBS_FIXTURES, getJobBySlug } from "~/fixtures/jobs.fixture";
import { loadJobDetail } from "~/loaders/job-detail.loader.server";

describe("job detail loader", () => {
  it("loadJobDetail returns job with company and similar jobs for valid slug", () => {
    const result = loadJobDetail("senior-frontend-engineer-acme-corp");
    expect(result).not.toBeNull();
    expect(result!.job.slug).toBe("senior-frontend-engineer-acme-corp");
    expect(result!.job.title).toBe("Senior Frontend Engineer");
    expect(result!.company).not.toBeNull();
    expect(result!.company!.slug).toBe("acme-corp");
    expect(result!.similarJobs.length).toBeGreaterThanOrEqual(0);
  });

  it("loadJobDetail returns null for unknown slug", () => {
    const result = loadJobDetail("nonexistent-job-slug");
    expect(result).toBeNull();
  });

  it("loadJobDetail returns null for empty slug", () => {
    const result = loadJobDetail("");
    expect(result).toBeNull();
  });
});

describe("getJobBySlug", () => {
  it("finds each fixture job by its slug", () => {
    for (const fixture of JOBS_FIXTURES) {
      const found = getJobBySlug(fixture.slug);
      expect(found).toBeDefined();
      expect(found!.id).toBe(fixture.id);
    }
  });

  it("returns undefined for unknown slug", () => {
    const result = getJobBySlug("not-a-real-job-slug");
    expect(result).toBeUndefined();
  });
});

describe("job fixture detail fields", () => {
  it("all fixtures have responsibilities array", () => {
    for (const job of JOBS_FIXTURES) {
      expect(Array.isArray(job.responsibilities)).toBe(true);
    }
  });

  it("all fixtures have requirements array", () => {
    for (const job of JOBS_FIXTURES) {
      expect(Array.isArray(job.requirements)).toBe(true);
    }
  });

  it("all fixtures have benefits array", () => {
    for (const job of JOBS_FIXTURES) {
      expect(Array.isArray(job.benefits)).toBe(true);
    }
  });

  it("all fixtures have at least one responsibility", () => {
    for (const job of JOBS_FIXTURES) {
      expect(job.responsibilities.length).toBeGreaterThanOrEqual(1);
    }
  });
});

describe("job detail — missing slug safety", () => {
  it("returns null for adzuna-style slugs not in fixtures", () => {
    const result = loadJobDetail("senior-frontend-engineer-1001");
    expect(result).toBeNull();
  });

  it("returns null for random unknown slug", () => {
    const result = loadJobDetail("some-random-slug-12345");
    expect(result).toBeNull();
  });
});

describe("similar jobs", () => {
  it("similar jobs do not include the current job", () => {
    for (const job of JOBS_FIXTURES) {
      const result = loadJobDetail(job.slug);
      if (result) {
        const similarIds = result.similarJobs.map((j) => j.id);
        expect(similarIds).not.toContain(job.id);
      }
    }
  });

  it("similar jobs array is never more than 3", () => {
    for (const job of JOBS_FIXTURES) {
      const result = loadJobDetail(job.slug);
      if (result) {
        expect(result.similarJobs.length).toBeLessThanOrEqual(3);
      }
    }
  });
});
