import type { CompanyFixture, JobCompany } from "~/types/page-model.types";
import { JOBS_FIXTURES } from "~/fixtures/jobs.fixture";

export const COMPANY_FIXTURES: CompanyFixture[] = [
  {
    id: "company-001",
    slug: "acme-corp",
    name: "Acme Corp",
    industry: "Technology",
    logoUrl: null,
    description:
      "Acme Corp is a leading technology company specializing in web infrastructure and developer tools. Founded in 2015, the company serves over 10,000 businesses worldwide with its cloud platform.",
    website: "https://acme-corp.example.com",
    employeeCount: 1200,
    headquarters: "San Francisco, CA",
    foundedYear: 2015,
    rating: 4.2,
    reviewCount: 245,
  },
  {
    id: "company-002",
    slug: "globaltech",
    name: "GlobalTech",
    industry: "Enterprise Software",
    logoUrl: null,
    description:
      "GlobalTech provides enterprise-grade software solutions for Fortune 500 companies. With a focus on AI-driven analytics and workflow automation, GlobalTech has grown to serve clients in over 40 countries.",
    website: "https://globaltech.example.com",
    employeeCount: 3400,
    headquarters: "New York, NY",
    foundedYear: 2010,
    rating: 3.8,
    reviewCount: 612,
  },
  {
    id: "company-003",
    slug: "datapulse",
    name: "DataPulse",
    industry: "Data & Analytics",
    logoUrl: null,
    description:
      "DataPulse is a data analytics platform that helps organizations make data-driven decisions. Their suite of products covers business intelligence, machine learning operations, and real-time data processing.",
    website: "https://datapulse.example.com",
    employeeCount: 850,
    headquarters: "Remote",
    foundedYear: 2018,
    rating: 4.5,
    reviewCount: 178,
  },
  {
    id: "company-004",
    slug: "designlab",
    name: "DesignLab",
    industry: "Design & Creative",
    logoUrl: null,
    description:
      "DesignLab is a creative technology company that builds user-centric digital products. From UX research to visual design, DesignLab partners with startups and enterprises to create intuitive experiences.",
    website: "https://designlab.example.com",
    employeeCount: 420,
    headquarters: "Austin, TX",
    foundedYear: 2016,
    rating: 4.0,
    reviewCount: 134,
  },
  {
    id: "company-005",
    slug: "cloudscale",
    name: "CloudScale",
    industry: "Cloud Infrastructure",
    logoUrl: null,
    description:
      "CloudScale provides cloud infrastructure and DevOps solutions for high-growth technology companies. Their managed platform handles deployment, monitoring, and scaling for thousands of applications.",
    website: "https://cloudscale.example.com",
    employeeCount: 680,
    headquarters: "Seattle, WA",
    foundedYear: 2017,
    rating: 4.3,
    reviewCount: 201,
  },
  {
    id: "company-006",
    slug: "nimbus-health",
    name: "Nimbus Health",
    industry: "Healthcare Technology",
    logoUrl: null,
    description:
      "Nimbus Health is building the next generation of digital health tools. Their platform connects patients with healthcare providers through telemedicine, health records, and AI-assisted diagnostics.",
    website: "https://nimbus-health.example.com",
    employeeCount: 310,
    headquarters: "Boston, MA",
    foundedYear: 2020,
    rating: 3.9,
    reviewCount: 87,
  },
  {
    id: "company-007",
    slug: "greenline-finance",
    name: "Greenline Finance",
    industry: "Fintech",
    logoUrl: null,
    description:
      "Greenline Finance offers sustainable investing and personal finance management tools. Their platform makes it easy for individuals to invest in ESG-focused funds and track their carbon footprint.",
    website: "https://greenline-finance.example.com",
    employeeCount: 195,
    headquarters: "Chicago, IL",
    foundedYear: 2019,
    rating: 4.1,
    reviewCount: 156,
  },
  {
    id: "company-008",
    slug: "vertex-security",
    name: "Vertex Security",
    industry: "Cybersecurity",
    logoUrl: null,
    description:
      "Vertex Security provides enterprise cybersecurity solutions including threat detection, incident response, and compliance monitoring. Their platform protects over 5,000 organizations globally.",
    website: "https://vertex-security.example.com",
    employeeCount: 550,
    headquarters: "Washington, DC",
    foundedYear: 2014,
    rating: 4.4,
    reviewCount: 223,
  },
  {
    id: "company-009",
    slug: "northwind-analytics",
    name: "NorthWind Analytics",
    industry: "Data & Analytics",
    logoUrl: null,
    description:
      "NorthWind Analytics delivers real-time business intelligence and predictive analytics for mid-market companies. Their SaaS platform processes billions of data points daily.",
    website: "https://northwind-analytics.example.com",
    employeeCount: 275,
    headquarters: "Denver, CO",
    foundedYear: 2019,
    rating: 4.0,
    reviewCount: 94,
  },
  {
    id: "company-010",
    slug: "pioneer-ml",
    name: "Pioneer ML",
    industry: "Artificial Intelligence",
    logoUrl: null,
    description:
      "Pioneer ML is a research-driven AI company building foundation models for enterprise use cases. Their work spans natural language processing, computer vision, and reinforcement learning.",
    website: "https://pioneer-ml.example.com",
    employeeCount: 180,
    headquarters: "Toronto, ON",
    foundedYear: 2021,
    rating: 4.6,
    reviewCount: 62,
  },
];

