import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/cloudflare";
import { json } from "@remix-run/cloudflare";
import { Link, useLoaderData } from "@remix-run/react";

import type { JobFixture } from "~/types/page-model.types";
import type { SavedJobEntry } from "~/fixtures/saved-jobs.fixture";
import { getSavedJobsForUser } from "~/fixtures/saved-jobs.fixture";
import { getJobBySlug } from "~/fixtures/jobs.fixture";
import { MyJobCard, MyJobTabs, AiNextStepCard } from "~/components/my-jobs";
import type { SavedJobTab } from "~/components/my-jobs";
import { TAB_STATES } from "~/components/my-jobs";

const VALID_TABS: SavedJobTab[] = ["saved", "applied", "interviewing", "offers", "archived"];

interface LoadedEntry {
  savedEntry: SavedJobEntry;
  job: JobFixture;
}

interface MyJobsLoaderData {
  tab: SavedJobTab;
  entries: LoadedEntry[];
  tabCounts: Record<SavedJobTab, number>;
}

export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const rawTab = url.searchParams.get("tab") ?? "saved";
  const tab: SavedJobTab = VALID_TABS.includes(rawTab as SavedJobTab)
    ? (rawTab as SavedJobTab)
    : "saved";

  const savedEntries = getSavedJobsForUser("user-001");
  const matchedStates = TAB_STATES[tab];
  const filtered = savedEntries.filter((e) => matchedStates.includes(e.savedState));

  const entries: LoadedEntry[] = filtered
    .map((e) => {
      const job = getJobBySlug(e.jobSlug);
      return job ? { savedEntry: e, job } : null;
    })
    .filter((e): e is LoadedEntry => e !== null);

  const tabCounts = {} as Record<SavedJobTab, number>;
  for (const t of VALID_TABS) {
    const states = TAB_STATES[t];
    tabCounts[t] = savedEntries.filter((e) => states.includes(e.savedState)).length;
  }

  return json<MyJobsLoaderData>({ tab, entries, tabCounts });
}

export const meta: MetaFunction = () => [
  { title: "My Jobs — Jobs Board" },
  {
    name: "description",
    content: "View your saved jobs, applications, interviews, offers, and archived listings.",
  },
];

export default function MyJobs() {
  const { tab, entries, tabCounts } = useLoaderData<typeof loader>();

  return (
    <div className="my-jobs-page">
      <div className="my-jobs-page__inner">
        <div className="my-jobs-page__header">
          <h1 className="my-jobs-page__title">My Jobs</h1>
          <p className="my-jobs-page__subtitle">Track and manage your job applications</p>
        </div>

        <MyJobTabs activeTab={tab} tabCounts={tabCounts} />

        {entries.length === 0 ? (
          <EmptyState tab={tab} />
        ) : (
          <>
            <div className="my-jobs-list" role="list">
              {entries.map(({ savedEntry, job }) => (
                <div key={savedEntry.jobId} role="listitem">
                  <MyJobCard savedEntry={savedEntry} job={job} />
                </div>
              ))}
            </div>

            <AiNextStepCard />
          </>
        )}
      </div>
    </div>
  );
}

function EmptyState({ tab }: { tab: SavedJobTab }) {
  const messages: Record<SavedJobTab, { heading: string; body: string }> = {
    saved: {
      heading: "No saved jobs yet",
      body: "Jobs you save will appear here. Start browsing to find roles that interest you.",
    },
    applied: {
      heading: "No applications yet",
      body: "Jobs you apply to will appear here. Track your progress as you apply.",
    },
    interviewing: {
      heading: "No interviews scheduled",
      body: "When employers reach out for interviews, those jobs will appear here.",
    },
    offers: {
      heading: "No offers yet",
      body: "Job offers you receive will appear here. Keep applying and interviewing.",
    },
    archived: {
      heading: "No archived jobs",
      body: "Jobs you archive will appear here. Archived jobs are moved from your active lists.",
    },
  };

  const msg = messages[tab];

  return (
    <div className="my-jobs-empty" role="status">
      <span className="my-jobs-empty__icon" aria-hidden="true">
        {tab === "saved" ? "\u2606" : tab === "applied" ? "\u2709" : tab === "interviewing" ? "\u260E" : tab === "offers" ? "\u2705" : "\uD83D\uDDC2"}
      </span>
      <h2 className="my-jobs-empty__heading">{msg.heading}</h2>
      <p className="my-jobs-empty__body">{msg.body}</p>
      <Link to="/jobs" className="my-jobs-empty__link">
        Browse Jobs
      </Link>
    </div>
  );
}
