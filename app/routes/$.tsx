import { useRouteError, isRouteErrorResponse } from "@remix-run/react";
import type { MetaFunction } from "@remix-run/cloudflare";

export const meta: MetaFunction = () => [
  { title: "Page not found — Jobs Board" },
  { name: "robots", content: "noindex" },
];

export default function NotFound() {
  return <NotFoundContent />;
}

export function ErrorBoundary() {
  const error = useRouteError();

  if (isRouteErrorResponse(error)) {
    if (error.status === 404) {
      return <NotFoundContent />;
    }
    return <ErrorContent status={error.status} />;
  }

  return <ErrorContent status={500} />;
}

function NotFoundContent() {
  return (
    <div className="placeholder-page">
      <div className="placeholder-page__inner">
        <h1>Page Not Found</h1>
        <p>The page you are looking for does not exist or has been moved.</p>
        <a href="/" className="placeholder-page__link">
          Return to homepage
        </a>
      </div>
    </div>
  );
}

function ErrorContent({ status }: { status: number }) {
  return (
    <div className="placeholder-page">
      <div className="placeholder-page__inner">
        <h1>{status === 503 ? "Temporarily Unavailable" : "Something Went Wrong"}</h1>
        <p>
          {status === 503
            ? "This page is temporarily unavailable. Please try again shortly."
            : "An unexpected error occurred. Please try again or return to the homepage."}
        </p>
        <a href="/" className="placeholder-page__link">
          Return to homepage
        </a>
      </div>
    </div>
  );
}
