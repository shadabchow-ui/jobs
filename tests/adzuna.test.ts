import { describe, it, expect, afterEach, vi } from "vitest";
import {
  normalizeAdzunaJob,
  normalizeAdzunaResponse,
  buildAdzunaSourceId,
  buildAdzunaAppId,
  isAdzunaSource,
  ADZUNA_SOURCE_NAME,
  type AdzunaRawResult,
} from "~/lib/adzuna-normalizer";
import type { Job } from "~/types/page-model.types";
import { getAdzunaHealth } from "~/services/adzuna.server";

// ---------------------------------------------------------------------------
// Fixture: well-formed Adzuna raw result
// ---------------------------------------------------------------------------

function makeRaw(overrides: Partial<AdzunaRawResult> = {}): AdzunaRawResult {
  return {
    id: 1001,
    title: "Senior Frontend Engineer",
    company: { display_name: "Acme Corp" },
    location: {
      display_name: "San Francisco, CA",
      area: ["San Francisco", "CA", "US"],
    },
    salary_min: 150000,
    salary_max: 200000,
    salary_is_predicted: 0,
    salary_currency: "USD",
    category: { label: "IT Jobs", tag: "it-jobs" },
    redirect_url: "https://example.com/jobs/1001",
    created: "2026-05-10T00:00:00Z",
    description: "Build performant web applications.",
    contract_type: "permanent",
    contract_time: "full_time",
    ...overrides,
  };
}

// ---------------------------------------------------------------------------
// Dedupe key policy
// ---------------------------------------------------------------------------

