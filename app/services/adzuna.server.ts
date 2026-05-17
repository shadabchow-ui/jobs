import type { Job } from "~/types/page-model.types";
import { normalizeAdzunaResponse } from "~/lib/adzuna-normalizer";

// ---------------------------------------------------------------------------
// Configuration — resolved from Cloudflare Worker env vars at module load.
// In local dev / Vitest these will be undefined; the service returns null safely.
// ---------------------------------------------------------------------------

const ADZUNA_APP_ID = String(process.env.ADZUNA_APP_ID ?? "");
const ADZUNA_APP_KEY = String(process.env.ADZUNA_APP_KEY ?? "");
const ADZUNA_COUNTRY = String(process.env.ADZUNA_COUNTRY ?? "us");

const ADZUNA_BASE_URL = "https://api.adzuna.com/v1/api";

const INTERNAL_TIMEOUT_MS = 10000;
const DEFAULT_PAGE_SIZE = 20;

// ---------------------------------------------------------------------------
// Params
// ---------------------------------------------------------------------------

export interface AdzunaSearchParams {
  keyword?: string | null;
  location?: string | null;
  page?: number;
  resultsPerPage?: number;
}

// ---------------------------------------------------------------------------
// Internal helpers
// ---------------------------------------------------------------------------

function isConfigured(): boolean {
  return ADZUNA_APP_ID.length > 0 && ADZUNA_APP_KEY.length > 0;
}

function buildUrl(params: AdzunaSearchParams): string {
  const page = Math.max(1, params.page ?? 1);
  const perPage = Math.max(1, Math.min(100, params.resultsPerPage ?? DEFAULT_PAGE_SIZE));

  const base = `${ADZUNA_BASE_URL}/jobs/${encodeURIComponent(ADZUNA_COUNTRY)}/search/${page}`;

  const qs = new URLSearchParams({
    app_id: ADZUNA_APP_ID,
    app_key: ADZUNA_APP_KEY,
    results_per_page: String(perPage),
    content_type: "application/json",
  });

  if (params.keyword && params.keyword.trim()) {
    qs.set("what", params.keyword.trim());
  }
  if (params.location && params.location.trim()) {
    qs.set("where", params.location.trim());
  }

  return `${base}?${qs.toString()}`;
}

async function fetchWithTimeout(url: string): Promise<Response | null> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), INTERNAL_TIMEOUT_MS);
  try {
    const response = await fetch(url, {
      headers: { Accept: "application/json" },
      signal: controller.signal,
    });
    return response;
  } catch {
    return null;
  } finally {
    clearTimeout(timer);
  }
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * Fetch and normalize jobs from the Adzuna API.
 *
 * Returns null on any failure: missing credentials, non-2xx response, timeout,
 * network error, malformed JSON, or empty results.
 *
 * Keys are server-only — never exposed to the client bundle.
 */
export async function fetchAdzunaJobs(params: AdzunaSearchParams = {}): Promise<Job[] | null> {
  if (!isConfigured()) return null;

  const url = buildUrl(params);

  const response = await fetchWithTimeout(url);
  if (!response) return null;
  if (!response.ok) return null;

  let raw: unknown;
  try {
    raw = await response.json();
  } catch {
    return null;
  }

  if (!raw || typeof raw !== "object") return null;

  const jobs = normalizeAdzunaResponse(raw as Record<string, unknown>);
  if (jobs.length === 0) return null;

  return jobs;
}
