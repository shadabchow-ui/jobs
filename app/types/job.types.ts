import type {
  JobFixture,
  Job,
  JobCompany,
  JobLocation,
  JobCategory,
  SalaryInsight,
  SavedJobState,
  JobSearchFilters,
  JobSearchResultPageModel,
  JobDetailPageModel,
} from "./page-model.types";

export type {
  JobFixture,
  Job,
  JobCompany,
  JobLocation,
  JobCategory,
  SalaryInsight,
  SavedJobState,
  JobSearchFilters,
  JobSearchResultPageModel,
  JobDetailPageModel,
};

export interface JobListingPageData {
  jobs: JobFixture[];
  selectedJob: JobFixture | null;
  query: string;
  location: string;
  remote: string;
  salary: string;
  jobType: string;
  experience: string;
  page: number;
  perPage: number;
  totalJobs: number;
  totalPages: number;
  sort: string;
}

export interface JobListingUrlParams {
  q: string | null;
  l: string | null;
  remote: string | null;
  salary: string | null;
  jobType: string | null;
  experience: string | null;
  page: string | null;
  sort: string | null;
}
