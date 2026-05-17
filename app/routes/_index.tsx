import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/cloudflare";
import { json } from "@remix-run/cloudflare";
import { Link, useLoaderData } from "@remix-run/react";
import { JOBS_FIXTURES } from "~/fixtures/jobs.fixture";

export async function loader({ request }: LoaderFunctionArgs) {
  const featuredJobs = JOBS_FIXTURES.slice(0, 6);
  return json({ currentUrl: request.url, featuredJobs });
}

export const meta: MetaFunction = () => [
  { title: "Jobs Board — Find Your Next Career Opportunity" },
  {
    name: "description",
    content: "Search millions of jobs across every industry. Compare salaries, research companies, and get AI-powered career guidance.",
  },
];

const POPULAR_SEARCHES = [
  { label: "Remote jobs", href: "/jobs?q=remote" },
  { label: "Part-time jobs", href: "/jobs?q=part-time" },
  { label: "Software engineer", href: "/jobs?q=software+engineer" },
  { label: "Data analyst", href: "/jobs?q=data+analyst" },
  { label: "Customer service", href: "/jobs?q=customer+service" },
  { label: "Healthcare", href: "/jobs?q=healthcare" },
  { label: "Warehouse", href: "/jobs?q=warehouse" },
];

function formatTimeAgo(isoDate: string): string {
  const now = Date.now();
  const then = new Date(isoDate).getTime();
  const diffDays = Math.floor((now - then) / (1000 * 60 * 60 * 24));
  if (diffDays < 1) return "Today";
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays}d ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)}w ago`;
  return `${Math.floor(diffDays / 30)}mo ago`;
}

export default function Index() {
  const { featuredJobs } = useLoaderData<typeof loader>();

  return (
    <div className="homepage">
      <section className="hero" aria-label="Job search">
        <div className="hero__inner">
          <h1 className="hero__title">Find the job that fits your life</h1>
          <p className="hero__subtitle">
            Search millions of jobs across every industry and experience level.
          </p>

          <form className="hero__search" method="get" action="/jobs" role="search" aria-label="Search jobs">
            <div className="hero__search-fields">
              <label htmlFor="hero-keyword" className="sr-only">Keywords</label>
              <input
                id="hero-keyword"
                type="search"
                name="q"
                placeholder="Job title, keywords, or company"
                className="hero__search-input"
                autoComplete="off"
              />
              <label htmlFor="hero-location" className="sr-only">Location</label>
              <input
                id="hero-location"
                type="text"
                name="location"
                placeholder="City, state, or remote"
                className="hero__search-input"
                autoComplete="off"
              />
              <button type="submit" className="hero__search-btn" aria-label="Find Jobs">
                Find Jobs
              </button>
            </div>
          </form>
        </div>
      </section>

      <section className="popular-searches" aria-label="Popular job searches">
        <div className="popular-searches__inner">
          <h2 className="popular-searches__heading">Popular Searches</h2>
          <div className="popular-searches__links">
            {POPULAR_SEARCHES.map((s) => (
              <Link key={s.href} to={s.href} className="popular-searches__link">
                {s.label}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {featuredJobs.length > 0 && (
        <section className="featured-jobs" aria-label="Featured jobs">
          <div className="featured-jobs__inner">
            <h2 className="featured-jobs__heading">Featured Jobs</h2>
            <div className="featured-jobs__grid">
              {featuredJobs.map((job) => (
                <Link key={job.id} to={`/jobs/${job.slug}`} className="featured-jobs__card">
                  <div className="featured-jobs__card-header">
                    <h3 className="featured-jobs__card-title">{job.title}</h3>
                    <span className="featured-jobs__card-company">{job.company}</span>
                  </div>
                  <div className="featured-jobs__card-meta">
                    <span className="featured-jobs__card-location">
                      {job.location}
                      {job.remote && <span className="featured-jobs__card-remote-badge">Remote</span>}
                    </span>
                    {job.salaryRange && (
                      <span className="featured-jobs__card-salary">{job.salaryRange}</span>
                    )}
                  </div>
                  <p className="featured-jobs__card-desc">{job.description}</p>
                  <div className="featured-jobs__card-footer">
                    {job.jobType && <span className="featured-jobs__card-type">{job.jobType}</span>}
                    <span className="featured-jobs__card-posted">{formatTimeAgo(job.postedAt)}</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="discovery-ctas" aria-label="Company and salary discovery">
        <div className="discovery-ctas__inner">
          <h2 className="discovery-ctas__heading">Discover More</h2>
          <div className="discovery-ctas__grid">
            <Link to="/companies" className="discovery-ctas__card">
              <span className="discovery-ctas__card-label">Explore Companies</span>
              <span className="discovery-ctas__card-sub">Research top employers</span>
            </Link>
            <Link to="/salaries" className="discovery-ctas__card">
              <span className="discovery-ctas__card-label">Browse Salaries</span>
              <span className="discovery-ctas__card-sub">Compare pay by role and location</span>
            </Link>
          </div>
        </div>
      </section>

      <section className="ai-teaser" aria-label="AI career tools and profile">
        <div className="ai-teaser__inner">
          <div className="ai-teaser__grid">
            <div className="ai-teaser__card">
              <h2 className="ai-teaser__heading">AI-Powered Career Tools</h2>
              <p className="ai-teaser__body">
                Get personalized career insights, resume feedback, salary benchmarks, and job matches powered by AI.
              </p>
              <Link to="/ai-career-tools" className="ai-teaser__cta">
                Explore AI Tools
              </Link>
            </div>
            <div className="ai-teaser__card ai-teaser__card--profile">
              <h2 className="ai-teaser__heading">Your Profile</h2>
              <p className="ai-teaser__body">
                Upload your resume and let employers find you. Track applications and get personalized job alerts.
              </p>
              <Link to="/profile" className="ai-teaser__cta">
                Go to Profile
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
