import type { Job } from "~/types/page-model.types";
import { normalizeAdzunaResponse, type AdzunaRawResponse } from "~/lib/adzuna-normalizer";

// ---------------------------------------------------------------------------
// Adzuna env interface
// ---------------------------------------------------------------------------

export interface AdzunaEnv {
  ADZUNA_APP_ID?: string;
  ADZUNA_APP_KEY?: string;
  ADZUNA_COUNTRY?: string;
}

// ---------------------------------------------------------------------------
// Configuration — resolved at runtime from Cloudflare env or process.env fallback.
// ---------------------------------------------------------------------------

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

function resolveAdzunaConfig(env?: AdzunaEnv): {
  appId: string;
  appKey: string;
  country: string;
} {
  const appId =
    env?.ADZUNA_APP_ID ?? process.env.ADZUNA_APP_ID ?? "";
  const appKey =
    env?.ADZUNA_APP_KEY ?? process.env.ADZUNA_APP_KEY ?? "";
  const country =
    env?.ADZUNA_COUNTRY ?? process.env.ADZUNA_COUNTRY ?? "us";
  return { appId: String(appId), appKey: String(appKey), country };
}

function isConfigured(cfg: { appId: string; appKey: string }): boolean {
  return cfg.appId.length > 0 && cfg.appKey.length > 0;
}

function buildUrl(params: AdzunaSearchParams, cfg: { appId: string; appKey: string; country: string }): string {
  const page = Math.max(1, params.page ?? 1);
  const perPage = Math.max(1, Math.min(100, params.resultsPerPage ?? DEFAULT_PAGE_SIZE));

  const base = `${ADZUNA_BASE_URL}/jobs/${encodeURIComponent(cfg.country)}/search/${page}`;

  const qs = new URLSearchParams({
    app_id: cfg.appId,
    app_key: cfg.appKey,
    results_per_page: String(perPage),
    "content-type": "application/json",
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
 * @param env  Cloudflare Pages env (from context.cloudflare.env). Falls back to process.env.
 *
 * Returns null on any failure: missing credentials, non-2xx response, timeout,
 * network error, malformed JSON, or empty results.
 *
 * Keys are server-only — never exposed to the client bundle.
 */
export async function fetchAdzunaJobs(
  params: AdzunaSearchParams = {},
  env?: AdzunaEnv,
): Promise<{ jobs: Job[]; count: number } | null> {
  const cfg = resolveAdzunaConfig(env);
  if (!isConfigured(cfg)) return null;

  const url = buildUrl(params, cfg);

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

  const rawBody = raw as AdzunaRawResponse;
  const jobs = normalizeAdzunaResponse(rawBody);
  if (jobs.length === 0) return null;

  const count = typeof rawBody.count === "number" ? rawBody.count : jobs.length;

  return { jobs, count };
}

// ---------------------------------------------------------------------------
// Health / debug
// ---------------------------------------------------------------------------

export interface AdzunaHealthResult {
  configured: boolean;
  hasAppId: boolean;
  hasAppKey: boolean;
  country: string;
  status: number | null;
  ok: boolean;
  resultCount: number;
  errorType: string | null;
}

/**
 * Safe health check for Adzuna configuration and a minimal test request.
 *
 * Never returns raw credentials, the full request URL, or the raw response body.
 * Use this in a debug route to verify the Adzuna integration without exposing secrets.
 */
export async function getAdzunaHealth(env?: AdzunaEnv): Promise<AdzunaHealthResult> {
  const cfg = resolveAdzunaConfig(env);
  const hasAppId = cfg.appId.length > 0;
  const hasAppKey = cfg.appKey.length > 0;
  const configured = hasAppId && hasAppKey;

  const base: AdzunaHealthResult = {
    configured,
    hasAppId,
    hasAppKey,
    country: cfg.country,
    status: null,
    ok: false,
    resultCount: 0,
    errorType: null,
  };

  if (!configured) {
    return { ...base, errorType: "not_configured" };
  }

  const params: AdzunaSearchParams = {
    keyword: "developer",
    location: "New York",
    page: 1,
    resultsPerPage: 1,
  };

  const url = buildUrl(params, cfg);

  const response = await fetchWithTimeout(url);
  if (!response) {
    return { ...base, errorType: "network_error" };
  }

  base.status = response.status;
  base.ok = response.ok;

  if (!response.ok) {
    return { ...base, errorType: "http_error" };
  }

  let raw: unknown;
  try {
    raw = await response.json();
  } catch {
    return { ...base, errorType: "parse_error" };
  }

  if (!raw || typeof raw !== "object") {
    return { ...base, errorType: "parse_error" };
  }

  const body = raw as Record<string, unknown>;
  const results = Array.isArray(body.results) ? body.results : [];
  base.resultCount = results.length;

  if (results.length === 0) {
    return { ...base, errorType: "empty_result" };
  }

  return base;
}
