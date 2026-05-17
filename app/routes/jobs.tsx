import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/cloudflare";
import { json } from "@remix-run/cloudflare";
import { useLoaderData } from "@remix-run/react";

import { loadJobListing } from "~/loaders/jobs.loader.server";
import {
  JobCard,
  JobPreview,
  JobSearchBar,
  JobFilters,
  JobSortMenu,
  JobPagination,
  JobEmptyState,
} from "~/components/jobs";

import listingCss from "~/styles/listing.css?url";

export function links() {
  return [{ rel: "stylesheet", href: listingCss }];
}

export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const data = await loadJobListing(url);
  return json(data);
}

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  const query = data?.query;
  if (query) {
    return [
      { title: `${query} Jobs — Jobs Board` },
      { name: "description", content: `Browse ${data.totalJobs} job listings for "${query}".` },
    ];
  }
  return [
    { title: "Find Jobs — Jobs Board" },
    { name: "description", content: "Browse and search millions of job listings across every industry and location." },
  ];
};

export default function Jobs() {
  const data = useLoaderData<typeof loader>();
  const {
    jobs,
    selectedJob,
    query,
    location,
    remote,
    salary,
    jobType,
    experience,
    page,
    totalJobs,
    totalPages,
    sort,
    displayLabel,
  } = data;

  const filterCurrent = { remote, salary, jobType, experience };

  return (
    <div className="listing-page">
      <div className="listing-page__inner">
        <JobSearchBar query={query} location={location} sort={sort} totalJobs={totalJobs} />

        <div className="listing-page__controls">
          <div className="listing-page__controls-summary">
            {totalJobs > 0 ? (
              <p className="listing-page__controls-count">
                {totalJobs.toLocaleString()} job{totalJobs !== 1 ? "s" : ""} found
                {query ? <> for &ldquo;{query}&rdquo;</> : null}
                {location ? <> in {location}</> : null}
                {" "}<span className="listing-page__controls-source">{displayLabel}</span>
              </p>
            ) : (
              <p className="listing-page__controls-count">0 jobs found</p>
            )}
          </div>
          <div className="listing-page__controls-sort">
            <JobSortMenu current={sort} />
          </div>
        </div>

        <div className="listing-page__layout">
          <aside className="listing-page__filters" aria-label="Job filters">
            <JobFilters current={filterCurrent} />
          </aside>

          <div className="listing-page__main">
            {totalJobs === 0 ? (
              <JobEmptyState query={query} location={location} />
            ) : (
              <div className="listing-page__results">
                <div className="listing-page__results-list">
                  {jobs.map((job) => (
                    <div
                      key={job.id}
                      className={`listing-page__card-row${selectedJob?.id === job.id ? " listing-page__card-row--selected" : ""}`}
                    >
                      <JobCard job={job} isSelected={selectedJob?.id === job.id} />
                    </div>
                  ))}
                </div>

                <JobPagination
                  page={page}
                  totalPages={totalPages}
                  query={query}
                  location={location}
                  sort={sort}
                  remote={remote}
                  salary={salary}
                  jobType={jobType}
                  experience={experience}
                />
              </div>
            )}

            <div className="listing-page__ai-strip">
              <div className="listing-page__ai-card">
                <p className="listing-page__ai-title">AI summary available</p>
                <p className="listing-page__ai-body">Upload resume to see match</p>
              </div>
            </div>
          </div>

          <aside
            className="listing-page__preview"
            aria-label="Job preview panel"
          >
            <div className="listing-page__preview-sticky">
              <JobPreview job={selectedJob} />
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
