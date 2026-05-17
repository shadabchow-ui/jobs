import type { MetaFunction } from "@remix-run/cloudflare";
import { json } from "@remix-run/cloudflare";
import { useLoaderData } from "@remix-run/react";

export async function loader() {
  return json({ message: "AI-powered career tools will appear here." });
}

export const meta: MetaFunction = () => [
  { title: "AI Career Tools — Jobs Board" },
  { name: "description", content: "AI-powered career guidance, resume reviews, salary benchmarks, and job matching." },
];

export default function AiCareerTools() {
  const { message } = useLoaderData<typeof loader>();

  return (
    <div className="placeholder-page">
      <div className="placeholder-page__inner">
        <h1>AI Career Tools</h1>
        <p>{message}</p>
        <p>This page will include AI resume review, career path suggestions, skill gap analysis, salary negotiation tips, and personalized job matches.</p>
      </div>
    </div>
  );
}
