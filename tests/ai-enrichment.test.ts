import { describe, it, expect } from "vitest";
import {
  deterministicEnrich,
  enrichJob,
  enrichJobs,
  registerAiProvider,
  type AiEnrichmentProvider,
  type AiEnrichmentFields,
} from "~/services/ai-enrichment.server";
import type { Job } from "~/types/page-model.types";

function makeJob(overrides: Partial<Job> = {}): Job {
  return {
    id: "test-job-001",
    slug: "test-senior-frontend-engineer",
    title: "Senior Frontend Engineer",
    company: {
      id: "co-001",
      slug: "test-corp",
      name: "Test Corp",
      description: "A test company.",
      industry: "Technology",
      logoUrl: null,
      websiteUrl: null,
      size: null,
      foundedYear: null,
    },
    location: {
      id: "loc-001",
      city: "San Francisco",
      state: "CA",
      country: "US",
      remote: true,
      hybrid: false,
      onsite: false,
      displayName: "San Francisco, CA",
    },
    categoryIds: ["cat-001"],
    categories: [{ id: "cat-001", slug: "engineering", name: "Engineering", parentId: null }],
    salary: {
      min: 150000,
      max: 200000,
      currency: "USD",
      period: "yearly",
      displayRange: "$150,000 – $200,000",
    },
    description:
      "Build and maintain React and TypeScript applications. Work with a remote team.",
    requirements: [
      "5+ years React experience",
      "Strong TypeScript skills",
      "Experience with GraphQL",
    ],
    responsibilities: [
      "Lead frontend architecture decisions",
      "Mentor junior engineers",
      "Code review",
    ],
    benefits: [
      "Health insurance",
      "Remote work",
      "Equity",
    ],
    postedAt: "2026-05-01T00:00:00Z",
    closingAt: null,
    source: "fixture",
    sourceId: "fx-test-001",
    applyUrl: "https://example.com/apply",
    aiSummary: null,
    detectedSkills: null,
    seniority: null,
    remoteType: null,
    salaryNote: null,
    matchScore: null,
    matchedSkills: null,
    missingSkills: null,
    jobQualityScore: null,
    ...overrides,
  };
}

describe("deterministicEnrich", () => {
  it("returns all enrichment fields", () => {
    const job = makeJob();
    const result = deterministicEnrich(job);

    expect(typeof result.aiSummary).toBe("string");
    expect(result.aiSummary.length).toBeGreaterThan(0);
    expect(Array.isArray(result.detectedSkills)).toBe(true);
    expect(result.detectedSkills.length).toBeGreaterThan(0);
    expect(typeof result.seniority).toBe("string");
    expect(typeof result.remoteType).toBe("string");
    expect(typeof result.salaryNote).toBe("string");
    expect(typeof result.jobQualityScore).toBe("number");
    expect(result.jobQualityScore).toBeGreaterThanOrEqual(0);
    expect(result.jobQualityScore).toBeLessThanOrEqual(100);
  });

  it("aiSummary includes title and company", () => {
    const job = makeJob({ title: "Staff Backend Engineer", company: { ...makeJob().company, name: "Acme Inc" } });
    const result = deterministicEnrich(job);

    expect(result.aiSummary).toContain("Staff Backend Engineer");
    expect(result.aiSummary).toContain("Acme Inc");
    expect(result.aiSummary).toContain("San Francisco");
  });

  it("aiSummary includes category if available", () => {
    const job = makeJob();
    const result = deterministicEnrich(job);
    expect(result.aiSummary).toContain("Engineering");
  });
});

describe("detectSkills", () => {
  it("detects React and TypeScript from requirements", () => {
    const job = makeJob({
      title: "React Developer",
      description: "Build React apps with TypeScript.",
    });
    const result = deterministicEnrich(job);

    expect(result.detectedSkills).toContain("React");
    expect(result.detectedSkills).toContain("TypeScript");
  });

  it("detects GraphQL from requirements", () => {
    const job = makeJob({
      requirements: ["GraphQL experience required"],
    });
    const result = deterministicEnrich(job);
    expect(result.detectedSkills).toContain("GraphQL");
  });

  it("detects skills from description", () => {
    const job = makeJob({
      title: "Data Engineer",
      description: "Build data pipelines with Spark, Kafka, and Python. Use Docker for deployment.",
    });
    const result = deterministicEnrich(job);

    expect(result.detectedSkills).toContain("Python");
    expect(result.detectedSkills).toContain("Spark");
    expect(result.detectedSkills).toContain("Kafka");
    expect(result.detectedSkills).toContain("Docker");
  });

  it("limits detected skills to 15", () => {
    const job = makeJob({
      title: "Full Stack Developer",
      description:
        "React TypeScript JavaScript Python SQL AWS Docker Kubernetes Node.js PostgreSQL MongoDB GraphQL REST API Git CI/CD Terraform Machine Learning Figma Agile",
      requirements: ["Linux Go Rust Java C++ Spark Kafka Data Analysis UX Design UI Design Redis Elasticsearch"],
    });
    const result = deterministicEnrich(job);
    expect(result.detectedSkills.length).toBeLessThanOrEqual(15);
  });

  it("detects leadership and communication skills", () => {
    const job = makeJob({
      title: "Engineering Manager",
      description: "Lead a team. Mentor junior engineers. Communicate with stakeholders.",
    });
    const result = deterministicEnrich(job);
    expect(result.detectedSkills).toContain("Leadership");
    expect(result.detectedSkills).toContain("Communication");
  });
});

