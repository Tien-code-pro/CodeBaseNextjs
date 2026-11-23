import { MEDIA_MODE, NEXT_PUBLIC_BASE_MEDIA } from "../../constants/base";

const isAbsoluteUrl = (url: string) => /^https?:\/\//.test(url);

const renderMediaPathServer = (url: string) => {
  const baseMedia = NEXT_PUBLIC_BASE_MEDIA;

  if (MEDIA_MODE !== "1" || !baseMedia || isAbsoluteUrl(url)) {
    return url;
  }

  return `${baseMedia.replace(/\/$/, "")}/${url.replace(/^\//, "")}`;
};

export const renderUrlImageServer = (url: string) => {
  return `url(${renderMediaPathServer(url)})`;
};

export const renderImageServer = (url: string) => {
  return renderMediaPathServer(url);
};

export const renderTailwindBackgroudImage = (url: string) => {
  const resolvedUrl = renderMediaPathServer(url);

  if (MEDIA_MODE === "1" || isAbsoluteUrl(resolvedUrl)) {
    return `url(${resolvedUrl})`;
  }

  const normalizedBasePath = process.env.NEXT_PUBLIC_BASE_PATH?.trim().replace(
    /^\/+|\/+$/g,
    "",
  );
  const basePath = normalizedBasePath ? `/${normalizedBasePath}` : "";
  const localPath = `/${resolvedUrl.replace(/^\/+/, "")}`;
  const resolvedLocalPath =
    !basePath || localPath === basePath || localPath.startsWith(`${basePath}/`)
      ? localPath
      : `${basePath}${localPath}`;

  return `url(${resolvedLocalPath})`;
};
