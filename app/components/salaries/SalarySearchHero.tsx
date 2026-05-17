interface SalarySearchHeroProps {
  query: string | null;
}

export function SalarySearchHero({ query }: SalarySearchHeroProps) {
  return (
    <section className="salary-hero">
      <div className="salary-hero__inner">
        <h1 className="salary-hero__title">Salary Insights</h1>
        <p className="salary-hero__subtitle">
          Research salary ranges by role, location, and company.
        </p>
        <form
          className="salary-hero__search"
          method="get"
          action="/salaries"
          role="search"
          aria-label="Search salary data"
        >
          <div className="salary-hero__search-fields">
            <input
              type="search"
              name="q"
              defaultValue={query ?? ""}
              placeholder="Search by job title, company, or location"
              className="salary-hero__search-input"
              aria-label="Search salary data"
            />
            <button type="submit" className="salary-hero__search-btn">
              Search
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
