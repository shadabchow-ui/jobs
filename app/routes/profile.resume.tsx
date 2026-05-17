import type { MetaFunction } from "@remix-run/cloudflare";
import { json } from "@remix-run/cloudflare";
import { Link, useLoaderData } from "@remix-run/react";

import { getProfileDashboard } from "~/fixtures/profile.fixture";
import { AccountPageLayout } from "~/components/shell/AccountPageLayout";
import { ResumeUpload, ResumeAiActions } from "~/components/profile";

export async function loader() {
  const dashboard = getProfileDashboard("user-001");
  return json(dashboard);
}

export const meta: MetaFunction = () => [
  { title: "Resume — Jobs Board" },
  {
    name: "description",
    content: "Upload and manage your resume. Use AI tools to parse skills, extract experience, and match to jobs.",
  },
];

export default function ProfileResume() {
  const data = useLoaderData<typeof loader>();

  return (
    <AccountPageLayout title="Resume">
      <div className="profile-page">
        <nav className="profile-resume__breadcrumb" aria-label="Breadcrumb">
          <Link to="/profile" className="profile-resume__breadcrumb-link">
            Profile
          </Link>
          <span className="profile-resume__breadcrumb-sep" aria-hidden="true">/</span>
          <span className="profile-resume__breadcrumb-current">Resume</span>
        </nav>

        <ResumeUpload resume={data.resume} />

        <ResumeAiActions
          resume={data.resume}
          hasParsedData={!!(data.resume?.parsedAt)}
        />
      </div>
    </AccountPageLayout>
  );
}
