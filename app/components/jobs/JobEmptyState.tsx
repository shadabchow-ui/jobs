interface JobEmptyStateProps {
  query: string;
  location: string;
}

export function JobEmptyState({ query, location }: JobEmptyStateProps) {
  const hasFilters = query || location;

  return (
    <div className="job-empty-state" role="status">
      {hasFilters ? (
        <>
          <h2 className="job-empty-state__heading">No jobs found</h2>
          <p className="job-empty-state__body">
            We couldn&apos;t find any jobs matching your search. Try adjusting your
            keywords or removing filters.
          </p>
        </>
      ) : (
        <>
          <h2 className="job-empty-state__heading">No jobs available</h2>
          <p className="job-empty-state__body">
            There are currently no job listings. Check back soon.
          </p>
        </>
      )}
    </div>
  );
}
