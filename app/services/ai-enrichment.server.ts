import type { Job } from "~/types/page-model.types";

// ---------------------------------------------------------------------------
// Enrichment output fields
// ---------------------------------------------------------------------------

export interface AiEnrichmentFields {
  aiSummary: string;
  detectedSkills: string[];
  seniority: string | null;
  remoteType: string | null;
  salaryNote: string | null;
  jobQualityScore: number;
}

// ---------------------------------------------------------------------------
// Provider interface — no live providers configured.
// Status: not provided
// ---------------------------------------------------------------------------

export interface AiEnrichmentProvider {
  readonly name: string;
  enrich(job: Job): Promise<AiEnrichmentFields>;
}

const registeredProviders: AiEnrichmentProvider[] = [];

export function registerAiProvider(provider: AiEnrichmentProvider): void {
  registeredProviders.push(provider);
}

export function getRegisteredProviders(): ReadonlyArray<AiEnrichmentProvider> {
  return registeredProviders;
}

// ---------------------------------------------------------------------------
// Enriched Job — the original Job with all enrichment fields populated.
// ---------------------------------------------------------------------------

export type EnrichedJob = Job & {
  aiSummary: string;
  detectedSkills: string[];
  seniority: string | null;
  remoteType: string | null;
  salaryNote: string | null;
  jobQualityScore: number;
};

// ---------------------------------------------------------------------------
// Public API — safe enrichment runner
// ---------------------------------------------------------------------------

/**
 * Enrich a single job with AI fields.
 *
 * 1. If a registered provider is available, calls it and falls back to
 *    deterministic enrichment on any failure.
 * 2. If no provider is registered, uses deterministic enrichment directly.
 *
 * Never throws. Returns the original job with all enrichment fields populated.
 */
export async function enrichJob(job: Job): Promise<EnrichedJob> {
  let fields: AiEnrichmentFields;

  if (registeredProviders.length > 0) {
    const provider = registeredProviders[0];
    fields = await enrichWithFallback(provider, job);
  } else {
    fields = deterministicEnrich(job);
  }

  return {
    ...job,
    aiSummary: fields.aiSummary,
    detectedSkills: fields.detectedSkills,
    seniority: fields.seniority,
    remoteType: fields.remoteType,
    salaryNote: fields.salaryNote,
    jobQualityScore: fields.jobQualityScore,
  };
}

/**
 * Enrich multiple jobs. Calls enrichJob for each in parallel.
 */
export async function enrichJobs(jobs: Job[]): Promise<EnrichedJob[]> {
  return Promise.all(jobs.map((j) => enrichJob(j)));
}

// ---------------------------------------------------------------------------
// Internal — provider with deterministic fallback
// ---------------------------------------------------------------------------

async function enrichWithFallback(
  provider: AiEnrichmentProvider,
  job: Job,
): Promise<AiEnrichmentFields> {
  try {
    const result = await provider.enrich(job);
    if (isValidEnrichment(result)) return result;
  } catch {
    // fall through to deterministic
  }
  return deterministicEnrich(job);
}

function isValidEnrichment(result: unknown): result is AiEnrichmentFields {
  if (!result || typeof result !== "object") return false;
  const r = result as Record<string, unknown>;
  return (
    typeof r.aiSummary === "string" &&
    r.aiSummary.length > 0 &&
    Array.isArray(r.detectedSkills) &&
    typeof r.jobQualityScore === "number"
  );
}

// ---------------------------------------------------------------------------
// Deterministic enrichment — transparent heuristic rules
// ---------------------------------------------------------------------------

