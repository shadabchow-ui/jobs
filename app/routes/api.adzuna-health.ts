import { json, type LoaderFunctionArgs } from "@remix-run/cloudflare";
import { getAdzunaHealth } from "~/services/adzuna.server";

export async function loader({ context }: LoaderFunctionArgs) {
  const cf = context?.cloudflare as
    | { env: { ADZUNA_APP_ID?: string; ADZUNA_APP_KEY?: string; ADZUNA_COUNTRY?: string } }
    | undefined;
  const health = await getAdzunaHealth(cf?.env);
  return json(health);
}
