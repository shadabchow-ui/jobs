import type { SalaryFixture, SalaryInsight } from "~/types/page-model.types";

export const SALARY_FIXTURES: SalaryFixture[] = [
  {
    id: "salary-001",
    jobTitle: "Senior Frontend Engineer",
    company: "Acme Corp",
    location: "San Francisco, CA",
    currency: "USD",
    minSalary: 150000,
    maxSalary: 200000,
    medianSalary: 175000,
    dataPoints: 48,
  },
  {
    id: "salary-002",
    jobTitle: "Product Manager",
    company: "GlobalTech",
    location: "New York, NY",
    currency: "USD",
    minSalary: 130000,
    maxSalary: 170000,
    medianSalary: 150000,
    dataPoints: 32,
  },
  {
    id: "salary-003",
    jobTitle: "Data Scientist",
    company: "DataPulse",
    location: "Remote",
    currency: "USD",
    minSalary: 140000,
    maxSalary: 190000,
    medianSalary: 162000,
    dataPoints: 55,
  },
  {
    id: "salary-004",
    jobTitle: "UX Designer",
    company: "DesignLab",
    location: "Austin, TX",
    currency: "USD",
    minSalary: 100000,
    maxSalary: 140000,
    medianSalary: 120000,
    dataPoints: 27,
  },
  {
    id: "salary-005",
    jobTitle: "DevOps Engineer",
    company: "CloudScale",
    location: "Seattle, WA",
    currency: "USD",
    minSalary: 130000,
    maxSalary: 175000,
    medianSalary: 152000,
    dataPoints: 41,
  },
  {
    id: "salary-006",
    jobTitle: "Backend Engineer",
    company: "Nimbus Health",
    location: "Boston, MA",
    currency: "USD",
    minSalary: 120000,
    maxSalary: 160000,
    medianSalary: 140000,
    dataPoints: 19,
  },
  {
    id: "salary-007",
    jobTitle: "Security Engineer",
    company: "Vertex Security",
    location: "Washington, DC",
    currency: "USD",
    minSalary: 135000,
    maxSalary: 180000,
    medianSalary: 157000,
    dataPoints: 33,
  },
  {
    id: "salary-008",
    jobTitle: "Data Analyst",
    company: "NorthWind Analytics",
    location: "Denver, CO",
    currency: "USD",
    minSalary: 85000,
    maxSalary: 115000,
    medianSalary: 98000,
    dataPoints: 24,
  },
  {
    id: "salary-009",
    jobTitle: "ML Researcher",
    company: "Pioneer ML",
    location: "Toronto, ON",
    currency: "USD",
    minSalary: 160000,
    maxSalary: 220000,
    medianSalary: 185000,
    dataPoints: 14,
  },
  {
    id: "salary-010",
    jobTitle: "Staff Engineer",
    company: "Acme Corp",
    location: "San Francisco, CA",
    currency: "USD",
    minSalary: 190000,
    maxSalary: 250000,
    medianSalary: 220000,
    dataPoints: 22,
  },
];

export const SALARY_INSIGHT_EXAMPLES: SalaryInsight[] = [
  { min: 150000, max: 200000, currency: "USD", period: "yearly", displayRange: "$150,000 – $200,000" },
  { min: 130000, max: 170000, currency: "USD", period: "yearly", displayRange: "$130,000 – $170,000" },
  { min: 140000, max: 190000, currency: "USD", period: "yearly", displayRange: "$140,000 – $190,000" },
  { min: 100000, max: 140000, currency: "USD", period: "yearly", displayRange: "$100,000 – $140,000" },
  { min: 130000, max: 175000, currency: "USD", period: "yearly", displayRange: "$130,000 – $175,000" },
  { min: 85000, max: 115000, currency: "USD", period: "yearly", displayRange: "$85,000 – $115,000" },
  { min: 70000, max: 95000, currency: "GBP", period: "yearly", displayRange: "£70,000 – £95,000" },
  { min: 65000, max: 85000, currency: "EUR", period: "yearly", displayRange: "€65,000 – €85,000" },
];

export function getSalaryByCompanySlug(slug: string): SalaryFixture[] {
  const nameMap: Record<string, string> = {
    "acme-corp": "Acme Corp",
    globaltech: "GlobalTech",
    datapulse: "DataPulse",
    designlab: "DesignLab",
    cloudscale: "CloudScale",
    "nimbus-health": "Nimbus Health",
    "vertex-security": "Vertex Security",
    "northwind-analytics": "NorthWind Analytics",
    "pioneer-ml": "Pioneer ML",
  };
  const companyName = nameMap[slug];
  if (!companyName) return [];
  return SALARY_FIXTURES.filter((s) => s.company === companyName);
}

export function validateSalaryFixture(salary: SalaryFixture): string[] {
  const errors: string[] = [];
  if (!salary.id) errors.push("Salary missing id");
  if (!salary.jobTitle) errors.push("Salary missing jobTitle");
  if (salary.medianSalary <= 0) errors.push("Salary medianSalary must be positive");
  return errors;
}
