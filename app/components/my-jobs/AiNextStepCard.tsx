export function AiNextStepCard() {
  return (
    <section className="my-jobs-ai-card" aria-label="AI-powered next steps">
      <h2 className="my-jobs-ai-card__title">AI Next Steps</h2>
      <div className="my-jobs-ai-card__items">
        <button type="button" className="my-jobs-ai-card__item">
          <span className="my-jobs-ai-card__item-title">Get AI next steps</span>
          <span className="my-jobs-ai-card__item-desc">
            Personalized guidance for this application
          </span>
        </button>
        <button type="button" className="my-jobs-ai-card__item">
          <span className="my-jobs-ai-card__item-title">Prepare for interview</span>
          <span className="my-jobs-ai-card__item-desc">
            Common questions and talking points
          </span>
        </button>
        <button type="button" className="my-jobs-ai-card__item">
          <span className="my-jobs-ai-card__item-title">Draft follow-up</span>
          <span className="my-jobs-ai-card__item-desc">
            Generate a professional follow-up message
          </span>
        </button>
      </div>
    </section>
  );
}