export const JOB_COMPANY_FIXTURES: JobCompany[] = [
  {
    id: "comp-001",
    slug: "acme-corp",
    name: "Acme Corp",
    description: "Acme Corp is a leading technology company specializing in web infrastructure and developer tools.",
    industry: "technology",
    logoUrl: null,
    websiteUrl: "https://acme-corp.example.com",
    size: "1000-5000",
    foundedYear: 2015,
  },
  {
    id: "comp-002",
    slug: "globaltech",
    name: "GlobalTech",
    description: "GlobalTech provides enterprise-grade software solutions for Fortune 500 companies.",
    industry: "enterprise-software",
    logoUrl: null,
    websiteUrl: "https://globaltech.example.com",
    size: "1000-5000",
    foundedYear: 2010,
  },
  {
    id: "comp-003",
    slug: "datapulse",
    name: "DataPulse",
    description: "DataPulse is a data analytics platform that helps organizations make data-driven decisions.",
    industry: "data-analytics",
    logoUrl: null,
    websiteUrl: "https://datapulse.example.com",
    size: "500-1000",
    foundedYear: 2018,
  },
  {
    id: "comp-004",
    slug: "designlab",
    name: "DesignLab",
    description: "DesignLab is a creative technology company that builds user-centric digital products.",
    industry: "design",
    logoUrl: null,
    websiteUrl: "https://designlab.example.com",
    size: "200-500",
    foundedYear: 2016,
  },
  {
    id: "comp-005",
    slug: "cloudscale",
    name: "CloudScale",
    description: "CloudScale provides cloud infrastructure and DevOps solutions for high-growth technology companies.",
    industry: "cloud-infrastructure",
    logoUrl: null,
    websiteUrl: "https://cloudscale.example.com",
    size: "500-1000",
    foundedYear: 2017,
  },
  {
    id: "comp-006",
    slug: "nimbus-health",
    name: "Nimbus Health",
    description: "Nimbus Health is building the next generation of digital health tools.",
    industry: "healthtech",
    logoUrl: null,
    websiteUrl: "https://nimbus-health.example.com",
    size: "200-500",
    foundedYear: 2020,
  },
  {
    id: "comp-007",
    slug: "greenline-finance",
    name: "Greenline Finance",
    description: "Greenline Finance offers sustainable investing and personal finance management tools.",
    industry: "fintech",
    logoUrl: null,
    websiteUrl: "https://greenline-finance.example.com",
    size: "100-200",
    foundedYear: 2019,
  },
  {
    id: "comp-008",
    slug: "vertex-security",
    name: "Vertex Security",
    description: "Vertex Security provides enterprise cybersecurity solutions including threat detection and incident response.",
    industry: "cybersecurity",
    logoUrl: null,
    websiteUrl: "https://vertex-security.example.com",
    size: "500-1000",
    foundedYear: 2014,
  },
  {
    id: "comp-009",
    slug: "northwind-analytics",
    name: "NorthWind Analytics",
    description: "NorthWind Analytics delivers real-time business intelligence and predictive analytics.",
    industry: "data-analytics",
    logoUrl: null,
    websiteUrl: "https://northwind-analytics.example.com",
    size: "200-500",
    foundedYear: 2019,
  },
  {
    id: "comp-010",
    slug: "pioneer-ml",
    name: "Pioneer ML",
    description: "Pioneer ML is a research-driven AI company building foundation models for enterprise use cases.",
    industry: "artificial-intelligence",
    logoUrl: null,
    websiteUrl: "https://pioneer-ml.example.com",
    size: "50-200",
    foundedYear: 2021,
  },
];

export function getCompanyBySlug(slug: string): CompanyFixture | undefined {
  return COMPANY_FIXTURES.find((c) => c.slug === slug);
}

export function searchCompanies(query: string | null): CompanyFixture[] {
  if (!query || !query.trim()) return COMPANY_FIXTURES;
  const q = query.toLowerCase().trim();
  return COMPANY_FIXTURES.filter(
    (c) =>
      c.name.toLowerCase().includes(q) ||
      c.industry.toLowerCase().includes(q) ||
      c.headquarters.toLowerCase().includes(q) ||
      c.description.toLowerCase().includes(q),
  );
}

export function getOpenJobCount(companySlug: string): number {
  return JOBS_FIXTURES.filter((j) => j.companySlug === companySlug).length;
}

export function getJobsForCompany(companySlug: string): string[] {
  return JOBS_FIXTURES.filter((j) => j.companySlug === companySlug).map((j) => j.slug);
}

export function getIndustries(): string[] {
  const industries = new Set(COMPANY_FIXTURES.map((c) => c.industry));
  return Array.from(industries).sort();
}

export function validateCompanyFixture(company: CompanyFixture): string[] {
  const errors: string[] = [];
  if (!company.id) errors.push("Company missing id");
  if (!company.slug) errors.push("Company missing slug");
  if (!company.name) errors.push("Company missing name");
  if (!company.industry) errors.push("Company missing industry");
  return errors;
}

export function findCompanyBySlug(slug: string): JobCompany | undefined {
  return JOB_COMPANY_FIXTURES.find((c) => c.slug === slug);
}
