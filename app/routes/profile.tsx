import type { MetaFunction } from "@remix-run/cloudflare";
import { json } from "@remix-run/cloudflare";
import { useLoaderData } from "@remix-run/react";

import type { ProfileDashboardData } from "~/types/profile.types";
import { getProfileDashboard } from "~/fixtures/profile.fixture";
import { getSavedJobsForUser } from "~/fixtures/saved-jobs.fixture";
import { AccountPageLayout } from "~/components/shell/AccountPageLayout";
import {
  ProfileSummary,
  ProfilePreferencesForm,
  ProfileSkillsPlaceholder,
  ProfileLinks,
} from "~/components/profile";

export async function loader() {
  const dashboard = getProfileDashboard("user-001");
  const savedEntries = getSavedJobsForUser("user-001");

  const enriched: ProfileDashboardData = {
    ...dashboard,
    savedJobCount: savedEntries.length,
    applicationCount: savedEntries.filter((e) => e.savedState === "applied").length,
    interviewCount: savedEntries.filter((e) => e.savedState === "interviewing").length,
    offerCount: savedEntries.filter((e) => e.savedState === "offered").length,
  };

  return json(enriched);
}

export const meta: MetaFunction = () => [
  { title: "Profile — Jobs Board" },
  {
    name: "description",
    content: "Manage your profile, job preferences, skills, resume, and account settings.",
  },
];

export default function Profile() {
  const data = useLoaderData<typeof loader>();

  return (
    <AccountPageLayout title="Profile">
      <div className="profile-page">
        <ProfileSummary
          profile={data.profile}
          savedJobCount={data.savedJobCount}
          applicationCount={data.applicationCount}
          interviewCount={data.interviewCount}
          offerCount={data.offerCount}
        />

        <ProfilePreferencesForm preferences={data.preferences} />

        <ProfileSkillsPlaceholder skills={data.skills} />

        <ProfileLinks resume={data.resume} />
      </div>
    </AccountPageLayout>
  );
}
