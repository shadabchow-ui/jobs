import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/cloudflare";
import { json } from "@remix-run/cloudflare";
import { useLoaderData, Link } from "@remix-run/react";

import { CompanyHeader, CompanyProfileContent } from "~/components/companies";
import { loadCompanyProfile } from "~/loaders/company.loader.server";

import companyCss from "~/styles/company.css?url";

export function links() {
  return [{ rel: "stylesheet", href: companyCss }];
}

export async function loader({ params }: LoaderFunctionArgs) {
  const slug = params.slug;
  if (!slug) {
    throw new Response("Company not found", { status: 404 });
  }

  const data = loadCompanyProfile(slug);
  if (!data) {
    throw new Response("Company not found", { status: 404 });
  }

  return json(data);
}

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  if (!data) {
    return [{ title: "Company not found — Jobs Board" }];
  }
  return [
    { title: `${data.company.name} — Jobs Board` },
    {
      name: "description",
      content: data.company.description.slice(0, 160),
    },
  ];
};

export default function CompanyProfile() {
  const { company, jobs, salaryRoles, similarCompanies } =
    useLoaderData<typeof loader>();

  return (
    <div className="company-profile-page">
      <div className="company-profile-page__inner">
        <nav className="company-profile-page__breadcrumb" aria-label="Breadcrumb">
          <Link to="/companies" className="company-profile-page__breadcrumb-link">
            Companies
          </Link>
          <span className="company-profile-page__breadcrumb-sep" aria-hidden="true">
            /
          </span>
          <span className="company-profile-page__breadcrumb-current">
            {company.name}
          </span>
        </nav>

        <CompanyHeader company={company} />

        <CompanyProfileContent
          company={company}
          jobs={jobs.map((j) => ({
            ...j,
            tags: [],
            source: "fixture",
            company: company.name,
            companySlug: company.slug,
            postedAt: new Date().toISOString(),
            jobType: null,
            responsibilities: [],
            requirements: [],
            benefits: [],
            applyUrl: null,
            aiSummary: null,
            detectedSkills: null,
            seniority: null,
            remoteType: null,
            salaryNote: null,
            matchScore: null,
            matchedSkills: null,
            missingSkills: null,
            jobQualityScore: null,
          }))}
          salaryRoles={salaryRoles}
          similarCompanies={similarCompanies}
        />
      </div>
    </div>
  );
}
