// ---------------------------------------------------------------------------
// App-owned data contracts for the job-board MVP.
// These are normalized shapes, NOT Adzuna or external API shapes.
// ---------------------------------------------------------------------------

export interface JobCompany {
  id: string;
  slug: string;
  name: string;
  description: string;
  industry: string;
  logoUrl: string | null;
  websiteUrl: string | null;
  size: string | null;
  foundedYear: number | null;
}

export interface JobLocation {
  id: string;
  city: string;
  state: string | null;
  country: string;
  remote: boolean;
  hybrid: boolean;
  onsite: boolean;
  displayName: string;
}

export interface JobCategory {
  id: string;
  slug: string;
  name: string;
  parentId: string | null;
}

export interface SalaryInsight {
  min: number | null;
  max: number | null;
  currency: string;
  period: "yearly" | "monthly" | "hourly";
  displayRange: string | null;
}

export type SavedJobState =
  | "saved"
  | "applied"
  | "interviewing"
  | "offered"
  | "rejected"
  | "archived";

export interface Job {
  id: string;
  slug: string;
  title: string;
  company: JobCompany;
  location: JobLocation;
  categoryIds: string[];
  categories: JobCategory[];
  salary: SalaryInsight | null;
  description: string;
  requirements: string[];
  responsibilities: string[];
  benefits: string[];
  postedAt: string;
  closingAt: string | null;
  source: string;
  sourceId: string;
  applyUrl: string | null;
  aiSummary: string | null;
  detectedSkills: string[] | null;
  seniority: string | null;
  remoteType: string | null;
  salaryNote: string | null;
  matchScore: number | null;
  matchedSkills: string[] | null;
  missingSkills: string[] | null;
  jobQualityScore: number | null;
}

export interface JobSearchFilters {
  query: string;
  location: string | null;
  remote: boolean | null;
  salaryMin: number | null;
  salaryMax: number | null;
  categories: string[];
  companyIds: string[];
  postedWithin: "24h" | "3d" | "7d" | "14d" | "30d" | null;
}

export interface JobSearchResultPageModel {
  query: string;
  totalResults: number;
  page: number;
  pageSize: number;
  totalPages: number;
  jobs: Job[];
  facets: JobCategory[];
  fallbackState: {
    isDegraded: boolean;
    reason: string | null;
    userMessage: string | null;
  };
}

export interface JobDetailPageModel {
  job: Job;
  relatedJobs: Job[];
  savedState: SavedJobState | null;
}

// ---------------------------------------------------------------------------
// Legacy flat fixture types — kept for backward compatibility.
// New code should prefer the contracts above.
// ---------------------------------------------------------------------------

export interface JobFixture {
  id: string;
  slug: string;
  title: string;
  company: string;
  companySlug: string;
  location: string;
  remote: boolean;
  salaryRange: string | null;
  postedAt: string;
  description: string;
  tags: string[];
  source: string;
  jobType: string | null;
  responsibilities: string[];
  requirements: string[];
  benefits: string[];
  applyUrl: string | null;
  aiSummary: string | null;
  detectedSkills: string[] | null;
  seniority: string | null;
  remoteType: string | null;
  salaryNote: string | null;
  matchScore: number | null;
  matchedSkills: string[] | null;
  missingSkills: string[] | null;
  jobQualityScore: number | null;
}

export interface CompanyFixture {
  id: string;
  slug: string;
  name: string;
  industry: string;
  logoUrl: string | null;
  description: string;
  website: string;
  employeeCount: number | null;
  headquarters: string;
  foundedYear: number | null;
  rating: number | null;
  reviewCount: number | null;
}

export interface SalaryFixture {
  id: string;
  jobTitle: string;
  company: string;
  location: string;
  currency: string;
  minSalary: number;
  maxSalary: number;
  medianSalary: number;
  dataPoints: number;
}

export interface PageModel<T> {
  data: T;
  meta: {
    title: string;
    description: string;
    canonical: string | null;
  };
}

// ---------------------------------------------------------------------------
// Salary / compensation search and detail page models
// ---------------------------------------------------------------------------

export interface SalaryTitleEntry {
  title: string;
  titleSlug: string;
  minSalary: number;
  maxSalary: number;
  medianSalary: number;
  currency: string;
  dataPoints: number;
  topLocation: string | null;
  topCompany: string | null;
}

export interface SalarySearchPageModel {
  query: string | null;
  totalResults: number;
  results: SalaryTitleEntry[];
  popularTitles: SalaryTitleEntry[];
}

export interface SalaryDetailLocationEntry {
  location: string;
  minSalary: number;
  maxSalary: number;
  medianSalary: number;
  dataPoints: number;
}

export interface SalaryDetailCompanyEntry {
  company: string;
  minSalary: number;
  maxSalary: number;
  medianSalary: number;
  dataPoints: number;
}

export interface SalaryDetailPageModel {
  title: string;
  aggregated: {
    minSalary: number;
    maxSalary: number;
    medianSalary: number;
    currency: string;
    dataPoints: number;
  };
  byLocation: SalaryDetailLocationEntry[];
  byCompany: SalaryDetailCompanyEntry[];
  relatedTitles: SalaryTitleEntry[];
}
