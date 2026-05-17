import type { UserProfile, JobPreferences, SkillEntry, ResumeMeta } from "~/types/profile.types";

interface ProfileSummaryProps {
  profile: UserProfile;
  savedJobCount: number;
  applicationCount: number;
  interviewCount: number;
  offerCount: number;
}

export function ProfileSummary({ profile, savedJobCount, applicationCount, interviewCount, offerCount }: ProfileSummaryProps) {
  return (
    <section className="profile-section" aria-labelledby="profile-summary-heading">
      <h2 id="profile-summary-heading" className="profile-section__heading">Profile</h2>
      <div className="profile-summary">
        <div className="profile-summary__info">
          <div className="profile-summary__avatar" aria-hidden="true">
            {profile.displayName.charAt(0).toUpperCase()}
          </div>
          <div>
            <h3 className="profile-summary__name">{profile.displayName}</h3>
            {profile.headline && (
              <p className="profile-summary__headline">{profile.headline}</p>
            )}
            {profile.location && (
              <p className="profile-summary__location">{profile.location}</p>
            )}
          </div>
        </div>
        <div className="profile-summary__stats">
          <div className="profile-summary__stat">
            <span className="profile-summary__stat-value">{savedJobCount}</span>
            <span className="profile-summary__stat-label">Saved</span>
          </div>
          <div className="profile-summary__stat">
            <span className="profile-summary__stat-value">{applicationCount}</span>
            <span className="profile-summary__stat-label">Applied</span>
          </div>
          <div className="profile-summary__stat">
            <span className="profile-summary__stat-value">{interviewCount}</span>
            <span className="profile-summary__stat-label">Interviews</span>
          </div>
          <div className="profile-summary__stat">
            <span className="profile-summary__stat-value">{offerCount}</span>
            <span className="profile-summary__stat-label">Offers</span>
          </div>
        </div>
      </div>
    </section>
  );
}

const EXPERIENCE_OPTIONS = [
  { value: "entry", label: "Entry Level" },
  { value: "mid", label: "Mid Level" },
  { value: "senior", label: "Senior" },
  { value: "lead", label: "Lead / Manager" },
  { value: "executive", label: "Executive" },
  { value: "any", label: "Any" },
] as const;

const REMOTE_OPTIONS = [
  { value: "remote", label: "Remote" },
  { value: "hybrid", label: "Hybrid" },
  { value: "onsite", label: "On-site" },
  { value: "any", label: "Open to all" },
] as const;

const JOB_TYPE_OPTIONS = [
  "Full-time",
  "Part-time",
  "Contract",
  "Freelance",
  "Internship",
];

interface ProfilePreferencesFormProps {
  preferences: JobPreferences;
}

