"use client";

import { getClientPublicEnv } from "@/config/public-env";
import { MEDIA_MODE } from "@/constants/base";

const isAbsoluteUrl = (url: string) => /^https?:\/\//.test(url);

const renderMediaPath = (url: string) => {
  const { NEXT_PUBLIC_BASE_MEDIA: baseMedia } = getClientPublicEnv();

  if (MEDIA_MODE !== "1" || !baseMedia || isAbsoluteUrl(url)) {
    return url;
  }

  return `${baseMedia.replace(/\/$/, "")}/${url.replace(/^\//, "")}`;
};

export const renderUrlImage = (url: string) => {
  return `url(${renderMediaPath(url)})`;
};
