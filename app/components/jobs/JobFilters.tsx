interface JobFiltersProps {
  current: {
    remote: string;
    salary: string;
    jobType: string;
    experience: string;
  };
}

export function JobFilters({ current }: JobFiltersProps) {
  return (
    <aside className="job-filters" aria-label="Job filters">
      <h2 className="job-filters__heading">Filters</h2>

      <fieldset className="job-filters__group">
        <legend className="job-filters__label">Remote</legend>
        <div className="job-filters__options">
          <label className="job-filters__option">
            <input
              type="checkbox"
              name="remote"
              value="1"
              defaultChecked={current.remote === "1"}
              form="job-search-form"
            />
            Remote jobs only
          </label>
        </div>
      </fieldset>

      <fieldset className="job-filters__group">
        <legend className="job-filters__label">Job Type</legend>
        <div className="job-filters__options">
          {["full-time", "part-time", "contract", "internship"].map((type) => (
            <label key={type} className="job-filters__option">
              <input
                type="radio"
                name="jobType"
                value={type}
                defaultChecked={current.jobType === type}
                form="job-search-form"
              />
              {type.replace("-", " ").replace(/\b\w/g, (c) => c.toUpperCase())}
            </label>
          ))}
        </div>
      </fieldset>

      <noscript>
        <button type="submit" form="job-search-form" className="job-filters__submit">
          Apply Filters
        </button>
      </noscript>
    </aside>
  );
}