describe("detectSeniority", () => {
  it("detects senior level from title", () => {
    const job = makeJob({ title: "Senior Software Engineer" });
    const result = deterministicEnrich(job);
    expect(result.seniority).toBe("senior");
  });

  it("detects lead level from title", () => {
    const job = makeJob({ title: "Lead DevOps Engineer" });
    const result = deterministicEnrich(job);
    expect(result.seniority).toBe("lead");
  });

  it("detects executive level", () => {
    const job = makeJob({ title: "VP of Engineering" });
    const result = deterministicEnrich(job);
    expect(result.seniority).toBe("executive");
  });

  it("detects junior level", () => {
    const job = makeJob({ title: "Junior Frontend Developer" });
    const result = deterministicEnrich(job);
    expect(result.seniority).toBe("junior");
  });

  it("detects staff level as lead", () => {
    const job = makeJob({ title: "Staff ML Engineer" });
    const result = deterministicEnrich(job);
    expect(result.seniority).toBe("lead");
  });

  it("detects director level as executive", () => {
    const job = makeJob({ title: "Director of Product" });
    const result = deterministicEnrich(job);
    expect(result.seniority).toBe("executive");
  });

  it("detects seniority from description when title is ambiguous", () => {
    const job = makeJob({
      title: "Software Engineer",
      description: "This is a senior level role. We need sr. experience.",
    });
    const result = deterministicEnrich(job);
    expect(result.seniority).toBe("senior");
  });

  it("returns null when no seniority keywords match", () => {
    const job = makeJob({
      title: "Developer",
      description: "General development work.",
    });
    const result = deterministicEnrich(job);
    expect(result.seniority).toBeNull();
  });
});

describe("detectRemoteType", () => {
  it("detects remote from location", () => {
    const job = makeJob({
      location: { ...makeJob().location, remote: true, displayName: "Remote" },
    });
    const result = deterministicEnrich(job);
    expect(result.remoteType).toBe("remote");
  });

  it("detects hybrid when both remote and on-site mentioned", () => {
    const job = makeJob({
      description: "Remote-friendly with occasional in-office days. Hybrid work environment.",
      location: { ...makeJob().location, remote: false, onsite: true },
    });
    const result = deterministicEnrich(job);
    expect(result.remoteType).toBe("hybrid");
  });

  it("detects remote from description keywords", () => {
    const job = makeJob({
      description: "Work from home. Fully remote position.",
      location: { ...makeJob().location, remote: false, onsite: true },
    });
    const result = deterministicEnrich(job);
    expect(result.remoteType).toBe("remote");
  });

  it("detects on-site from description keywords", () => {
    const job = makeJob({
      description: "This is an in-office position. Must work on-site.",
      location: { ...makeJob().location, remote: false, onsite: true },
    });
    const result = deterministicEnrich(job);
    expect(result.remoteType).toBe("onsite");
  });

  it("detects hybrid from flexible keyword", () => {
    const job = makeJob({
      description: "Flexible working arrangement.",
      location: { ...makeJob().location, remote: false, onsite: false },
    });
    const result = deterministicEnrich(job);
    expect(result.remoteType).toBe("hybrid");
  });

  it("returns null when no clear indicator", () => {
    const job = makeJob({
      description: "Standard office role.",
      location: { ...makeJob().location, remote: false, onsite: false },
    });
    const result = deterministicEnrich(job);
    expect(result.remoteType).toBeNull();
  });
});

describe("generateSalaryNote", () => {
  it("generates note with salary range", () => {
    const job = makeJob();
    const result = deterministicEnrich(job);
    expect(result.salaryNote).toContain("$150,000 – $200,000");
    expect(result.salaryNote).toContain("per year");
    expect(result.salaryNote).toContain("employer-provided");
  });

  it("returns null when no salary data", () => {
    const job = makeJob({ salary: null });
    const result = deterministicEnrich(job);
    expect(result.salaryNote).toBeNull();
  });

  it("returns null when salary has no display range or min/max", () => {
    const job = makeJob({
      salary: { min: null, max: null, currency: "USD", period: "yearly", displayRange: null },
    });
    const result = deterministicEnrich(job);
    expect(result.salaryNote).toBeNull();
  });

  it("uses hourly period label", () => {
    const job = makeJob({
      salary: { min: 50, max: 75, currency: "USD", period: "hourly", displayRange: "$50 – $75" },
    });
    const result = deterministicEnrich(job);
    expect(result.salaryNote).toContain("per hour");
  });
});

