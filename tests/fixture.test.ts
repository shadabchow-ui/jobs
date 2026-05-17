import { JOBS_FIXTURES, getRichJobs, validateJobFixture, validateRichJob, getJobBySlug } from "~/fixtures/jobs.fixture";
const JOBS_FIXTURES_RICH = getRichJobs();
import { COMPANY_FIXTURES, JOB_COMPANY_FIXTURES, validateCompanyFixture } from "~/fixtures/companies.fixture";
import { SALARY_FIXTURES, validateSalaryFixture } from "~/fixtures/salaries.fixture";
import { LOCATION_FIXTURES, validateLocation } from "~/fixtures/locations.fixture";
import { CATEGORY_FIXTURES, validateCategory } from "~/fixtures/categories.fixture";
import { SAVED_JOB_FIXTURES, validateSavedJobEntry } from "~/fixtures/saved-jobs.fixture";
import { describe, it, expect } from "vitest";

describe("jobs fixtures", () => {
  it("all fixtures have unique slugs", () => {
    const slugs = JOBS_FIXTURES.map((j) => j.slug);
    const uniqueSlugs = new Set(slugs);
    expect(uniqueSlugs.size).toBe(slugs.length);
  });

  it("all fixtures have unique ids", () => {
    const ids = JOBS_FIXTURES.map((j) => j.id);
    const uniqueIds = new Set(ids);
    expect(uniqueIds.size).toBe(ids.length);
  });

  it("all fixtures pass validation", () => {
    for (const job of JOBS_FIXTURES) {
      const errors = validateJobFixture(job);
      expect(errors).toEqual([]);
    }
  });

  it("fixtures contain required fields", () => {
    for (const job of JOBS_FIXTURES) {
      expect(job.id).toBeTruthy();
      expect(job.slug).toBeTruthy();
      expect(job.title).toBeTruthy();
      expect(job.company).toBeTruthy();
      expect(job.location).toBeTruthy();
      expect(job.tags).toBeInstanceOf(Array);
    }
  });

  it("fixture count is at least 20", () => {
    expect(JOBS_FIXTURES.length).toBeGreaterThanOrEqual(20);
  });

  it("all fixtures have AI placeholder fields set to null", () => {
    for (const job of JOBS_FIXTURES) {
      expect(job.aiSummary).toBeNull();
      expect(job.detectedSkills).toBeNull();
      expect(job.matchScore).toBeNull();
      expect(job.matchedSkills).toBeNull();
      expect(job.missingSkills).toBeNull();
      expect(job.jobQualityScore).toBeNull();
    }
  });

  it("all rich fixtures have AI placeholder fields set to null", () => {
    for (const job of JOBS_FIXTURES_RICH) {
      expect(job.aiSummary).toBeNull();
      expect(job.detectedSkills).toBeNull();
      expect(job.matchScore).toBeNull();
      expect(job.matchedSkills).toBeNull();
      expect(job.missingSkills).toBeNull();
      expect(job.jobQualityScore).toBeNull();
    }
  });

  it("all rich fixtures pass validation", () => {
    for (const job of JOBS_FIXTURES_RICH) {
      const errors = validateRichJob(job);
      expect(errors).toEqual([]);
    }
  });

  it("JOBS_FIXTURES_RICH count matches JOBS_FIXTURES count", () => {
    expect(JOBS_FIXTURES_RICH.length).toBe(JOBS_FIXTURES.length);
  });

  it("JOBS_FIXTURES_RICH have unique slugs", () => {
    const slugs = JOBS_FIXTURES_RICH.map((j) => j.slug);
    const uniqueSlugs = new Set(slugs);
    expect(uniqueSlugs.size).toBe(slugs.length);
  });

  it("JOBS_FIXTURES_RICH have unique sourceIds", () => {
    const sourceIds = JOBS_FIXTURES_RICH.map((j) => j.sourceId);
    const uniqueIds = new Set(sourceIds);
    expect(uniqueIds.size).toBe(sourceIds.length);
  });
});

describe("rich job fields", () => {
  it("all rich jobs have nested company objects", () => {
    for (const job of JOBS_FIXTURES_RICH) {
      expect(job.company).toBeDefined();
      expect(job.company.id).toBeTruthy();
      expect(job.company.name).toBeTruthy();
    }
  });

  it("all rich jobs have nested location objects", () => {
    for (const job of JOBS_FIXTURES_RICH) {
      expect(job.location).toBeDefined();
      expect(job.location.city).toBeTruthy();
      expect(job.location.displayName).toBeTruthy();
    }
  });

  it("all rich jobs have categories array", () => {
    for (const job of JOBS_FIXTURES_RICH) {
      expect(Array.isArray(job.categories)).toBe(true);
      expect(job.categories.length).toBeGreaterThanOrEqual(1);
      for (const cat of job.categories) {
        expect(cat.id).toBeTruthy();
        expect(cat.name).toBeTruthy();
      }
    }
  });
});

