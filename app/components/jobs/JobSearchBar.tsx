interface JobSearchBarProps {
  query: string;
  location: string;
  sort: string;
  totalJobs: number;
}

export function JobSearchBar({ query, location, sort, totalJobs }: JobSearchBarProps) {
  return (
    <div className="job-search-bar" role="search" aria-label="Filter job listings">
      <form id="job-search-form" className="job-search-bar__form" method="get" action="/jobs">
        <input
          type="search"
          name="q"
          defaultValue={query}
          placeholder="Job title, keywords, or company"
          className="job-search-bar__input"
          aria-label="Search keywords"
        />
        <input
          type="text"
          name="l"
          defaultValue={location}
          placeholder="City, state, or remote"
          className="job-search-bar__input"
          aria-label="Location"
        />
        <input type="hidden" name="sort" value={sort} />
        <button type="submit" className="job-search-bar__btn">
          Search
        </button>
        <span className="job-search-bar__count" aria-live="polite">
          {totalJobs.toLocaleString()} jobs found
        </span>
      </form>
    </div>
  );
}
