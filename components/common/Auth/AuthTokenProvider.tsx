import { AuthTokenClient } from "./AuthTokenClient";

const isHtmlMode = () => (process.env.NEXT_PUBLIC_MODE || "html") === "html";

export const AuthTokenProvider = async () => {
  if (isHtmlMode()) return null;

  const { requireAuth } = await import("@/services/server-side/authen");
  const token = await requireAuth();

  return <AuthTokenClient token={token} />;
};
