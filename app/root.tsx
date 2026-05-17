import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
} from "@remix-run/react";
import { json, type LoaderFunctionArgs } from "@remix-run/cloudflare";

import { SiteHeader } from "~/components/shell/SiteHeader";
import { SiteNav } from "~/components/shell/SiteNav";
import { SiteFooter } from "~/components/shell/SiteFooter";

import tokensCss from "~/styles/tokens.css?url";
import shellCss from "~/styles/shell.css?url";
import layoutCss from "~/styles/layout.css?url";
import listingCss from "~/styles/listing.css?url";
import jobDetailCss from "~/styles/job-detail.css?url";
import myJobsCss from "~/styles/my-jobs.css?url";
import profileCss from "~/styles/profile.css?url";

export function links() {
  return [
    { rel: "stylesheet", href: tokensCss },
    { rel: "stylesheet", href: shellCss },
    { rel: "stylesheet", href: layoutCss },
    { rel: "stylesheet", href: listingCss },
    { rel: "stylesheet", href: jobDetailCss },
    { rel: "stylesheet", href: myJobsCss },
    { rel: "stylesheet", href: profileCss },
  ];
}

interface RootLoaderData {
  currentUrl: string;
}

export async function loader({ request }: LoaderFunctionArgs) {
  return json<RootLoaderData>({ currentUrl: request.url });
}

export default function App() {
  const { currentUrl } = useLoaderData<typeof loader>();

  return (
    <html lang="en-US">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <a href="#main-content" className="skip-link">
          Skip to main content
        </a>

        <SiteHeader currentUrl={currentUrl} />
        <SiteNav />

        <main id="main-content">
          <Outlet />
        </main>

        <SiteFooter />

        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export function ErrorBoundary() {
  return (
    <html lang="en-US">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Something went wrong — Jobs Board</title>
        <Links />
      </head>
      <body>
        <div
          style={{
            maxWidth: "600px",
            margin: "80px auto",
            padding: "0 16px",
            textAlign: "center",
            fontFamily: "system-ui, sans-serif",
          }}
        >
          <h1 style={{ fontSize: "1.5rem", marginBottom: "16px" }}>Something went wrong</h1>
          <p style={{ color: "#6e7a87", marginBottom: "24px" }}>
            An unexpected error occurred. Please try again or return to the homepage.
          </p>
          <a href="/" style={{ color: "#333" }}>
            Return to homepage
          </a>
        </div>
        <Scripts />
      </body>
    </html>
  );
}