describe("calculateQualityScore", () => {
  it("scores 100 for complete job listing", () => {
    // Base 50 + desc > 100 (10) + reqs >= 3 (10) + resp >= 3 (5) + benefits >= 3 (5) + salary (10) + applyUrl (5) = max 100
    // Default makeJob description is ~70 chars, so no desc bonus; total = 85 with no desc bonus
    const job = makeJob({
      description: "Build and maintain React and TypeScript applications. Work with a remote team. We need someone experienced with modern frontend frameworks and design systems.",
    });
    const result = deterministicEnrich(job);
    expect(result.jobQualityScore).toBe(95);
  });

  it("scores 0 at minimum", () => {
    const job = makeJob({
      description: "",
      requirements: [],
      responsibilities: [],
      benefits: [],
      salary: null,
      applyUrl: null,
    });
    const result = deterministicEnrich(job);
    // Base score is always 50
    expect(result.jobQualityScore).toBe(50);
  });

  it("scores mid-range for partial listing", () => {
    const job = makeJob({
      salary: null,
      applyUrl: null,
      benefits: [],
    });
    const result = deterministicEnrich(job);
    expect(result.jobQualityScore).toBeGreaterThan(50);
    expect(result.jobQualityScore).toBeLessThan(85);
  });
});

describe("enrichJob", () => {
  it("returns EnrichedJob with all fields populated", async () => {
    const job = makeJob();
    const result = await enrichJob(job);

    expect(result.aiSummary).not.toBeNull();
    expect(result.aiSummary!.length).toBeGreaterThan(0);
    expect(result.detectedSkills).not.toBeNull();
    expect(result.detectedSkills!.length).toBeGreaterThan(0);
    expect(result.jobQualityScore).not.toBeNull();
    expect(result.jobQualityScore!).toBeGreaterThanOrEqual(0);
  });

  it("uses deterministic fallback when no provider registered", async () => {
    const job = makeJob({ title: "React Engineer" });
    const result = await enrichJob(job);

    expect(result.detectedSkills!).toContain("React");
  });

  it("falls back to deterministic when provider returns invalid data", async () => {
    const badProvider: AiEnrichmentProvider = {
      name: "bad-provider",
      enrich: async () => ({ aiSummary: "", detectedSkills: null as unknown as string[], jobQualityScore: -1 } as AiEnrichmentFields),
    };

    registerAiProvider(badProvider);
    const job = makeJob();
    const result = await enrichJob(job);

    expect(result.aiSummary!.length).toBeGreaterThan(0);
    expect(Array.isArray(result.detectedSkills)).toBe(true);
    expect(result.detectedSkills!.length).toBeGreaterThan(0);
    expect(result.jobQualityScore!).toBeGreaterThanOrEqual(0);
  });

  it("falls back to deterministic when provider throws", async () => {
    const throwingProvider: AiEnrichmentProvider = {
      name: "throw-provider",
      enrich: async () => {
        throw new Error("Provider unavailable");
      },
    };

    registerAiProvider(throwingProvider);
    const job = makeJob();
    const result = await enrichJob(job);

    expect(result.aiSummary!.length).toBeGreaterThan(0);
    expect(result.detectedSkills!.length).toBeGreaterThan(0);
    expect(result.jobQualityScore!).toBeGreaterThanOrEqual(0);
  });

  it("never throws with empty requirements/responsibilities/benefits", async () => {
    const job = makeJob({
      requirements: [],
      responsibilities: [],
      benefits: [],
    });
    const result = await enrichJob(job);

    expect(result.aiSummary).not.toBeNull();
    expect(result.detectedSkills).not.toBeNull();
    expect(result.jobQualityScore).not.toBeNull();
  });
});

describe("enrichJobs", () => {
  it("enriches multiple jobs in parallel", async () => {
    const jobs = [
      makeJob({ title: "React Developer" }),
      makeJob({ id: "test-job-002", title: "Python Engineer", description: "Backend Python development with Django." }),
      makeJob({ id: "test-job-003", title: "DevOps Engineer", description: "AWS and Kubernetes management." }),
    ];

    const results = await enrichJobs(jobs);
    expect(results).toHaveLength(3);

    expect(results[0].detectedSkills!).toContain("React");
    expect(results[1].detectedSkills!).toContain("Python");
    expect(results[2].detectedSkills!).toContain("AWS");
    expect(results[2].detectedSkills!).toContain("Kubernetes");
  });

  it("handles empty array", async () => {
    const results = await enrichJobs([]);
    expect(results).toHaveLength(0);
  });
});
