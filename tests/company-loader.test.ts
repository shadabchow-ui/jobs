import { describe, it, expect } from "vitest";
import { loadCompanyDiscovery, loadCompanyProfile } from "~/loaders/company.loader.server";
import { COMPANY_FIXTURES } from "~/fixtures/companies.fixture";

describe("loadCompanyDiscovery", () => {
  it("returns all companies when query is null", () => {
    const result = loadCompanyDiscovery(null);
    expect(result.companies).toEqual(COMPANY_FIXTURES);
    expect(result.query).toBeNull();
    expect(result.totalCompanies).toBe(COMPANY_FIXTURES.length);
  });

  it("returns all companies when query is empty", () => {
    const result = loadCompanyDiscovery("");
    expect(result.companies).toEqual(COMPANY_FIXTURES);
    expect(result.query).toBeNull();
  });

  it("filters companies by name", () => {
    const result = loadCompanyDiscovery("acme");
    expect(result.companies.length).toBeGreaterThanOrEqual(1);
    expect(result.companies.every((c) => c.name.toLowerCase().includes("acme"))).toBe(true);
  });

  it("filters companies by industry", () => {
    const result = loadCompanyDiscovery("data");
    expect(result.companies.length).toBeGreaterThanOrEqual(1);
    expect(result.companies.every((c) => c.industry.toLowerCase().includes("data") || c.name.toLowerCase().includes("data"))).toBe(true);
  });

  it("filters companies by headquarters", () => {
    const result = loadCompanyDiscovery("san francisco");
    expect(result.companies.length).toBeGreaterThanOrEqual(1);
    expect(result.companies.every((c) => c.headquarters.toLowerCase().includes("san francisco"))).toBe(true);
  });

  it("returns empty array for no matching query", () => {
    const result = loadCompanyDiscovery("xyznonexistent");
    expect(result.companies).toEqual([]);
    expect(result.totalCompanies).toBe(0);
  });

  it("is case insensitive", () => {
    const lower = loadCompanyDiscovery("acme");
    const upper = loadCompanyDiscovery("ACME");
    expect(lower.companies.length).toBe(upper.companies.length);
    expect(lower.companies.map((c) => c.id).sort()).toEqual(upper.companies.map((c) => c.id).sort());
  });
});

describe("loadCompanyProfile", () => {
  it("returns company data for valid slug", () => {
    const result = loadCompanyProfile("acme-corp");
    expect(result).not.toBeNull();
    expect(result!.company.slug).toBe("acme-corp");
    expect(result!.company.name).toBe("Acme Corp");
  });

  it("includes open jobs for the company", () => {
    const result = loadCompanyProfile("acme-corp");
    expect(result).not.toBeNull();
    expect(result!.jobs.length).toBeGreaterThanOrEqual(1);
    expect(result!.jobs.every((j) => j.slug.length > 0)).toBe(true);
  });

  it("includes salary roles for the company", () => {
    const result = loadCompanyProfile("acme-corp");
    expect(result).not.toBeNull();
    expect(result!.salaryRoles.length).toBeGreaterThanOrEqual(1);
    expect(result!.salaryRoles[0].title).toBeTruthy();
    expect(result!.salaryRoles[0].medianSalary).toBeGreaterThan(0);
  });

  it("includes similar companies", () => {
    const result = loadCompanyProfile("datapulse");
    expect(result).not.toBeNull();
    expect(result!.similarCompanies.length).toBeGreaterThan(0);
    expect(result!.similarCompanies.every((c) => c.id !== "company-003")).toBe(true);
  });

  it("similar companies share industry", () => {
    const result = loadCompanyProfile("datapulse");
    expect(result).not.toBeNull();
    expect(result!.similarCompanies.every((c) => c.industry === result!.company.industry)).toBe(true);
  });

  it("returns null for unknown slug", () => {
    const result = loadCompanyProfile("nonexistent-company");
    expect(result).toBeNull();
  });

  it("returns null for empty slug", () => {
    const result = loadCompanyProfile("");
    expect(result).toBeNull();
  });

  it("every fixture company returns a valid profile", () => {
    for (const company of COMPANY_FIXTURES) {
      const result = loadCompanyProfile(company.slug);
      expect(result).not.toBeNull();
      expect(result!.company.id).toBe(company.id);
    }
  });
});
