import { describe, it, expect } from "vitest";
import {
  loadSalarySearch,
  loadSalaryDetail,
} from "~/loaders/salary.loader.server";

describe("loadSalarySearch", () => {
  it("returns all results when query is null", () => {
    const result = loadSalarySearch(null);
    expect(result.totalResults).toBeGreaterThanOrEqual(10);
    expect(result.query).toBeNull();
  });

  it("returns all results when query is empty", () => {
    const result = loadSalarySearch("");
    expect(result.totalResults).toBeGreaterThanOrEqual(10);
    expect(result.query).toBeNull();
  });

  it("filters by job title", () => {
    const result = loadSalarySearch("engineer");
    expect(result.totalResults).toBeGreaterThanOrEqual(1);
    expect(
      result.results.every((r) => r.title.toLowerCase().includes("engineer")),
    ).toBe(true);
  });

  it("filters by company name", () => {
    const result = loadSalarySearch("acme");
    expect(result.totalResults).toBeGreaterThanOrEqual(1);
  });

  it("filters by location", () => {
    const result = loadSalarySearch("san francisco");
    expect(result.totalResults).toBeGreaterThanOrEqual(1);
  });

  it("returns empty results for non-matching query", () => {
    const result = loadSalarySearch("xyznonexistent");
    expect(result.totalResults).toBe(0);
    expect(result.results).toEqual([]);
  });

  it("is case insensitive", () => {
    const lower = loadSalarySearch("engineer");
    const upper = loadSalarySearch("ENGINEER");
    expect(lower.totalResults).toBe(upper.totalResults);
  });

  it("sorts results by data points descending", () => {
    const result = loadSalarySearch(null);
    for (let i = 1; i < result.results.length; i++) {
      expect(result.results[i - 1].dataPoints).toBeGreaterThanOrEqual(
        result.results[i].dataPoints,
      );
    }
  });

  it("includes popular titles sorted by data points", () => {
    const result = loadSalarySearch(null);
    expect(result.popularTitles.length).toBeLessThanOrEqual(6);
    expect(result.popularTitles.length).toBeGreaterThanOrEqual(1);
    for (let i = 1; i < result.popularTitles.length; i++) {
      expect(
        result.popularTitles[i - 1].dataPoints,
      ).toBeGreaterThanOrEqual(result.popularTitles[i].dataPoints);
    }
  });

  it("every result has a titleSlug", () => {
    const result = loadSalarySearch(null);
    for (const r of result.results) {
      expect(r.titleSlug).toBeTruthy();
      expect(r.titleSlug).not.toContain(" ");
    }
  });
});

describe("loadSalaryDetail", () => {
  it("returns data for valid title slug", () => {
    const result = loadSalaryDetail("senior-frontend-engineer");
    expect(result).not.toBeNull();
    expect(result!.title).toBe("Senior Frontend Engineer");
  });

  it("includes aggregated salary data", () => {
    const result = loadSalaryDetail("senior-frontend-engineer");
    expect(result).not.toBeNull();
    expect(result!.aggregated.medianSalary).toBeGreaterThan(0);
    expect(result!.aggregated.minSalary).toBeGreaterThan(0);
    expect(result!.aggregated.maxSalary).toBeGreaterThan(
      result!.aggregated.minSalary,
    );
    expect(result!.aggregated.dataPoints).toBeGreaterThan(0);
    expect(result!.aggregated.currency).toBeTruthy();
  });

  it("includes by-location breakdown", () => {
    const result = loadSalaryDetail("senior-frontend-engineer");
    expect(result).not.toBeNull();
    expect(result!.byLocation.length).toBeGreaterThanOrEqual(1);
    for (const loc of result!.byLocation) {
      expect(loc.location).toBeTruthy();
      expect(loc.medianSalary).toBeGreaterThan(0);
    }
  });

  it("includes by-company breakdown", () => {
    const result = loadSalaryDetail("senior-frontend-engineer");
    expect(result).not.toBeNull();
    expect(result!.byCompany.length).toBeGreaterThanOrEqual(1);
    for (const comp of result!.byCompany) {
      expect(comp.company).toBeTruthy();
      expect(comp.medianSalary).toBeGreaterThan(0);
    }
  });

  it("includes related titles", () => {
    const result = loadSalaryDetail("senior-frontend-engineer");
    expect(result).not.toBeNull();
    expect(result!.relatedTitles.length).toBeGreaterThanOrEqual(1);
    for (const t of result!.relatedTitles) {
      expect(t.titleSlug).toBeTruthy();
      expect(t.titleSlug).not.toBe("senior-frontend-engineer");
    }
  });

  it("returns null for unknown slug", () => {
    const result = loadSalaryDetail("nonexistent-role");
    expect(result).toBeNull();
  });

  it("returns null for empty slug", () => {
    const result = loadSalaryDetail("");
    expect(result).toBeNull();
  });

  it("by-location entries are sorted by data points descending", () => {
    const result = loadSalaryDetail("senior-frontend-engineer");
    expect(result).not.toBeNull();
    for (let i = 1; i < result!.byLocation.length; i++) {
      expect(result!.byLocation[i - 1].dataPoints).toBeGreaterThanOrEqual(
        result!.byLocation[i].dataPoints,
      );
    }
  });

  it("by-company entries are sorted by data points descending", () => {
    const result = loadSalaryDetail("senior-frontend-engineer");
    expect(result).not.toBeNull();
    for (let i = 1; i < result!.byCompany.length; i++) {
      expect(result!.byCompany[i - 1].dataPoints).toBeGreaterThanOrEqual(
        result!.byCompany[i].dataPoints,
      );
    }
  });

  it("handles title with single salary entry", () => {
    const result = loadSalaryDetail("ml-researcher");
    expect(result).not.toBeNull();
    expect(result!.byLocation.length).toBeGreaterThanOrEqual(1);
    expect(result!.byCompany.length).toBeGreaterThanOrEqual(1);
  });
});
