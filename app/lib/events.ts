export const EVENT_NAMES = {
  PAGE_VIEW: "page_view",
  JOB_SEARCH: "job_search",
  JOB_VIEW: "job_view",
  JOB_SAVE: "job_save",
  JOB_APPLY: "job_apply",
  COMPANY_VIEW: "company_view",
  SALARY_VIEW: "salary_view",
  AI_TOOL_USE: "ai_tool_use",
} as const;

export type EventName = (typeof EVENT_NAMES)[keyof typeof EVENT_NAMES];

export interface BaseEvent {
  eventType: EventName;
  eventVersion: string;
  timestamp: number;
  sessionId: string;
}

export interface PageViewEvent extends BaseEvent {
  eventType: typeof EVENT_NAMES.PAGE_VIEW;
  path: string;
}

export interface JobSearchEvent extends BaseEvent {
  eventType: typeof EVENT_NAMES.JOB_SEARCH;
  query: string;
  location: string | null;
}

export interface JobViewEvent extends BaseEvent {
  eventType: typeof EVENT_NAMES.JOB_VIEW;
  jobId: string;
  source: string;
}

export function emitEvent(event: BaseEvent): void {
  if (typeof process !== "undefined" && process.env.NODE_ENV === "development") {
    console.debug("[event]", event.eventType, event.timestamp);
  }
}
