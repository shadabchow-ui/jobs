import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/cloudflare";
import { json } from "@remix-run/cloudflare";
import { useLoaderData } from "@remix-run/react";

import { CompanySearchHero, CompanyCard } from "~/components/companies";
import { loadCompanyDiscovery } from "~/loaders/company.loader.server";
import { getOpenJobCount } from "~/fixtures/companies.fixture";

import companyCss from "~/styles/company.css?url";

export function links() {
  return [{ rel: "stylesheet", href: companyCss }];
}

export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const query = url.searchParams.get("q");
  const data = loadCompanyDiscovery(query);
  return json(data);
}

export const meta: MetaFunction = () => [
  { title: "Companies — Jobs Board" },
  {
    name: "description",
    content: "Research companies, read reviews, and find open positions across every industry.",
  },
];

export default function Companies() {
  const { companies, query, totalCompanies } = useLoaderData<typeof loader>();

  return (
    <div className="companies-page">
      <CompanySearchHero query={query} />

      <section className="companies-page__results">
        <div className="companies-page__results-inner">
          <div className="companies-page__results-header">
            <h2 className="companies-page__results-title">
              {query
                ? `Companies matching "${query}"`
                : "Featured Companies"}
            </h2>
            <p className="companies-page__results-count">
              {totalCompanies.toLocaleString()} company{totalCompanies !== 1 ? "ies" : "y"}
            </p>
          </div>

          {totalCompanies === 0 ? (
            <div className="companies-page__empty">
              <p className="companies-page__empty-text">
                No companies found matching "{query}".
              </p>
              <a href="/companies" className="companies-page__empty-link">
                Browse all companies
              </a>
            </div>
          ) : (
            <div className="companies-page__grid">
              {companies.map((company) => (
                <CompanyCard
                  key={company.id}
                  company={company}
                  openJobCount={getOpenJobCount(company.slug)}
                />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