const SKILL_KEYWORDS: { label: string; patterns: RegExp[] }[] = [
  {
    label: "React",
    patterns: [/\breact\b/i, /\bjsx\b/i],
  },
  {
    label: "TypeScript",
    patterns: [/\btypescript\b/i],
  },
  {
    label: "JavaScript",
    patterns: [/\bjavascript\b/i, /\bes6\b/i],
  },
  {
    label: "Python",
    patterns: [/\bpython\b/i],
  },
  {
    label: "SQL",
    patterns: [/\bsql\b/i],
  },
  {
    label: "AWS",
    patterns: [/\baws\b/i, /\bamazon web services\b/i],
  },
  {
    label: "Docker",
    patterns: [/\bdocker\b/i],
  },
  {
    label: "Kubernetes",
    patterns: [/\bkubernetes\b/i, /\bk8s\b/i],
  },
  {
    label: "Node.js",
    patterns: [/\bnode\.?js\b/i, /\bnodejs\b/i],
  },
  {
    label: "PostgreSQL",
    patterns: [/\bpostgres\b/i, /\bpostgresql\b/i],
  },
  {
    label: "MongoDB",
    patterns: [/\bmongodb\b/i, /\bmongo\b/i],
  },
  {
    label: "GraphQL",
    patterns: [/\bgraphql\b/i],
  },
  {
    label: "REST API",
    patterns: [/\brest\b/i, /\bapi\b/i],
  },
  {
    label: "Git",
    patterns: [/\bgit\b/i],
  },
  {
    label: "CI/CD",
    patterns: [/\bci\/cd\b/i, /\bcontinuous integration\b/i, /\bcontinuous delivery\b/i],
  },
  {
    label: "Terraform",
    patterns: [/\bterraform\b/i],
  },
  {
    label: "Machine Learning",
    patterns: [/\bmachine learning\b/i, /\bml\b/i, /\bdeep learning\b/i],
  },
  {
    label: "TensorFlow",
    patterns: [/\btensorflow\b/i],
  },
  {
    label: "PyTorch",
    patterns: [/\bpytorch\b/i],
  },
  {
    label: "Figma",
    patterns: [/\bfigma\b/i],
  },
  {
    label: "Agile",
    patterns: [/\bagile\b/i, /\bscrum\b/i, /\bkanban\b/i],
  },
  {
    label: "Leadership",
    patterns: [/\bleadership\b/i, /\bmentor\b/i, /\bmanagement\b/i],
  },
  {
    label: "Communication",
    patterns: [/\bcommunicat[a-z]+\b/i, /\bcollaboration\b/i, /\bstakeholder\b/i],
  },
  {
    label: "Linux",
    patterns: [/\blinux\b/i],
  },
  {
    label: "Go",
    patterns: [/\bgolang\b/i, /\bgo\b/i],
  },
  {
    label: "Rust",
    patterns: [/\brust\b/i],
  },
  {
    label: "Java",
    patterns: [/\bjava\b/i],
  },
  {
    label: "C++",
    patterns: [/\bc\+\+\b/i],
  },
  {
    label: "Spark",
    patterns: [/\bspark\b/i],
  },
  {
    label: "Kafka",
    patterns: [/\bkafka\b/i],
  },
  {
    label: "Data Analysis",
    patterns: [/\bdata analys[it]s\b/i, /\banalytics\b/i],
  },
  {
    label: "UX Design",
    patterns: [/\bux\b/i, /\buser experience\b/i],
  },
  {
    label: "UI Design",
    patterns: [/\bui\b/i, /\buser interface\b/i],
  },
  {
    label: "Redis",
    patterns: [/\bredis\b/i],
  },
  {
    label: "Elasticsearch",
    patterns: [/\belasticsearch\b/i, /\belk\b/i],
  },
];

const SENIORITY_PATTERNS: { level: string; patterns: RegExp[] }[] = [
  {
    level: "executive",
    patterns: [/\bvp\b/i, /\bvice president\b/i, /\bC-?suite\b/i, /\bchief\b/i, /\bdirector\b/i, /\bhead of\b/i],
  },
  {
    level: "lead",
    patterns: [/\blead\b/i, /\bprincipal\b/i, /\bstaff\b/i, /\barchitect\b/i],
  },
  {
    level: "senior",
    patterns: [/\bsenior\b/i, /\bsr\.?\b/i, /\biii\b/i],
  },
  {
    level: "mid",
    patterns: [/\bmid[\s-]?level\b/i, /\bintermediate\b/i],
  },
  {
    level: "junior",
    patterns: [/\bjunior\b/i, /\bjr\.?\b/i, /\bentry[\s-]?level\b/i, /\bassociate\b/i, /\bintern\b/i],
  },
];

