function formatCurrency(amount: number, currency: string): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(amount);
}

interface SalaryDetailHeaderProps {
  title: string;
  minSalary: number;
  maxSalary: number;
  medianSalary: number;
  currency: string;
  dataPoints: number;
}

export function SalaryDetailHeader({
  title,
  minSalary,
  maxSalary,
  medianSalary,
  currency,
  dataPoints,
}: SalaryDetailHeaderProps) {
  return (
    <div className="salary-detail-header">
      <div className="salary-detail-header__info">
        <h1 className="salary-detail-header__title">{title}</h1>
        <p className="salary-detail-header__subtitle">
          Salary data based on {dataPoints.toLocaleString()} data point
          {dataPoints !== 1 ? "s" : ""}
        </p>
      </div>
      <div className="salary-detail-header__stats">
        <div className="salary-detail-header__stat">
          <span className="salary-detail-header__stat-label">Median</span>
          <span className="salary-detail-header__stat-value salary-detail-header__stat-value--median">
            {formatCurrency(medianSalary, currency)}
          </span>
        </div>
        <div className="salary-detail-header__stat">
          <span className="salary-detail-header__stat-label">Range</span>
          <span className="salary-detail-header__stat-value">
            {formatCurrency(minSalary, currency)} –{" "}
            {formatCurrency(maxSalary, currency)}
          </span>
        </div>
      </div>
    </div>
  );
}
