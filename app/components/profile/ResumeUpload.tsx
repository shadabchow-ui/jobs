import type { ResumeMeta } from "~/types/profile.types";

interface ResumeUploadProps {
  resume: ResumeMeta | null;
}

export function ResumeUpload({ resume }: ResumeUploadProps) {
  return (
    <section className="profile-section" aria-labelledby="resume-upload-heading">
      <h2 id="resume-upload-heading" className="profile-section__heading">Resume</h2>
      <div className="resume-upload">
        {resume ? (
          <div className="resume-upload__current">
            <div className="resume-upload__file-info">
              <span className="resume-upload__file-icon" aria-hidden="true">PDF</span>
              <div>
                <p className="resume-upload__file-name">{resume.fileName}</p>
                <p className="resume-upload__file-meta">
                  {Math.round(resume.fileSize / 1024)} KB · Uploaded{" "}
                  {new Date(resume.uploadedAt).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </p>
              </div>
            </div>
            {resume.parsedAt && (
              <span className="resume-upload__parsed-badge">Parsed</span>
            )}
          </div>
        ) : (
          <div className="resume-upload__empty">
            <p className="resume-upload__empty-text">
              You haven&apos;t uploaded a resume yet. Upload one to enable AI matching and profile completion.
            </p>
          </div>
        )}

        <form
          className="resume-upload__form"
          method="post"
          action="/profile/resume"
          encType="multipart/form-data"
          onSubmit={(e) => e.preventDefault()}
        >
          <div className="resume-upload__input-row">
            <input
              id="resume-file"
              className="resume-upload__file-input"
              type="file"
              name="resume"
              accept=".pdf,.doc,.docx,.txt"
              aria-label="Choose resume file to upload"
            />
            <button type="submit" className="resume-upload__btn" disabled>
              {resume ? "Replace Resume" : "Upload Resume"}
            </button>
          </div>
          <p className="resume-upload__hint">
            Accepted formats: PDF, DOC, DOCX, TXT. Max file size: 5 MB.
          </p>
        </form>

        <div className="resume-upload__privacy" role="note">
          <h3 className="resume-upload__privacy-title">Privacy Note</h3>
          <ul className="resume-upload__privacy-list">
            <li>Your resume is used for job matching only after you apply to a role.</li>
            <li>We do not generate fake experience or alter your resume data.</li>
            <li>Resume data is stored securely and never shared without your consent.</li>
          </ul>
        </div>
      </div>
    </section>
  );
}
