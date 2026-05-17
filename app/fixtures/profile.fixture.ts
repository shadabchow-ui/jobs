import type { UserProfile, JobPreferences, SkillEntry, ResumeMeta, ProfileDashboardData } from "~/types/profile.types";

export const PROFILE_FIXTURE: UserProfile = {
  userId: "user-001",
  displayName: "Alex Johnson",
  email: "alex.johnson@example.com",
  phone: null,
  location: "San Francisco, CA",
  headline: "Senior Frontend Engineer — React · TypeScript · Remix",
  bio: "Experienced frontend engineer with 7+ years building performant web applications. Passionate about developer experience, accessibility, and design systems.",
  createdAt: "2026-01-15T00:00:00Z",
  updatedAt: "2026-05-14T00:00:00Z",
};

export const PREFERENCES_FIXTURE: JobPreferences = {
  targetRoles: ["Senior Frontend Engineer", "Staff Engineer", "Engineering Manager"],
  targetLocations: ["San Francisco, CA", "Remote", "New York, NY"],
  remotePreference: "remote",
  desiredSalaryMin: 160000,
  desiredSalaryMax: 220000,
  jobTypes: ["Full-time", "Contract"],
  experienceLevel: "senior",
};

export const SKILLS_FIXTURE: SkillEntry[] = [
  { name: "React", category: "Frontend", level: "expert" },
  { name: "TypeScript", category: "Frontend", level: "expert" },
  { name: "Remix", category: "Frontend", level: "advanced" },
  { name: "Node.js", category: "Backend", level: "advanced" },
  { name: "GraphQL", category: "Backend", level: "intermediate" },
  { name: "CSS / Design Systems", category: "Frontend", level: "expert" },
  { name: "AWS", category: "Cloud", level: "intermediate" },
  { name: "PostgreSQL", category: "Database", level: "intermediate" },
  { name: "Web Accessibility", category: "Frontend", level: "advanced" },
  { name: "Team Leadership", category: "Soft Skills", level: "advanced" },
];

export const RESUME_FIXTURE: ResumeMeta = {
  id: "resume-001",
  userId: "user-001",
  fileName: "alex-johnson-resume-2026.pdf",
  fileSize: 245000,
  contentType: "application/pdf",
  uploadedAt: "2026-05-12T00:00:00Z",
  parsedAt: "2026-05-12T01:00:00Z",
  extractedSkills: [
    "React",
    "TypeScript",
    "Remix",
    "Node.js",
    "GraphQL",
    "CSS",
    "Design Systems",
    "Web Accessibility",
    "AWS",
    "PostgreSQL",
  ],
  extractedRoles: [
    "Senior Frontend Engineer",
    "Staff Engineer",
    "Technical Lead",
  ],
  summaryText: "Senior Frontend Engineer with 7+ years of experience building performant, accessible web applications using React, TypeScript, and modern JavaScript tooling. Led a team of 4 engineers to ship a customer-facing dashboard serving 2M+ users. Strong background in design systems, performance optimization, and mentoring.",
};

export const DASHBOARD_FIXTURE: ProfileDashboardData = {
  profile: PROFILE_FIXTURE,
  preferences: PREFERENCES_FIXTURE,
  skills: SKILLS_FIXTURE,
  resume: RESUME_FIXTURE,
  savedJobCount: 3,
  applicationCount: 2,
  interviewCount: 1,
  offerCount: 0,
};

export function getProfileDashboard(_userId: string): ProfileDashboardData {
  return DASHBOARD_FIXTURE;
}

export function validateProfileDashboard(data: ProfileDashboardData): string[] {
  const errors: string[] = [];
  if (!data.profile.userId) errors.push("Profile missing userId");
  if (!data.profile.displayName) errors.push("Profile missing displayName");
  if (!Array.isArray(data.preferences.targetRoles)) errors.push("Preferences missing targetRoles");
  if (!Array.isArray(data.skills)) errors.push("Skills must be an array");
  return errors;
}
