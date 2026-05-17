import type { CompanyFixture } from "~/types/page-model.types";
import { COMPANY_FIXTURES, getCompanyBySlug } from "~/fixtures/companies.fixture";
import { JOBS_FIXTURES } from "~/fixtures/jobs.fixture";
import { getSalaryByCompanySlug } from "~/fixtures/salaries.fixture";

export interface CompanyDiscoveryData {
  companies: CompanyFixture[];
  query: string | null;
  totalCompanies: number;
}

export function loadCompanyDiscovery(query: string | null): CompanyDiscoveryData {
  if (!query || !query.trim()) {
    return {
      companies: COMPANY_FIXTURES,
      query: null,
      totalCompanies: COMPANY_FIXTURES.length,
    };
  }

  const q = query.toLowerCase().trim();
  const filtered = COMPANY_FIXTURES.filter(
    (c) =>
      c.name.toLowerCase().includes(q) ||
      c.industry.toLowerCase().includes(q) ||
      c.headquarters.toLowerCase().includes(q),
  );

  return {
    companies: filtered,
    query,
    totalCompanies: filtered.length,
  };
}

export interface CompanyProfileData {
  company: CompanyFixture;
  jobs: Array<{
    id: string;
    slug: string;
    title: string;
    location: string;
    remote: boolean;
    salaryRange: string | null;
    description: string;
  }>;
  salaryRoles: Array<{
    title: string;
    medianSalary: number;
    currency: string;
  }>;
  similarCompanies: CompanyFixture[];
}

export function loadCompanyProfile(slug: string): CompanyProfileData | null {
  const company = getCompanyBySlug(slug);
  if (!company) return null;

  return {
    company,
    jobs: loadJobsForCompany(slug),
    salaryRoles: loadSalaryRolesForCompany(slug),
    similarCompanies: loadSimilarCompanies(company),
  };
}

function loadJobsForCompany(slug: string) {
  return JOBS_FIXTURES.filter((j) => j.companySlug === slug).map((j) => ({
    id: j.id,
    slug: j.slug,
    title: j.title,
    location: j.location,
    remote: j.remote,
    salaryRange: j.salaryRange,
    description: j.description,
  }));
}

function loadSalaryRolesForCompany(slug: string) {
  return getSalaryByCompanySlug(slug).map((s) => ({
    title: s.jobTitle,
    medianSalary: s.medianSalary,
    currency: s.currency,
  }));
}

function loadSimilarCompanies(company: CompanyFixture): CompanyFixture[] {
  return COMPANY_FIXTURES.filter(
    (c) =>
      c.id !== company.id &&
      c.industry === company.industry,
  )    .slice(0, 3);
}
