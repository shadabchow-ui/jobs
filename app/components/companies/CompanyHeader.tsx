import { Link } from "@remix-run/react";
import type { CompanyFixture } from "~/types/page-model.types";
import { StarRating } from "~/components/companies/CompanyCard";

interface CompanyHeaderProps {
  company: CompanyFixture;
}

export function CompanyHeader({ company }: CompanyHeaderProps) {
  return (
    <div className="company-header">
      <div className="company-header__logo">
        {company.logoUrl ? (
          <img src={company.logoUrl} alt={`${company.name} logo`} className="company-header__logo-img" />
        ) : (
          <span className="company-header__logo-fallback">
            {company.name.charAt(0)}
          </span>
        )}
      </div>

      <div className="company-header__info">
        <h1 className="company-header__title">{company.name}</h1>

        <div className="company-header__meta">
          <span className="company-header__industry">{company.industry}</span>
          <span className="company-header__sep" aria-hidden="true">·</span>
          <span className="company-header__hq">{company.headquarters}</span>
        </div>

        {company.rating != null && (
          <div className="company-header__rating">
            <StarRating rating={company.rating} size="md" />
            <span className="company-header__rating-score">
              {company.rating.toFixed(1)}
            </span>
            {company.reviewCount != null && (
              <span className="company-header__review-count">
                {company.reviewCount.toLocaleString()} reviews
              </span>
            )}
          </div>
        )}

        <div className="company-header__stats">
          {company.employeeCount != null && (
            <span className="company-header__stat">
              <strong>{company.employeeCount.toLocaleString()}</strong> employees
            </span>
          )}
          {company.foundedYear != null && (
            <span className="company-header__stat">
              <strong>Founded {company.foundedYear}</strong>
            </span>
          )}
          <Link to={company.website} className="company-header__website" target="_blank" rel="noopener noreferrer">
            Visit website
          </Link>
        </div>
      </div>
    </div>
  );
}
