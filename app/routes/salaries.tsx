import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/cloudflare";
import { json } from "@remix-run/cloudflare";
import { useLoaderData, Link } from "@remix-run/react";

import { SalarySearchHero, SalaryCard } from "~/components/salaries";
import { loadSalarySearch } from "~/loaders/salary.loader.server";

import salariesCss from "~/styles/salaries.css?url";

export function links() {
  return [{ rel: "stylesheet", href: salariesCss }];
}

export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const query = url.searchParams.get("q");
  return json(loadSalarySearch(query));
}

export const meta: MetaFunction = () => [
  { title: "Salary Insights — Jobs Board" },
  {
    name: "description",
    content:
      "Research salary ranges by job title, location, and company. Compare compensation across roles.",
  },
];

export default function Salaries() {
  const { query, totalResults, results, popularTitles } =
    useLoaderData<typeof loader>();

  return (
    <div className="salaries-page">
      <SalarySearchHero query={query} />

      {!query && popularTitles.length > 0 && (
        <section className="salaries-page__popular">
          <div className="salaries-page__popular-inner">
            <h2 className="salaries-page__popular-title">Popular Searches</h2>
            <div className="salaries-page__popular-list">
              {popularTitles.map((t) => (
                <Link
                  key={t.titleSlug}
                  to={`/salaries/${t.titleSlug}`}
                  className="salaries-page__popular-link"
                >
                  {t.title}
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="salaries-page__results">
        <div className="salaries-page__results-inner">
          {query && (
            <div className="salaries-page__results-header">
              <h2 className="salaries-page__results-title">Results</h2>
              <span className="salaries-page__results-count">
                {totalResults.toLocaleString()} role{totalResults !== 1 ? "s" : ""} found
              </span>
            </div>
          )}

          {results.length > 0 ? (
            <div className="salaries-page__grid">
              {results.map((entry) => (
                <SalaryCard key={entry.titleSlug} entry={entry} />
              ))}
            </div>
          ) : (
            <div className="salaries-page__empty">
              <p className="salaries-page__empty-text">
                No salary data found for "{query}". Try searching for a different job
                title, company, or location.
              </p>
              <Link to="/salaries" className="salaries-page__empty-link">
                Browse all roles
              </Link>
            </div>
          )}
        </div>
      </section>

      <section className="salaries-page__disclaimer">
        <div className="salaries-page__disclaimer-inner">
          <p className="salaries-page__disclaimer-text">
            Salary data shown is based on sample estimates and may not reflect current
            market rates. Data is for informational purposes only.
          </p>
        </div>
      </section>
    </div>
  );
}
