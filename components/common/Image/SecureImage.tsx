"use client";

import type { ImageProps } from "app/image";
import { getClientPublicEnv } from "@/config/public-env";
import { useEffect, useRef, useState } from "react";
import moment from "moment-timezone";
import { imageSignHelper } from "@/security/client/sign-helper";
import JSCookie from "js-cookie";
import { v4 as uuidv4 } from "uuid";
import {
  getClientSecureImageToken,
  subscribeClientSecureImageToken,
} from "@/services/client-side/axios.config";

interface ImagePropsCustom extends ImageProps {
  startTime?: number;
  endTime?: number;
  access_token?: string;
  secure_image_token?: string;
}

const SECURE_IMAGE_CACHE_TTL = 30 * 60 * 1000;
const SECURE_IMAGE_CACHE_SKEW = 30 * 1000;
const SECURE_IMAGE_LOCAL_STORAGE_PREFIX = "secure-image-cache-v3:";
const SECURE_IMAGE_LOCAL_STORAGE_EXPIRES_PREFIX =
  "secure-image-cache-expires-v3:";
const secureImageSrcCache = new Map<
  string,
  {
    src: string;
    expiresAt: number;
  }
>();

const getSecureImageLocalStorage = () => {
  if (typeof window === "undefined") return null;

  try {
    return window.localStorage;
  } catch {
    return null;
  }
};

const getSecureImageCache = (cacheKey: string, nowMs: number) => {
  const cached = secureImageSrcCache.get(cacheKey);

  if (cached && cached.expiresAt > nowMs) {
    return cached.src;
  }

  if (cached) {
    secureImageSrcCache.delete(cacheKey);
  }

  const storage = getSecureImageLocalStorage();
  if (!storage) return "";

  try {
    const storageKey = `${SECURE_IMAGE_LOCAL_STORAGE_PREFIX}${cacheKey}`;
    const expiresKey = `${SECURE_IMAGE_LOCAL_STORAGE_EXPIRES_PREFIX}${cacheKey}`;
    const src = storage.getItem(storageKey);
    const expiresAt = Number(storage.getItem(expiresKey) || 0);

    if (src && expiresAt > nowMs) {
      secureImageSrcCache.set(cacheKey, { src, expiresAt });
      return src;
    }

    storage.removeItem(storageKey);
    storage.removeItem(expiresKey);
  } catch {
    // Fall back to the in-memory cache when storage is unavailable or full.
  }

  return "";
};

const setSecureImageCache = (
  cacheKey: string,
  src: string,
  expiresAt: number,
) => {
  secureImageSrcCache.set(cacheKey, {
    src,
    expiresAt,
  });

  const storage = getSecureImageLocalStorage();
  if (!storage) return;

  try {
    storage.setItem(`${SECURE_IMAGE_LOCAL_STORAGE_PREFIX}${cacheKey}`, src);
    storage.setItem(
      `${SECURE_IMAGE_LOCAL_STORAGE_EXPIRES_PREFIX}${cacheKey}`,
      `${expiresAt}`,
    );
  } catch {
    // Keep the in-memory entry if localStorage is unavailable or full.
  }
};

const getSecureImageTokenCookieName = () => {
  return `${
    getClientPublicEnv().NEXT_PUBLIC_AUTH_COOKIE || "vtc-jwt"
  }-secure-image`;
};

const getSecureImageToken = () => {
  return (
    JSCookie.get(getSecureImageTokenCookieName()) ||
    getClientSecureImageToken() ||
    ""
  );
};

