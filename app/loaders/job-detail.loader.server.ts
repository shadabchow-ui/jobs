import type { JobFixture, CompanyFixture } from "~/types/page-model.types";
import { getJobBySlug, JOBS_FIXTURES } from "~/fixtures/jobs.fixture";
import { getCompanyBySlug } from "~/fixtures/companies.fixture";

export interface JobDetailData {
  job: JobFixture;
  company: CompanyFixture | null;
  similarJobs: Array<{
    id: string;
    slug: string;
    title: string;
    company: string;
    location: string;
  }>;
}

export function loadJobDetail(slug: string): JobDetailData | null {
  const job = getJobBySlug(slug);
  if (!job) return null;

  const company = getCompanyBySlug(job.companySlug) ?? null;

  const similarJobs = JOBS_FIXTURES.filter(
    (j) =>
      j.id !== job.id &&
      j.tags.some((tag) => job.tags.includes(tag)),
  )
    .slice(0, 3)
    .map((j) => ({
      id: j.id,
      slug: j.slug,
      title: j.title,
      company: j.company,
      location: j.location,
    }));

  return { job, company, similarJobs };
}
