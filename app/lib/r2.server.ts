export function getR2BaseUrl(): string {
  return (
    process.env.R2_BASE_URL ?? "https://r2.example.com"
  ).replace(/\/+$/, "");
}

export const R2_BASE = getR2BaseUrl();

export function joinR2Url(key: string): string {
  return `${getR2BaseUrl()}/${key.replace(/^\/+/, "")}`;
}

export async function fetchR2Json<T = unknown>(key: string): Promise<T | null> {
  const url = joinR2Url(key);
  try {
    const res = await fetch(url, { headers: { Accept: "application/json" } });
    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch {
    return null;
  }
}
