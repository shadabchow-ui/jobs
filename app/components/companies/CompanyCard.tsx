import { Link } from "@remix-run/react";
import type { CompanyFixture } from "~/types/page-model.types";

interface CompanyCardProps {
  company: CompanyFixture;
  openJobCount: number;
}

function StarRating({ rating, size = "sm" }: { rating: number; size?: "sm" | "md" }) {
  const stars = Math.round(rating);
  const starClass = size === "md" ? "company-card__star--md" : "";
  return (
    <span className={`company-card__stars ${starClass}`} aria-label={`${rating.toFixed(1)} out of 5 stars`}>
      {Array.from({ length: 5 }, (_, i) => (
        <svg
          key={i}
          className={`company-card__star ${i < stars ? "company-card__star--filled" : ""}`}
          viewBox="0 0 20 20"
          fill="currentColor"
          width={size === "md" ? 18 : 14}
          height={size === "md" ? 18 : 14}
          aria-hidden="true"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </span>
  );
}

export function CompanyCard({ company, openJobCount }: CompanyCardProps) {
  return (
    <article className="company-card" aria-labelledby={`company-name-${company.id}`}>
      <div className="company-card__logo">
        {company.logoUrl ? (
          <img src={company.logoUrl} alt={`${company.name} logo`} className="company-card__logo-img" />
        ) : (
          <span className="company-card__logo-fallback">
            {company.name.charAt(0)}
          </span>
        )}
      </div>

      <div className="company-card__body">
        <h2 id={`company-name-${company.id}`} className="company-card__name">
          <Link to={`/companies/${company.slug}`} className="company-card__name-link">
            {company.name}
          </Link>
        </h2>

        <p className="company-card__meta">
          <span className="company-card__industry">{company.industry}</span>
          {company.headquarters && (
            <>
              <span className="company-card__sep" aria-hidden="true">·</span>
              <span className="company-card__location">{company.headquarters}</span>
            </>
          )}
        </p>

        <div className="company-card__details">
          {company.rating != null && (
            <>
              <StarRating rating={company.rating} />
              <span className="company-card__rating-text">
                {company.rating.toFixed(1)}
              </span>
              {company.reviewCount != null && (
                <span className="company-card__review-count">
                  ({company.reviewCount.toLocaleString()} reviews)
                </span>
              )}
            </>
          )}
        </div>

        <div className="company-card__footer">
          <span className="company-card__job-count">
            {openJobCount > 0 ? `${openJobCount} open job${openJobCount !== 1 ? "s" : ""}` : "No open jobs"}
          </span>
        </div>
      </div>
    </article>
  );
}

export { StarRating };
