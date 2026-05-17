import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/cloudflare";
import { json } from "@remix-run/cloudflare";
import { useLoaderData, Link } from "@remix-run/react";

import { SalaryDetailHeader, SalaryDetailContent } from "~/components/salaries";
import { loadSalaryDetail } from "~/loaders/salary.loader.server";

import salariesCss from "~/styles/salaries.css?url";

export function links() {
  return [{ rel: "stylesheet", href: salariesCss }];
}

export async function loader({ params }: LoaderFunctionArgs) {
  const titleSlug = params.title;
  if (!titleSlug) {
    throw new Response("Salary data not found", { status: 404 });
  }

  const data = loadSalaryDetail(titleSlug);
  if (!data) {
    throw new Response("Salary data not found", { status: 404 });
  }

  return json(data);
}

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  if (!data) {
    return [{ title: "Salary data not found — Jobs Board" }];
  }
  return [
    { title: `${data.title} Salary Insights — Jobs Board` },
    {
      name: "description",
      content: `View salary ranges for ${data.title} by location and company. Median: ${data.aggregated.medianSalary}.`,
    },
  ];
};

export default function SalaryDetail() {
  const { title, aggregated, byLocation, byCompany, relatedTitles } =
    useLoaderData<typeof loader>();

  return (
    <div className="salary-detail-page">
      <div className="salary-detail-page__inner">
        <nav className="salary-detail-page__breadcrumb" aria-label="Breadcrumb">
          <Link to="/salaries" className="salary-detail-page__breadcrumb-link">
            Salary Insights
          </Link>
          <span className="salary-detail-page__breadcrumb-sep" aria-hidden="true">
            /
          </span>
          <span className="salary-detail-page__breadcrumb-current">{title}</span>
        </nav>

        <SalaryDetailHeader
          title={title}
          minSalary={aggregated.minSalary}
          maxSalary={aggregated.maxSalary}
          medianSalary={aggregated.medianSalary}
          currency={aggregated.currency}
          dataPoints={aggregated.dataPoints}
        />

        <SalaryDetailContent
          byLocation={byLocation}
          byCompany={byCompany}
          relatedTitles={relatedTitles}
        />
      </div>
    </div>
  );
}
