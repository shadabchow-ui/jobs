

interface CompanySearchHeroProps {
  query: string | null;
}

export function CompanySearchHero({ query }: CompanySearchHeroProps) {
  return (
    <section className="company-hero">
      <div className="company-hero__inner">
        <h1 className="company-hero__title">Discover Companies</h1>
        <p className="company-hero__subtitle">
          Research company profiles, read reviews, and find open positions.
        </p>
        <form
          className="company-hero__search"
          method="get"
          action="/companies"
          role="search"
          aria-label="Search companies"
        >
          <div className="company-hero__search-fields">
            <input
              type="search"
              name="q"
              defaultValue={query ?? ""}
              placeholder="Search by company name, industry, or location"
              className="company-hero__search-input"
              aria-label="Search companies"
            />
            <button type="submit" className="company-hero__search-btn">
              Search
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
