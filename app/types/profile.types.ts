export interface UserProfile {
  userId: string;
  displayName: string;
  email: string | null;
  phone: string | null;
  location: string | null;
  headline: string | null;
  bio: string | null;
  createdAt: string;
  updatedAt: string | null;
}

export interface JobPreferences {
  targetRoles: string[];
  targetLocations: string[];
  remotePreference: "remote" | "hybrid" | "onsite" | "any";
  desiredSalaryMin: number | null;
  desiredSalaryMax: number | null;
  jobTypes: string[];
  experienceLevel: "entry" | "mid" | "senior" | "lead" | "executive" | "any";
}

export interface SkillEntry {
  name: string;
  category: string;
  level: "beginner" | "intermediate" | "advanced" | "expert";
}

export interface ResumeMeta {
  id: string;
  userId: string;
  fileName: string;
  fileSize: number;
  contentType: string;
  uploadedAt: string;
  parsedAt: string | null;
  extractedSkills: string[] | null;
  extractedRoles: string[] | null;
  summaryText: string | null;
}

export interface ProfileDashboardData {
  profile: UserProfile;
  preferences: JobPreferences;
  skills: SkillEntry[];
  resume: ResumeMeta | null;
  savedJobCount: number;
  applicationCount: number;
  interviewCount: number;
  offerCount: number;
}
