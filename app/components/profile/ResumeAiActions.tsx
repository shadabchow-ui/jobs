import type { ResumeMeta } from "~/types/profile.types";

interface ResumeAiActionsProps {
  resume: ResumeMeta | null;
  hasParsedData: boolean;
}

export function ResumeAiActions({ resume: _resume, hasParsedData }: ResumeAiActionsProps) {
  return (
    <section className="profile-section" aria-labelledby="resume-ai-heading">
      <h2 id="resume-ai-heading" className="profile-section__heading">AI Resume Tools</h2>
      <div className="resume-ai-actions">
        <button type="button" className="resume-ai-actions__btn" disabled>
          <span className="resume-ai-actions__btn-title">Parse Resume</span>
          <span className="resume-ai-actions__btn-desc">
            {hasParsedData
              ? "Re-parse to update extracted skills and roles."
              : "Extract skills, roles, and experience from your resume."}
          </span>
        </button>
        <button type="button" className="resume-ai-actions__btn" disabled>
          <span className="resume-ai-actions__btn-title">Extract Skills</span>
          <span className="resume-ai-actions__btn-desc">
            Identify and categorize skills from your experience.
          </span>
        </button>
        <button type="button" className="resume-ai-actions__btn" disabled>
          <span className="resume-ai-actions__btn-title">Match Me to Jobs</span>
          <span className="resume-ai-actions__btn-desc">
            Find jobs that match your resume skills and experience.
          </span>
        </button>
      </div>
      {!hasParsedData && (
        <p className="resume-ai-actions__note">
          Upload a resume above to enable AI parsing and job matching.
        </p>
      )}

      {hasParsedData && _resume?.summaryText && (
        <div className="resume-ai-actions__preview">
          <h3 className="resume-ai-actions__preview-title">Resume Summary</h3>
          <p className="resume-ai-actions__preview-text">{_resume.summaryText}</p>
        </div>
      )}

      {hasParsedData && _resume?.extractedSkills && _resume.extractedSkills.length > 0 && (
        <div className="resume-ai-actions__skills">
          <h3 className="resume-ai-actions__preview-title">Extracted Skills</h3>
          <div className="resume-ai-actions__skill-tags">
            {_resume.extractedSkills.map((skill) => (
              <span key={skill} className="resume-ai-actions__skill-tag">{skill}</span>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