export function ProfilePreferencesForm({ preferences }: ProfilePreferencesFormProps) {
  return (
    <section className="profile-section" aria-labelledby="preferences-heading">
      <h2 id="preferences-heading" className="profile-section__heading">Job Preferences</h2>
      <form className="profile-form" method="post" action="/profile" onSubmit={(e) => e.preventDefault()}>
        <div className="profile-form__row">
          <label className="profile-form__label" htmlFor="target-roles">
            Target Roles
          </label>
          <input
            id="target-roles"
            className="profile-form__input"
            type="text"
            defaultValue={preferences.targetRoles.join(", ")}
            placeholder="e.g. Senior Frontend Engineer, Staff Engineer"
          />
          <span className="profile-form__hint">Comma-separated job titles you are interested in.</span>
        </div>

        <div className="profile-form__row">
          <label className="profile-form__label" htmlFor="target-locations">
            Target Locations
          </label>
          <input
            id="target-locations"
            className="profile-form__input"
            type="text"
            defaultValue={preferences.targetLocations.join(", ")}
            placeholder="e.g. San Francisco, CA, Remote, New York, NY"
          />
          <span className="profile-form__hint">Cities, states, or "Remote" — comma-separated.</span>
        </div>

        <div className="profile-form__row">
          <label className="profile-form__label" htmlFor="remote-preference">
            Remote Preference
          </label>
          <select
            id="remote-preference"
            className="profile-form__select"
            defaultValue={preferences.remotePreference}
          >
            {REMOTE_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>

        <div className="profile-form__row">
          <label className="profile-form__label" htmlFor="experience-level">
            Experience Level
          </label>
          <select
            id="experience-level"
            className="profile-form__select"
            defaultValue={preferences.experienceLevel}
          >
            {EXPERIENCE_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>

        <div className="profile-form__row">
          <label className="profile-form__label">Desired Salary</label>
          <div className="profile-form__salary-row">
            <input
              id="salary-min"
              className="profile-form__input"
              type="number"
              defaultValue={preferences.desiredSalaryMin ?? ""}
              placeholder="Min"
              aria-label="Minimum salary"
            />
            <span className="profile-form__salary-sep">to</span>
            <input
              id="salary-max"
              className="profile-form__input"
              type="number"
              defaultValue={preferences.desiredSalaryMax ?? ""}
              placeholder="Max"
              aria-label="Maximum salary"
            />
          </div>
          <span className="profile-form__hint">Annual salary range in USD.</span>
        </div>

        <fieldset className="profile-form__fieldset">
          <legend className="profile-form__label">Job Types</legend>
          <div className="profile-form__check-group">
            {JOB_TYPE_OPTIONS.map((type) => (
              <label key={type} className="profile-form__check-label">
                <input
                  type="checkbox"
                  name="jobTypes"
                  value={type}
                  defaultChecked={preferences.jobTypes.includes(type)}
                  className="profile-form__checkbox"
                />
                {type}
              </label>
            ))}
          </div>
        </fieldset>

        <div className="profile-form__actions">
          <button type="submit" className="profile-form__submit" disabled>
            Save Preferences
          </button>
          <span className="profile-form__hint">
            Preferences are read from your profile fixture. Saving will be available when account persistence is ready.
          </span>
        </div>
      </form>
    </section>
  );
}

interface ProfileSkillsPlaceholderProps {
  skills: SkillEntry[];
}

export function ProfileSkillsPlaceholder({ skills }: ProfileSkillsPlaceholderProps) {
  const skillGroups = new Map<string, SkillEntry[]>();
  for (const skill of skills) {
    const group = skillGroups.get(skill.category) ?? [];
    group.push(skill);
    skillGroups.set(skill.category, group);
  }

  return (
    <section className="profile-section" aria-labelledby="skills-heading">
      <h2 id="skills-heading" className="profile-section__heading">Skills</h2>
      <div className="profile-skills">
        {Array.from(skillGroups.entries()).map(([category, entries]) => (
          <div key={category} className="profile-skills__group">
            <h3 className="profile-skills__group-title">{category}</h3>
            <ul className="profile-skills__list">
              {entries.map((skill) => (
                <li key={skill.name} className="profile-skills__item">
                  <span className="profile-skills__name">{skill.name}</span>
                  <span className={`profile-skills__level profile-skills__level--${skill.level}`}>
                    {skill.level}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}

interface ProfileLinksProps {
  resume: ResumeMeta | null;
}

export function ProfileLinks({ resume }: ProfileLinksProps) {
  return (
    <section className="profile-section" aria-labelledby="links-heading">
      <h2 id="links-heading" className="profile-section__heading">Quick Links</h2>
      <div className="profile-links">
        <a href="/profile/resume" className="profile-links__link">
          <span className="profile-links__link-icon" aria-hidden="true">R</span>
          <div>
            <span className="profile-links__link-title">Resume{resume ? ` — ${resume.fileName}` : ""}</span>
            {resume && (
              <span className="profile-links__link-desc">
                Uploaded {new Date(resume.uploadedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
              </span>
            )}
          </div>
        </a>
        <a href="/my-jobs" className="profile-links__link">
          <span className="profile-links__link-icon" aria-hidden="true">J</span>
          <div>
            <span className="profile-links__link-title">My Jobs</span>
            <span className="profile-links__link-desc">View saved, applied, and tracked jobs</span>
          </div>
        </a>
        <a href="/ai-career-tools" className="profile-links__link">
          <span className="profile-links__link-icon" aria-hidden="true">A</span>
          <div>
            <span className="profile-links__link-title">AI Career Tools</span>
            <span className="profile-links__link-desc">Resume review, career guidance, salary benchmarks</span>
          </div>
        </a>
      </div>
    </section>
  );
}