const SecureImage = ({
  startTime,
  endTime,
  access_token,
  secure_image_token,
  src,
  width,
  height,
  quality,
  alt,
  ...imgProps
}: ImagePropsCustom) => {
  const { onLoad, onError, style, className, ...restImgProps } = imgProps;
  const [isLoading, setIsLoading] = useState(false);
  const [clientSecureImageToken, setClientSecureImageToken] =
    useState(getSecureImageToken);
  const [secureSrc, setSecureSrc] = useState("");
  const imgRef = useRef<HTMLImageElement>(null);
  const originalUrl = typeof src === "string" ? src : (src as any)?.src ?? "";
  const imageWidth = typeof width === "number" ? `${width}px` : width;
  const imageHeight = typeof height === "number" ? `${height}px` : height;
  const encryptedAccessToken =
    secure_image_token || access_token || clientSecureImageToken;

  useEffect(() => {
    let isMounted = true;

    const buildSecureSrc = async () => {
      if (!originalUrl || !encryptedAccessToken) {
        if (isMounted) setSecureSrc("");
        return;
      }

      const w = Number(width) || 384;
      const q = Number(quality) || 75;
      const cacheKey = `${originalUrl}|${w}|${q}|${encryptedAccessToken}`;
      const nowMs = Date.now();
      const cachedSrc = getSecureImageCache(cacheKey, nowMs);

      if (cachedSrc) {
        if (isMounted) setSecureSrc(cachedSrc);
        return;
      }

      const time = moment().tz("Asia/Bangkok").unix();
      const signedStartTime =
        typeof startTime === "number" && Number.isFinite(startTime)
          ? startTime
          : time - 60;
      const signedEndTime =
        typeof endTime === "number" && Number.isFinite(endTime)
          ? endTime
          : time + SECURE_IMAGE_CACHE_TTL / 1000;
      const session = `${time}${uuidv4()}`;
      const sign = await imageSignHelper({
        time,
        startTime: signedStartTime,
        endTime: signedEndTime,
        url: originalUrl,
        W: w,
        Q: q,
        session: session,
      });
      const query = new URLSearchParams({
        url: originalUrl,
        startTime: `${signedStartTime}`,
        endTime: `${signedEndTime}`,
        time: `${time}`,
        sign,
        w: `${w}`,
        q: `${q}`,
        access_token: encryptedAccessToken,
        session: session,
      });
      const basePath = getClientPublicEnv().NEXT_PUBLIC_API_SECURE_IMAGE || "";
      const fullPath = `${basePath}/GetDecodeImage?${query.toString()}`;
      const expiresAt = Math.min(
        nowMs + SECURE_IMAGE_CACHE_TTL,
        signedEndTime * 1000 - SECURE_IMAGE_CACHE_SKEW,
      );

      if (expiresAt > nowMs) {
        setSecureImageCache(cacheKey, fullPath, expiresAt);
      }

      if (isMounted) setSecureSrc(fullPath);
    };

    buildSecureSrc();

    return () => {
      isMounted = false;
    };
  }, [encryptedAccessToken, endTime, originalUrl, quality, startTime, width]);

  useEffect(() => {
    setClientSecureImageToken(getSecureImageToken());

    return subscribeClientSecureImageToken((nextSecureImageToken) => {
      setClientSecureImageToken(nextSecureImageToken || getSecureImageToken());
    });
  }, []);

  useEffect(() => {
    if (!secureSrc) {
      setIsLoading(false);
      return;
    }

    const image = imgRef.current;

    setIsLoading(!image?.complete);
  }, [secureSrc]);

  return (
    <>
      {isLoading && (
        <span className="absolute inset-0 z-[1] flex items-center justify-center">
          <span className="block size-[28px] animate-spin rounded-full border-[3px] border-[#f4a0c4] border-t-transparent" />
        </span>
      )}
      <img
        ref={imgRef}
        {...restImgProps}
        // width={width}
        // height={height}
        className={className}
        src={secureSrc}
        alt={alt}
        onLoad={(event) => {
          setIsLoading(false);
          onLoad?.(event);
        }}
        onError={(event) => {
          setIsLoading(false);
          onError?.(event);
        }}
        style={{
          ...style,
          opacity: isLoading ? 0 : style?.opacity,
        }}
      />
    </>
  );
};

export default SecureImage;
