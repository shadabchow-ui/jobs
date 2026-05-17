import { Link, useSearchParams } from "@remix-run/react";
import type { SavedJobState } from "~/types/page-model.types";

export type SavedJobTab = "saved" | "applied" | "interviewing" | "offers" | "archived";

export const TAB_LABELS: Record<SavedJobTab, string> = {
  saved: "Saved",
  applied: "Applied",
  interviewing: "Interviewing",
  offers: "Offers",
  archived: "Archived",
};

export const TAB_STATES: Record<SavedJobTab, SavedJobState[]> = {
  saved: ["saved"],
  applied: ["applied"],
  interviewing: ["interviewing"],
  offers: ["offered"],
  archived: ["archived", "rejected"],
};

interface MyJobTabsProps {
  activeTab: SavedJobTab;
  tabCounts: Record<SavedJobTab, number>;
}

export function MyJobTabs({ activeTab, tabCounts }: MyJobTabsProps) {
  const [searchParams] = useSearchParams();

  const tabs: SavedJobTab[] = ["saved", "applied", "interviewing", "offers", "archived"];

  return (
    <nav className="my-jobs-tabs" role="tablist" aria-label="Job status tabs">
      {tabs.map((tab) => {
        const isActive = tab === activeTab;
        const next = new URLSearchParams(searchParams);
        next.set("tab", tab);
        return (
          <Link
            key={tab}
            to={`/my-jobs?${next.toString()}`}
            role="tab"
            aria-selected={isActive}
            className={`my-jobs-tab${isActive ? " my-jobs-tab--active" : ""}`}
          >
            {TAB_LABELS[tab]}
            <span className="my-jobs-tab__count">{tabCounts[tab]}</span>
          </Link>
        );
      })}
    </nav>
  );
}
