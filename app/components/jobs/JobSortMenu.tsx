interface JobSortMenuProps {
  current: string;
}

const SORT_OPTIONS = [
  { value: "relevance", label: "Relevance" },
  { value: "date", label: "Date" },
  { value: "salary", label: "Salary" },
] as const;

export function JobSortMenu({ current }: JobSortMenuProps) {
  return (
    <div className="job-sort-menu">
      <label htmlFor="job-sort-select" className="job-sort-menu__label">
        Sort by
      </label>
      <select
        id="job-sort-select"
        name="sort"
        defaultValue={current}
        form="job-search-form"
        className="job-sort-menu__select"
      >
        {SORT_OPTIONS.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      <noscript>
        <button type="submit" form="job-search-form" className="job-sort-menu__btn">
          Sort
        </button>
      </noscript>
    </div>
  );
}
