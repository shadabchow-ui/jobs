import { createCookieSessionStorage } from "@remix-run/cloudflare";

const SESSION_SECRET = process.env.SESSION_SECRET ?? "dev-session-secret-replace-in-production";

export const sessionStorage = createCookieSessionStorage({
  cookie: {
    name: "__jobs_session",
    httpOnly: true,
    maxAge: 60 * 60 * 24 * 30,
    path: "/",
    sameSite: "strict",
    secrets: [SESSION_SECRET],
    secure: process.env.NODE_ENV === "production",
  },
});

export interface JobBoardSession {
  sessionId: string;
  userId: string | null;
}

function generateSessionId(): string {
  const bytes = crypto.getRandomValues(new Uint8Array(8));
  const hex = Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("");
  return `sess_${hex}`;
}

export async function getOrCreateSession(request: Request): Promise<{
  session: Awaited<ReturnType<typeof sessionStorage.getSession>>;
  data: JobBoardSession;
}> {
  const session = await sessionStorage.getSession(request.headers.get("Cookie"));

  let sessionId = session.get("sessionId") as string | undefined;
  if (!sessionId || !/^sess_[a-f0-9]{16}$/i.test(sessionId)) {
    sessionId = generateSessionId();
    session.set("sessionId", sessionId);
  }

  const rawUserId = session.get("userId") as string | undefined;
  const userId = typeof rawUserId === "string" && rawUserId.trim() ? rawUserId.trim() : null;

  return {
    session,
    data: { sessionId: sessionId!, userId },
  };
}

export async function commitSession(
  session: Awaited<ReturnType<typeof sessionStorage.getSession>>,
): Promise<string> {
  return sessionStorage.commitSession(session);
}
