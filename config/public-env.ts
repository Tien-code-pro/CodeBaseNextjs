import { createPublicEnv } from "next-public-env";

export type PublicEnv = {
  [key: `NEXT_PUBLIC_${string}`]: string | undefined;
  NEXT_PUBLIC_MODE?: string;
  NEXT_PUBLIC_BASE_PATH?: string;
  NEXT_PUBLIC_API_BACKEND?: string;
  NEXT_PUBLIC_API_PLUS?: string;
  NEXT_PUBLIC_API_SECURE_IMAGE?: string;
  NEXT_PUBLIC_API_SECRET?: string;
  NEXT_PUBLIC_AUTH_COOKIE?: string;
  NEXT_PUBLIC_MAKER_CODE?: string;
  NEXT_PUBLIC_BASE_MEDIA?: string;
  NEXT_PUBLIC_SITE_URL?: string;
};

const publicEnvValues: PublicEnv =
  typeof window === "undefined"
    ? (Object.fromEntries(
        Object.entries(process.env).filter(([key]) =>
          key.startsWith("NEXT_PUBLIC_"),
        ),
      ) as PublicEnv)
    : {};

export const { getPublicEnv, PublicEnv } = createPublicEnv(publicEnvValues, {
  // This base uses `output: "export"`; public values are embedded at build time.
  dynamicRendering: "manual",
});

export const getClientPublicEnv = (): ReturnType<typeof getPublicEnv> => {
  if (typeof window === "undefined") {
    return publicEnvValues;
  }

  return getPublicEnv();
};
