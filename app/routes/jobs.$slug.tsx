import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/cloudflare";
import { json } from "@remix-run/cloudflare";
import { useLoaderData, Link } from "@remix-run/react";

import { loadJobDetail } from "~/loaders/job-detail.loader.server";
import { JobDetailHeader } from "~/components/jobs/JobDetailHeader";
import { JobDetailContent } from "~/components/jobs/JobDetailContent";

export async function loader({ params }: LoaderFunctionArgs) {
  const slug = params.slug;
  if (!slug) {
    throw new Response("Job not found", { status: 404 });
  }

  const data = loadJobDetail(slug);
  if (!data) {
    throw new Response("Job not found", { status: 404 });
  }

  return json(data);
}

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  if (!data) {
    return [{ title: "Job not found — Jobs Board" }];
  }
  return [
    { title: `${data.job.title} at ${data.job.company} — Jobs Board` },
    {
      name: "description",
      content: data.job.description.slice(0, 160),
    },
  ];
};

export default function JobDetail() {
  const { job, company, similarJobs } = useLoaderData<typeof loader>();

  return (
    <div className="jd-page">
      <div className="jd-page__inner">
        <nav className="jd-page__breadcrumb" aria-label="Breadcrumb">
          <Link to="/jobs" className="jd-page__breadcrumb-link">
            Jobs
          </Link>
          <span className="jd-page__breadcrumb-sep" aria-hidden="true">
            /
          </span>
          <span className="jd-page__breadcrumb-current">
            {job.title}
          </span>
        </nav>

        <div className="jd-page__layout">
          <div className="jd-page__main">
            <JobDetailHeader job={job} />

            <JobDetailContent
              job={job}
              company={company}
              similarJobs={similarJobs}
            />
          </div>

          <aside className="jd-page__sidebar" aria-label="Job actions">
            <div className="jd-page__sidebar-sticky">
              <div className="jd-page__apply-card">
                {job.applyUrl ? (
                  <a
                    href={job.applyUrl}
                    className="jd-page__apply-btn"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Apply Now
                  </a>
                ) : (
                  <button className="jd-page__apply-btn" type="button">
                    Apply Now
                  </button>
                )}

                <button className="jd-page__save-btn" type="button">
                  Save Job
                </button>

                {job.applyUrl && (
                  <p className="jd-page__apply-note">
                    You will be redirected to the employer&apos;s website to complete
                    your application.
                  </p>
                )}
              </div>

              {company && (
                <div className="jd-page__company-card">
                  <h2 className="jd-page__company-card-title">About the Company</h2>
                  <Link
                    to={`/companies/${company.slug}`}
                    className="jd-page__company-card-name"
                  >
                    {company.name}
                  </Link>
                  <p className="jd-page__company-card-industry">
                    {company.industry}
                  </p>
                  <p className="jd-page__company-card-hq">
                    {company.headquarters}
                  </p>
                  <Link
                    to={`/companies/${company.slug}`}
                    className="jd-page__company-card-link"
                  >
                    View company profile →
                  </Link>
                </div>
              )}
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
