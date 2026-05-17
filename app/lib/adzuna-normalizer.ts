import type { Job } from "~/types/page-model.types";

// ---------------------------------------------------------------------------
// Raw Adzuna API response shapes — not exported as app contracts.
// ---------------------------------------------------------------------------

export interface AdzunaRawResult {
  id: number | string;
  title: string;
  company: { display_name?: string } | null;
  location: { display_name?: string; area?: (string | null)[] } | null;
  salary_min?: number | null;
  salary_max?: number | null;
  salary_is_predicted?: number | null;
  salary_currency?: string | null;
  category?: { label?: string; tag?: string } | null;
  redirect_url?: string | null;
  created?: string | null;
  description?: string | null;
  contract_type?: string | null;
  contract_time?: string | null;
}

export interface AdzunaRawResponse {
  results?: AdzunaRawResult[] | null;
  count?: number;
}

// ---------------------------------------------------------------------------
// Dedupe key policy
// ---------------------------------------------------------------------------

export const ADZUNA_SOURCE_NAME = "adzuna";

export function buildAdzunaSourceId(rawId: number | string): string {
  return String(rawId);
}

export function buildAdzunaAppId(rawId: number | string): string {
  return `${ADZUNA_SOURCE_NAME}:${buildAdzunaSourceId(rawId)}`;
}

export function isAdzunaSource(job: Job): boolean {
  return job.source === ADZUNA_SOURCE_NAME;
}

// ---------------------------------------------------------------------------
// Adzuna category tag → fixture category id mapping
// ---------------------------------------------------------------------------

const ADZUNA_CAT_MAP: Record<string, string> = {
  "it-jobs": "cat-001",
  "engineering": "cat-001",
  "software": "cat-001",
  "data-science-jobs": "cat-002",
  "data-analytics-jobs": "cat-009",
  "creative-design-jobs": "cat-003",
  "product-management-jobs": "cat-004",
  "product": "cat-004",
  "pr-accounting-finance-jobs": "cat-006",
  "sales-jobs": "cat-004",
  "marketing-jobs": "cat-005",
  "security-jobs": "cat-008",
  "devops-jobs": "cat-007",
  "healthcare-nursing-jobs": "cat-006",
  "customer-services-jobs": "cat-006",
  "logistics-warehouse-jobs": "cat-006",
  "hr-jobs": "cat-006",
  "teaching-jobs": "cat-006",
  "legal-jobs": "cat-006",
  "construction-jobs": "cat-006",
  "manufacturing-jobs": "cat-006",
  "retail-jobs": "cat-006",
  "travel-jobs": "cat-006",
};

const DEFAULT_CATEGORY_ID = "cat-006";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function safeStr(v: unknown): string {
  return typeof v === "string" ? v : "";
}

function slugify(s: string): string {
  return s
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "") || "unknown";
}

function guessLocationRemote(display: string): boolean {
  const lower = display.toLowerCase();
  return lower.includes("remote") || lower.includes("anywhere") || lower.includes("work from home");
}

function guessLocationOnsite(display: string): boolean {
  return display.length > 0 && !guessLocationRemote(display);
}

function parseSalaryMin(raw: AdzunaRawResult): number | null {
  if (typeof raw.salary_min === "number" && Number.isFinite(raw.salary_min) && raw.salary_min >= 0) {
    return raw.salary_min;
  }
  return null;
}

function parseSalaryMax(raw: AdzunaRawResult): number | null {
  if (typeof raw.salary_max === "number" && Number.isFinite(raw.salary_max) && raw.salary_max >= 0) {
    return raw.salary_max;
  }
  return null;
}

function buildDisplayRange(raw: AdzunaRawResult): string | null {
  const min = parseSalaryMin(raw);
  const max = parseSalaryMax(raw);
  const currency = safeStr(raw.salary_currency) || "USD";

  if (min === null && max === null) return null;

  const fmt = (n: number): string =>
    n >= 1000 ? `${currency} ${Math.round(n / 1000)}K` : `${currency} ${n}`;

  if (min !== null && max !== null && min !== max) {
    return `${fmt(min)} – ${fmt(max)}`;
  }
  if (min !== null) return fmt(min);
  return fmt(max!);
}

function guessPeriod(raw: AdzunaRawResult): "yearly" | "monthly" | "hourly" {
  const title = safeStr(raw.title).toLowerCase();
  const description = safeStr(raw.description).toLowerCase();
  const combined = `${title} ${description}`;

  if (/\bper\s*hour\b|\b\/hr\b|\b\$\d+\.\d{2}\s*hr/i.test(combined)) return "hourly";
  if (/\bmonthly\b|\bper\s*month\b/i.test(combined)) return "monthly";
  return "yearly";
}