describe("Adzuna dedupe key policy", () => {
  it("buildAdzunaSourceId returns string from number", () => {
    expect(buildAdzunaSourceId(1001)).toBe("1001");
  });

  it("buildAdzunaSourceId returns string from string", () => {
    expect(buildAdzunaSourceId("abc-123")).toBe("abc-123");
  });

  it("buildAdzunaAppId produces composite key", () => {
    expect(buildAdzunaAppId(1001)).toBe("adzuna:1001");
  });

  it("isAdzunaSource matches source field", () => {
    const job = { source: "adzuna" } as Job;
    expect(isAdzunaSource(job)).toBe(true);
  });

  it("isAdzunaSource rejects non-adzuna source", () => {
    const job = { source: "fixture" } as Job;
    expect(isAdzunaSource(job)).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// normalizeAdzunaJob — happy path
// ---------------------------------------------------------------------------

describe("normalizeAdzunaJob — happy path", () => {
  it("normalizes a well-formed result", () => {
    const raw = makeRaw();
    const job = normalizeAdzunaJob(raw);

    expect(job).not.toBeNull();
    expect(job!.id).toBe("adzuna:1001");
    expect(job!.source).toBe(ADZUNA_SOURCE_NAME);
    expect(job!.sourceId).toBe("1001");
    expect(job!.title).toBe("Senior Frontend Engineer");
    expect(job!.company.name).toBe("Acme Corp");
    expect(job!.company.slug).toBe("acme-corp");
    expect(job!.location.city).toBe("San Francisco");
    expect(job!.location.state).toBe("CA");
    expect(job!.location.country).toBe("US");
    expect(job!.location.remote).toBe(false);
    expect(job!.location.onsite).toBe(true);
    expect(job!.location.displayName).toBe("San Francisco, CA");
    expect(job!.salary).not.toBeNull();
    expect(job!.salary!.min).toBe(150000);
    expect(job!.salary!.max).toBe(200000);
    expect(job!.salary!.currency).toBe("USD");
    expect(job!.salary!.displayRange).toContain("150K");
    expect(job!.applyUrl).toBe("https://example.com/jobs/1001");
    expect(job!.postedAt).toBe("2026-05-10T00:00:00Z");
    expect(job!.categoryIds).toContain("cat-001");
  });

  it("generates a slug from title and sourceId", () => {
    const raw = makeRaw({ title: "Software Engineer", id: 200 });
    const job = normalizeAdzunaJob(raw);
    expect(job!.slug).toBe("software-engineer-200");
  });

  it("detects remote location", () => {
    const raw = makeRaw({
      location: { display_name: "Remote (US)", area: ["Remote", null, "US"] },
    });
    const job = normalizeAdzunaJob(raw);
    expect(job!.location.remote).toBe(true);
    expect(job!.location.onsite).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// normalizeAdzunaJob — defensive / missing optional fields
// ---------------------------------------------------------------------------

describe("normalizeAdzunaJob — defensive handling", () => {
  it("returns null when title is empty", () => {
    const raw = makeRaw({ title: "" });
    expect(normalizeAdzunaJob(raw)).toBeNull();
  });

  it("returns null when title is missing entirely", () => {
    const raw = makeRaw({ title: undefined as unknown as string });
    expect(normalizeAdzunaJob(raw)).toBeNull();
  });

  it("defaults company to Unknown Company when null", () => {
    const raw = makeRaw({ company: null });
    const job = normalizeAdzunaJob(raw);
    expect(job!.company.name).toBe("Unknown Company");
  });

  it("defaults company when display_name is empty", () => {
    const raw = makeRaw({ company: { display_name: "" } });
    const job = normalizeAdzunaJob(raw);
    expect(job!.company.name).toBe("Unknown Company");
  });

  it("handles missing salary fields", () => {
    const raw = makeRaw({
      salary_min: undefined,
      salary_max: undefined,
      salary_currency: undefined,
    });
    const job = normalizeAdzunaJob(raw);
    expect(job!.salary).toBeNull();
  });

  it("handles missing category gracefully", () => {
    const raw = makeRaw({ category: undefined });
    const job = normalizeAdzunaJob(raw);
    expect(job!.categoryIds).toHaveLength(1);
    expect(job!.categoryIds[0]).toBe("cat-006"); // default
  });

  it("handles null redirect_url", () => {
    const raw = makeRaw({ redirect_url: null });
    const job = normalizeAdzunaJob(raw);
    expect(job!.applyUrl).toBeNull();
  });

  it("handles missing created date — uses current time", () => {
    const raw = makeRaw({ created: undefined });
    const job = normalizeAdzunaJob(raw);
    expect(job!.postedAt).toBeTruthy();
    expect(() => new Date(job!.postedAt)).not.toThrow();
  });

  it("handles null location gracefully", () => {
    const raw = makeRaw({ location: null });
    const job = normalizeAdzunaJob(raw);
    expect(job!.location.city).toBe("Unknown");
    expect(job!.location.displayName).toBe("Unknown");
  });

  it("provides default description when missing", () => {
    const raw = makeRaw({ description: undefined });
    const job = normalizeAdzunaJob(raw);
    expect(job!.description).toBe("No description provided.");
  });

  it("handles id as a string", () => {
    const raw = makeRaw({ id: "adz-9876" });
    const job = normalizeAdzunaJob(raw);
    expect(job!.id).toBe("adzuna:adz-9876");
    expect(job!.sourceId).toBe("adz-9876");
  });

  it("handles missing contract_type and contract_time", () => {
    const raw = makeRaw({ contract_type: null, contract_time: null });
    const job = normalizeAdzunaJob(raw);
    expect(job!.detectedSkills).toBeNull();
  });

  it("handles predicted salary gracefully", () => {
    const raw = makeRaw({ salary_is_predicted: 1, salary_min: 50000, salary_max: 80000 });
    const job = normalizeAdzunaJob(raw);
    expect(job!.salary).not.toBeNull();
    expect(job!.salary!.min).toBe(50000);
  });
});

// ---------------------------------------------------------------------------
// normalizeAdzunaResponse — batch normalizer
// ---------------------------------------------------------------------------

describe("normalizeAdzunaResponse", () => {
  it("returns empty array for null input", () => {
    expect(normalizeAdzunaResponse(null)).toEqual([]);
  });

  it("returns empty array for undefined input", () => {
    expect(normalizeAdzunaResponse(undefined)).toEqual([]);
  });

  it("returns empty array for object without results", () => {
    expect(normalizeAdzunaResponse({ count: 0 })).toEqual([]);
  });

  it("returns empty array for null results", () => {
    expect(normalizeAdzunaResponse({ results: null })).toEqual([]);
  });

  it("returns empty array for empty results array", () => {
    expect(normalizeAdzunaResponse({ results: [], count: 0 })).toEqual([]);
  });

  it("normalizes multiple results", () => {
    const jobs = normalizeAdzunaResponse({
      results: [
        makeRaw({ id: 1, title: "Job A" }),
        makeRaw({ id: 2, title: "Job B" }),
        makeRaw({ id: 3, title: "Job C" }),
      ],
      count: 3,
    });
    expect(jobs).toHaveLength(3);
    expect(jobs[0].title).toBe("Job A");
    expect(jobs[1].title).toBe("Job B");
    expect(jobs[2].title).toBe("Job C");
  });

  it("skips malformed items within a batch", () => {
    const jobs = normalizeAdzunaResponse({
      results: [
        makeRaw({ id: 1, title: "Good Job" }),
        { id: 2, title: "" } as AdzunaRawResult,
        makeRaw({ id: 3, title: "Also Good" }),
      ],
      count: 3,
    });
    expect(jobs).toHaveLength(2);
    expect(jobs.map((j) => j.sourceId)).toEqual(["1", "3"]);
  });

  it("skips null items within results array", () => {
    const jobs = normalizeAdzunaResponse({
      results: [
        makeRaw({ id: 1, title: "Only Good" }),
        null as unknown as AdzunaRawResult,
      ],
      count: 1,
    });
    expect(jobs).toHaveLength(1);
  });

  it("returns all jobs with unique app ids", () => {
    const jobs = normalizeAdzunaResponse({
      results: [makeRaw({ id: 1 }), makeRaw({ id: 2 })],
    });
    const ids = jobs.map((j) => j.id);
    expect(ids).toEqual(["adzuna:1", "adzuna:2"]);
  });
});

// ---------------------------------------------------------------------------
// Integration-style: service caller (unit-tests normalizer end-to-end with
// mocked raw responses; no real network)
// ---------------------------------------------------------------------------

describe("Adzuna service integration boundary (mocked)", () => {
  const mockSuccessResponse = {
    results: [
      makeRaw({ id: 2001, title: "Backend Developer", company: { display_name: "TechCo" } }),
      makeRaw({ id: 2002, title: "Frontend Developer", company: { display_name: "WebCo" } }),
    ],
    count: 2,
  };

  const mockEmptyResponse = {
    results: [],
    count: 0,
  };

  it("success response produces normalized jobs", () => {
    const jobs = normalizeAdzunaResponse(mockSuccessResponse);
    expect(jobs).toHaveLength(2);
    expect(jobs[0].title).toBe("Backend Developer");
    expect(jobs[0].company.name).toBe("TechCo");
    expect(jobs[1].title).toBe("Frontend Developer");
    expect(jobs[1].company.name).toBe("WebCo");
  });

  it("empty results returns empty array", () => {
    const jobs = normalizeAdzunaResponse(mockEmptyResponse);
    expect(jobs).toEqual([]);
  });

  it("malformed JSON (non-object) returns empty array", () => {
    const jobs = normalizeAdzunaResponse(
      "not an object" as unknown as Record<string, unknown>,
    );
    expect(jobs).toEqual([]);
  });

  it("malformed JSON (array) returns empty array", () => {
    const jobs = normalizeAdzunaResponse([1, 2, 3] as unknown as Record<string, unknown>);
    expect(jobs).toEqual([]);
  });

  it("response with missing required fields still normalizes what it can", () => {
    // Strip everything optional by building a minimal object
    const minimal = {
      id: 3001,
      title: "Minimal Job",
      company: null,
      location: null,
    } as AdzunaRawResult;

    const job = normalizeAdzunaJob(minimal);
    expect(job).not.toBeNull();
    expect(job!.title).toBe("Minimal Job");
    expect(job!.company.name).toBe("Unknown Company");
    expect(job!.salary).toBeNull();
    expect(job!.applyUrl).toBeNull();
  });

  it("non-OK response handling — normalizer doesn't know about HTTP, empty results handled upstream", () => {
    // The normalizer just handles data; HTTP non-OK is handled by the service fetch layer.
    // For an empty results array, the normalizer returns [] — the service returns null on that.
    const jobs = normalizeAdzunaResponse({ results: [], count: 0 });
    expect(jobs).toEqual([]);
  });

  it("detectedSkills contains contract_time when present", () => {
    const raw = makeRaw({ contract_time: "part_time" });
    const job = normalizeAdzunaJob(raw);
    expect(job!.detectedSkills).toEqual(["part_time"]);
  });

  it("detectedSkills contains contract_type when time is absent", () => {
    const raw = makeRaw({ contract_type: "contract", contract_time: null });
    const job = normalizeAdzunaJob(raw);
    expect(job!.detectedSkills).toEqual(["contract"]);
  });
});

// ---------------------------------------------------------------------------
// isAdzunaSource — edge cases
// ---------------------------------------------------------------------------

describe("isAdzunaSource edge cases", () => {
  it("works on a fully normalized adzuna job", () => {
    const raw = makeRaw({ id: 99, title: "Test Job" });
    const job = normalizeAdzunaJob(raw);
    expect(isAdzunaSource(job!)).toBe(true);
  });
});

// ---------------------------------------------------------------------------
// getAdzunaHealth
// ---------------------------------------------------------------------------

describe("getAdzunaHealth", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("returns not_configured when env is missing", async () => {
    const result = await getAdzunaHealth();
    expect(result.configured).toBe(false);
    expect(result.hasAppId).toBe(false);
    expect(result.hasAppKey).toBe(false);
    expect(result.errorType).toBe("not_configured");
    expect(result.status).toBeNull();
    expect(result.ok).toBe(false);
    expect(result.resultCount).toBe(0);
    expect(result.country).toBe("us");
  });

  it("returns not_configured when env has empty keys", async () => {
    const result = await getAdzunaHealth({ ADZUNA_APP_ID: "", ADZUNA_APP_KEY: "" });
    expect(result.configured).toBe(false);
    expect(result.errorType).toBe("not_configured");
  });

  it("returns ok true with results when configured and fetch succeeds", async () => {
    const mockResponse = {
      results: [
        {
          id: 1,
          title: "Developer",
          company: { display_name: "TechCo" },
          location: { display_name: "New York, NY", area: ["New York", "NY", "US"] },
          redirect_url: "https://example.com/job/1",
          created: "2026-05-10T00:00:00Z",
          description: "A developer job.",
        },
      ],
      count: 1,
    };

    vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(JSON.stringify(mockResponse), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }),
    );

    const result = await getAdzunaHealth({
      ADZUNA_APP_ID: "test-app-id",
      ADZUNA_APP_KEY: "test-app-key",
    });

    expect(result.configured).toBe(true);
    expect(result.hasAppId).toBe(true);
    expect(result.hasAppKey).toBe(true);
    expect(result.ok).toBe(true);
    expect(result.status).toBe(200);
    expect(result.resultCount).toBe(1);
    expect(result.errorType).toBeNull();
  });

  it("returns http_error on non-ok response", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response("Unauthorized", { status: 401 }),
    );

    const result = await getAdzunaHealth({
      ADZUNA_APP_ID: "test-app-id",
      ADZUNA_APP_KEY: "test-app-key",
    });

    expect(result.configured).toBe(true);
    expect(result.ok).toBe(false);
    expect(result.status).toBe(401);
    expect(result.errorType).toBe("http_error");
  });

  it("returns network_error when fetch throws", async () => {
    vi.spyOn(globalThis, "fetch").mockRejectedValue(new Error("network failure"));

    const result = await getAdzunaHealth({
      ADZUNA_APP_ID: "test-app-id",
      ADZUNA_APP_KEY: "test-app-key",
    });

    expect(result.configured).toBe(true);
    expect(result.ok).toBe(false);
    expect(result.status).toBeNull();
    expect(result.errorType).toBe("network_error");
  });

  it("does not leak secrets in the response", async () => {
    const result = await getAdzunaHealth({
      ADZUNA_APP_ID: "secret-id-123",
      ADZUNA_APP_KEY: "secret-key-456",
    });

    const json = JSON.stringify(result);
    expect(json).not.toContain("secret-id-123");
    expect(json).not.toContain("secret-key-456");
  });
});
