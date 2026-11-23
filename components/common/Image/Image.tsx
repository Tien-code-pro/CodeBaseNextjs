"use client";

import NextImage, {
  type ImageProps as NextImageProps,
  type StaticImageData,
} from "next/image";
import { getClientPublicEnv } from "@/config/public-env";
import { MEDIA_MODE } from "@/constants/base";
import { forwardRef, useState } from "react";

export type ImageProps = NextImageProps & {
  fallbackSrc?: NextImageProps["src"];
  showLoading?: boolean;
  loadingClassName?: string;
};

type SourceKind = "cdn" | "external" | "inline" | "local" | "static";

type ResolvedSource = {
  kind: SourceKind;
  src: NextImageProps["src"];
};

const DEFAULT_FALLBACK_SRC =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1 1'%3E%3Crect width='1' height='1' fill='%23e5e7eb'/%3E%3C/svg%3E";

const getStaticSource = (src: Exclude<NextImageProps["src"], string>) =>
  "default" in src ? src.default : (src as StaticImageData);

const getSourceKey = (src: NextImageProps["src"]) =>
  typeof src === "string" ? src : getStaticSource(src).src;

const getHttpUrl = (value?: string) => {
  if (!value) {
    return null;
  }

  try {
    const url = new URL(value);
    return /^https?:$/i.test(url.protocol) ? url : null;
  } catch {
    return null;
  }
};

const normalizeBasePath = (value?: string) => {
  const normalized = value?.trim().replace(/^\/+|\/+$/g, "");
  return normalized ? `/${normalized}` : "";
};

const resolveLocalSource = (value: string, basePath: string) => {
  const localPath = `/${value.replace(/^\/+/, "")}`;

  if (
    !basePath ||
    localPath === basePath ||
    localPath.startsWith(`${basePath}/`)
  ) {
    return localPath;
  }

  return `${basePath}${localPath}`;
};

const isCdnUrl = (url: URL, cdnBaseUrl: URL | null) =>
  Boolean(cdnBaseUrl && url.origin === cdnBaseUrl.origin);

const resolveSource = (
  src: NextImageProps["src"],
  mediaMode: string,
  baseMedia: string,
  basePath: string,
): ResolvedSource | null => {
  if (!src) {
    return null;
  }

  if (typeof src !== "string") {
    return { kind: "static", src };
  }

  const value = src.trim().replace(/\\/g, "/");

  if (!value) {
    return null;
  }

  if (/^(data|blob):/i.test(value)) {
    return { kind: "inline", src: value };
  }

  const cdnBaseUrl = getHttpUrl(baseMedia);
  const absoluteValue = value.startsWith("//") ? `https:${value}` : value;
  const absoluteUrl = getHttpUrl(absoluteValue);

  if (absoluteUrl) {
    return {
      kind: isCdnUrl(absoluteUrl, cdnBaseUrl) ? "cdn" : "external",
      src: absoluteUrl.toString(),
    };
  }

  if (/^[a-z][a-z\d+.-]*:/i.test(value)) {
    return null;
  }

  if (mediaMode === "1" && cdnBaseUrl) {
    const cdnRoot = `${cdnBaseUrl.toString().replace(/\/$/, "")}/`;
    const cdnSrc = new URL(value.replace(/^\/+/, ""), cdnRoot);
    return { kind: "cdn", src: cdnSrc.toString() };
  }

  return {
    kind: "local",
    src: resolveLocalSource(value, basePath),
  };
};

const Image = forwardRef<HTMLImageElement, ImageProps>(function Image(
  {
    src,
    fallbackSrc = DEFAULT_FALLBACK_SRC,
    showLoading = false,
    loadingClassName = "animate-pulse bg-gray-200",
    unoptimized,
    loader,
    className,
    onLoad,
    onError,
    alt,
    ...props
  },
  ref,
) {
  const publicEnv = getClientPublicEnv();
  const baseMedia = publicEnv.NEXT_PUBLIC_BASE_MEDIA || "";
  const basePath = normalizeBasePath(publicEnv.NEXT_PUBLIC_BASE_PATH);
  const defaultFallback = resolveSource(
    DEFAULT_FALLBACK_SRC,
    MEDIA_MODE,
    baseMedia,
    basePath,
  ) as ResolvedSource;
  const resolvedFallback =
    resolveSource(fallbackSrc, MEDIA_MODE, baseMedia, basePath) ||
    defaultFallback;
  const resolvedPrimary =
    resolveSource(src, MEDIA_MODE, baseMedia, basePath) || resolvedFallback;
  const primaryKey = getSourceKey(resolvedPrimary.src);
  const fallbackKey = getSourceKey(resolvedFallback.src);
  const [failedSource, setFailedSource] = useState<string | null>(null);
  const [loadedSource, setLoadedSource] = useState<string | null>(null);
  const shouldUseFallback =
    failedSource === primaryKey && primaryKey !== fallbackKey;
  const resolvedSource = shouldUseFallback ? resolvedFallback : resolvedPrimary;
  const resolvedSourceKey = getSourceKey(resolvedSource.src);
  const isLoading = loadedSource !== resolvedSourceKey;
  const shouldUnoptimize =
    Boolean(unoptimized) || resolvedSource.kind === "inline";
  const resolvedClassName = [
    className,
    showLoading && isLoading ? loadingClassName : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <NextImage
      {...props}
      ref={ref}
      src={resolvedSource.src}
      alt={alt}
      loader={loader}
      unoptimized={shouldUnoptimize}
      className={resolvedClassName || undefined}
      data-loading={showLoading && isLoading ? "true" : undefined}
      aria-busy={showLoading ? isLoading : props["aria-busy"]}
      onLoad={(event) => {
        setLoadedSource(resolvedSourceKey);
        onLoad?.(event);
      }}
      onError={(event) => {
        if (resolvedSourceKey !== fallbackKey) {
          console.log("error Image", primaryKey);
          setFailedSource(primaryKey);
        } else {
          setLoadedSource(resolvedSourceKey);
        }

        onError?.(event);
      }}
    />
  );
});

export default Image;
