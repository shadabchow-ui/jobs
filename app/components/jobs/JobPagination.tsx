import { Link } from "@remix-run/react";

interface JobPaginationProps {
  page: number;
  totalPages: number;
  query: string;
  location: string;
  sort: string;
  remote: string;
  salary: string;
  jobType: string;
  experience: string;
}

export function JobPagination({
  page,
  totalPages,
  query,
  location,
  sort,
  remote,
  salary,
  jobType,
  experience,
}: JobPaginationProps) {
  if (totalPages <= 1) return null;

  const buildUrl = (p: number) => {
    const params = new URLSearchParams();
    if (query) params.set("q", query);
    if (location) params.set("l", location);
    if (sort) params.set("sort", sort);
    if (remote) params.set("remote", remote);
    if (salary) params.set("salary", salary);
    if (jobType) params.set("jobType", jobType);
    if (experience) params.set("experience", experience);
    params.set("page", String(p));
    return `/jobs?${params.toString()}`;
  };

  return (
    <nav className="job-pagination" aria-label="Pagination">
      {page > 1 && (
        <Link to={buildUrl(page - 1)} className="job-pagination__prev">
          Previous
        </Link>
      )}

      <span className="job-pagination__info">
        Page {page} of {totalPages}
      </span>

      {page < totalPages && (
        <Link to={buildUrl(page + 1)} className="job-pagination__next">
          Next
        </Link>
      )}
    </nav>
  );
}