function buildText(job: Job): string {
  return [
    job.title,
    job.description,
    ...job.requirements,
    ...job.responsibilities,
  ]
    .join("\n")
    .toLowerCase();
}

function detectSkills(job: Job): string[] {
  const text = buildText(job);
  const skills: string[] = [];

  for (const { label, patterns } of SKILL_KEYWORDS) {
    if (patterns.some((p) => p.test(text))) {
      skills.push(label);
    }
  }

  return skills.slice(0, 15);
}

function detectSeniority(title: string, description: string): string | null {
  const text = `${title} ${description}`.toLowerCase();

  for (const { level, patterns } of SENIORITY_PATTERNS) {
    if (patterns.some((p) => p.test(text))) {
      return level;
    }
  }

  return null;
}

function detectRemoteType(job: Job): string | null {
  const text = [job.description, job.location.displayName]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

  const hasRemote = /\bremote\b/i.test(text) || /\bwork from home\b/i.test(text) || /\bwfh\b/i.test(text);
  const hasOnsite = /\bon[\s-]?site\b/i.test(text) || /\bin[\s-]?office\b/i.test(text) || /\bin[\s-]?person\b/i.test(text);
  const hasHybrid = /\bhybrid\b/i.test(text) || /\bflexible\b/i.test(text);

  if (hasRemote && hasOnsite) return "hybrid";
  if (hasRemote) return "remote";
  if (job.location.remote) return "remote";
  if (hasHybrid) return "hybrid";
  if (hasOnsite || job.location.onsite) return "onsite";

  return null;
}

function generateSalaryNote(job: Job): string | null {
  if (!job.salary) return null;

  const { min, max, currency, period, displayRange } = job.salary;
  if (!displayRange && min === null && max === null) return null;

  const periodLabel = period === "hourly" ? "hour" : period === "monthly" ? "month" : "year";

  if (min !== null && max !== null && min !== max) {
    return `Salary range: ${displayRange ?? `${currency} ${min.toLocaleString()} – ${currency} ${max.toLocaleString()}`} per ${periodLabel}. This is based on employer-provided data.`;
  }

  if (displayRange) {
    return `Salary: ${displayRange} per ${periodLabel}. Based on employer-provided data.`;
  }

  return null;
}

function generateSummary(job: Job): string {
  const title = job.title;
  const company = job.company.name;
  const location = job.location.displayName;
  const categoryNames = job.categories.map((c) => c.name).join(", ");
  const desc = job.description.length > 120
    ? job.description.slice(0, 120).replace(/\s+\S*$/, "") + "..."
    : job.description;

  const catPhrase = categoryNames ? ` in ${categoryNames}` : "";

  return `${title} role at ${company}${catPhrase}, based in ${location}. ${desc}`;
}

function calculateQualityScore(job: Job): number {
  let score = 50;

  if (job.description.length > 100) score += 10;
  if (job.description.length > 300) score += 5;
  if (job.requirements.length >= 3) score += 10;
  if (job.responsibilities.length >= 3) score += 5;
  if (job.benefits.length >= 3) score += 5;
  if (job.salary !== null) score += 10;
  if (job.applyUrl !== null) score += 5;

  return Math.min(100, Math.max(0, score));
}

/**
 * Deterministic enrichment — pure function, no network, no env vars.
 * Uses transparent heuristic rules on job text fields.
 */
export function deterministicEnrich(job: Job): AiEnrichmentFields {
  return {
    aiSummary: generateSummary(job),
    detectedSkills: detectSkills(job),
    seniority: detectSeniority(job.title, job.description),
    remoteType: detectRemoteType(job),
    salaryNote: generateSalaryNote(job),
    jobQualityScore: calculateQualityScore(job),
  };
}