describe("fixture helper", () => {
  it("getJobBySlug finds existing job", () => {
    const job = JOBS_FIXTURES.find((j) => j.slug);
    if (job) {
      const found = getJobBySlug(job.slug);
      expect(found).toBeDefined();
      expect(found?.id).toBe(job.id);
    }
  });

  it("getJobBySlug returns undefined for unknown slug", () => {
    const result = getJobBySlug("nonexistent-job");
    expect(result).toBeUndefined();
  });
});

describe("company fixtures", () => {
  it("all companies have unique slugs and ids", () => {
    const slugs = COMPANY_FIXTURES.map((c) => c.slug);
    const ids = COMPANY_FIXTURES.map((c) => c.id);
    expect(new Set(slugs).size).toBe(slugs.length);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("all companies pass validation", () => {
    for (const company of COMPANY_FIXTURES) {
      const errors = validateCompanyFixture(company);
      expect(errors).toEqual([]);
    }
  });

  it("company count is at least 8", () => {
    expect(COMPANY_FIXTURES.length).toBeGreaterThanOrEqual(8);
  });
});

describe("job company fixtures", () => {
  it("all job companies have unique slugs", () => {
    const slugs = JOB_COMPANY_FIXTURES.map((c) => c.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it("JOB_COMPANY_FIXTURES count matches COMPANY_FIXTURES count", () => {
    expect(JOB_COMPANY_FIXTURES.length).toBe(COMPANY_FIXTURES.length);
  });
});

describe("salary fixtures", () => {
  it("all salaries have unique ids", () => {
    const ids = SALARY_FIXTURES.map((s) => s.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("all salaries pass validation", () => {
    for (const salary of SALARY_FIXTURES) {
      const errors = validateSalaryFixture(salary);
      expect(errors).toEqual([]);
    }
  });

  it("salary count is at least 5", () => {
    expect(SALARY_FIXTURES.length).toBeGreaterThanOrEqual(5);
  });

  it("all salaries have positive median", () => {
    for (const salary of SALARY_FIXTURES) {
      expect(salary.medianSalary).toBeGreaterThan(0);
    }
  });
});

describe("location fixtures", () => {
  it("all locations have unique ids", () => {
    const ids = LOCATION_FIXTURES.map((l) => l.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("all locations pass validation", () => {
    for (const loc of LOCATION_FIXTURES) {
      const errors = validateLocation(loc);
      expect(errors).toEqual([]);
    }
  });

  it("location count is at least 5", () => {
    expect(LOCATION_FIXTURES.length).toBeGreaterThanOrEqual(5);
  });
});

describe("category fixtures", () => {
  it("all categories have unique slugs and ids", () => {
    const slugs = CATEGORY_FIXTURES.map((c) => c.slug);
    const ids = CATEGORY_FIXTURES.map((c) => c.id);
    expect(new Set(slugs).size).toBe(slugs.length);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("all categories pass validation", () => {
    for (const cat of CATEGORY_FIXTURES) {
      const errors = validateCategory(cat);
      expect(errors).toEqual([]);
    }
  });

  it("category count is at least 10", () => {
    expect(CATEGORY_FIXTURES.length).toBeGreaterThanOrEqual(10);
  });
});

describe("saved job fixtures", () => {
  it("all saved job entries have unique composite keys", () => {
    const keys = SAVED_JOB_FIXTURES.map((s) => `${s.userId}-${s.jobId}`);
    expect(new Set(keys).size).toBe(keys.length);
  });

  it("all saved job entries pass validation", () => {
    for (const entry of SAVED_JOB_FIXTURES) {
      const errors = validateSavedJobEntry(entry);
      expect(errors).toEqual([]);
    }
  });

  it("saved job entries cover all states", () => {
    const presentStates = new Set(SAVED_JOB_FIXTURES.map((s) => s.savedState));
    expect(presentStates.has("saved")).toBe(true);
    expect(presentStates.has("applied")).toBe(true);
    expect(presentStates.has("interviewing")).toBe(true);
    expect(presentStates.has("offered")).toBe(true);
    expect(presentStates.has("rejected")).toBe(true);
    expect(presentStates.has("archived")).toBe(true);
  });
});