function parsePostedDate(raw: AdzunaRawResult): string {
  return safeStr(raw.created) || new Date().toISOString();
}

function mapAdzunaCategoryTag(tag: string | null | undefined): string[] {
  if (!tag) return [DEFAULT_CATEGORY_ID];
  const mapped = ADZUNA_CAT_MAP[tag.toLowerCase()];
  return mapped ? [mapped] : [DEFAULT_CATEGORY_ID];
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * Normalize a single raw Adzuna result into the app-owned `Job` model.
 * Never throws — returns null only if the result has no usable id or title.
 */
export function normalizeAdzunaJob(raw: AdzunaRawResult, index: number = 0): Job | null {
  const rawId = raw.id ?? index;
  const sourceId = buildAdzunaSourceId(rawId);
  const appId = buildAdzunaAppId(rawId);

  const title = safeStr(raw.title).trim();
  if (!title) return null;

  const companyName = safeStr(raw.company?.display_name).trim() || "Unknown Company";
  const companySlug = slugify(companyName);

  const locationDisplay = safeStr(raw.location?.display_name).trim();
  const areaParts = raw.location?.area ?? [];
  const area0 = typeof areaParts[0] === "string" ? areaParts[0] : null;
  const area1 = typeof areaParts[1] === "string" ? areaParts[1] : null;
  const area2 = typeof areaParts[2] === "string" ? areaParts[2] : null;
  const city = area0 ? area0.trim() : locationDisplay || "Unknown";
  const state = area1 ? area1.trim() : null;
  const country = area2 ? area2.trim() : "US";

  const isRemote = guessLocationRemote(locationDisplay || city);
  const isOnsite = guessLocationOnsite(locationDisplay || city);

  const salaryMin = parseSalaryMin(raw);
  const salaryMax = parseSalaryMax(raw);
  const displayRange = buildDisplayRange(raw);

  const description = safeStr(raw.description).trim() || "No description provided.";

  const categoryId = raw.category?.tag;
  const categoryIds = mapAdzunaCategoryTag(categoryId);

  const createdAt = parsePostedDate(raw);

  const contractType = safeStr(raw.contract_type);
  const contractTime = safeStr(raw.contract_time);
  const jobTypeTag = contractTime ? contractTime : contractType;

  return {
    id: appId,
    slug: `${slugify(title)}-${sourceId}`,
    title,
    company: {
      id: `adz-co-${companySlug}`,
      slug: companySlug,
      name: companyName,
      description: "",
      industry: "",
      logoUrl: null,
      websiteUrl: null,
      size: null,
      foundedYear: null,
    },
    location: {
      id: `adz-loc-${slugify(locationDisplay || city)}`,
      city,
      state,
      country,
      remote: isRemote,
      hybrid: false,
      onsite: isOnsite,
      displayName: locationDisplay || city,
    },
    categoryIds,
    categories: [],
    salary:
      salaryMin !== null || salaryMax !== null || displayRange !== null
        ? {
            min: salaryMin,
            max: salaryMax,
            currency: safeStr(raw.salary_currency) || "USD",
            period: guessPeriod(raw),
            displayRange,
          }
        : null,
    description,
    requirements: [],
    responsibilities: [],
    benefits: [],
    postedAt: createdAt,
    closingAt: null,
    source: ADZUNA_SOURCE_NAME,
    sourceId,
    applyUrl: safeStr(raw.redirect_url) || null,
    aiSummary: null,
    detectedSkills: jobTypeTag ? [jobTypeTag] : null,
    seniority: null,
    remoteType: null,
    salaryNote: null,
    matchScore: null,
    matchedSkills: null,
    missingSkills: null,
    jobQualityScore: null,
  };
}

/**
 * Normalize a full Adzuna raw response into an array of app-owned `Job` objects.
 * Never throws. Returns empty array on null/undefined/malformed input.
 */
export function normalizeAdzunaResponse(raw: AdzunaRawResponse | null | undefined): Job[] {
  if (!raw || !raw.results || !Array.isArray(raw.results)) return [];
  if (raw.results.length === 0) return [];

  const jobs: Job[] = [];

  for (let i = 0; i < raw.results.length; i++) {
    const result = raw.results[i];
    if (!result || typeof result !== "object") continue;

    const job = normalizeAdzunaJob(result, i);
    if (job) {
      jobs.push(job);
    }
  }

  return jobs;
}
