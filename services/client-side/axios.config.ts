"use client";
import axios from "axios";
import { getClientPublicEnv } from "@/config/public-env";
import JSCookie from "js-cookie";
import { TokenProps } from "@/types/metadata";
import dayjs from "dayjs";
import { ErrorCode } from "@/types/errorCode";
let onSpecialError: ((data: any) => void) | null = null;
let clientAccessToken = "";
let clientSecureImageToken = "";
const clientAccessTokenListeners = new Set<(accessToken: string) => void>();
const clientSecureImageTokenListeners = new Set<
  (secureImageToken: string) => void
>();

export const registerOnSpecialError = (fn: (data: any) => void) => {
  onSpecialError = fn;
};

export const getClientAccessToken = () => clientAccessToken;
export const getClientSecureImageToken = () => clientSecureImageToken;

export const subscribeClientAccessToken = (
  listener: (accessToken: string) => void,
) => {
  clientAccessTokenListeners.add(listener);

  return () => {
    clientAccessTokenListeners.delete(listener);
  };
};

export const subscribeClientSecureImageToken = (
  listener: (secureImageToken: string) => void,
) => {
  clientSecureImageTokenListeners.add(listener);

  return () => {
    clientSecureImageTokenListeners.delete(listener);
  };
};

const setClientAccessToken = (accessToken: string) => {
  if (clientAccessToken === accessToken) return;

  clientAccessToken = accessToken;
  clientAccessTokenListeners.forEach((listener) => listener(accessToken));
};

const setClientSecureImageToken = (secureImageToken: string) => {
  if (clientSecureImageToken === secureImageToken) return;

  clientSecureImageToken = secureImageToken;
  clientSecureImageTokenListeners.forEach((listener) =>
    listener(secureImageToken),
  );
};

const instance = axios.create({
  baseURL: getClientPublicEnv().NEXT_PUBLIC_API_BACKEND,
});

const instancePlus = axios.create({
  baseURL: getClientPublicEnv().NEXT_PUBLIC_API_PLUS,
});

instance.interceptors.request.use((config) => {
  if (clientAccessToken) {
    config.headers.Authorization = `Bearer ${clientAccessToken}`;
  }

  return config;
});

instance.interceptors.response.use(
  (res) => {
    if (res?.data?.code && ErrorCode.find((e) => e.code === res?.data?.code)) {
      if (onSpecialError) onSpecialError(res);
      return Promise.reject({ isSpecialError: true, data: res });
    }

    return res;
  },
  (err) => Promise.reject(err),
);

export const setToken = (token: TokenProps) => {
  setClientSecureImageToken(token?.secureImageToken || "");
  const secureImageCookie = `${token.authen}-secure-image`;
  const domain =
    token.cookieDomain ||
    (typeof window !== "undefined" ? window.location.hostname : "");

  if (token?.new) {
    JSCookie.set(token.authen, token.tokenValue, {
      expires: token.expireTime
        ? dayjs(token.expireTime).toDate()
        : dayjs().add(10, "hour").toDate(),
      ...(domain ? { domain } : {}),
    });
    if (token.secureImageToken) {
      JSCookie.set(secureImageCookie, token.secureImageToken, {
        expires: token.expireTime
          ? dayjs(token.expireTime).toDate()
          : dayjs().add(10, "hour").toDate(),
      });
    }
    setClientAccessToken(token.tokenValue || "");
  } else {
    const token_old = JSCookie.get(token.authen) || "";
    const secureImageTokenOld =
      token.secureImageToken || JSCookie.get(secureImageCookie) || "";
    setClientAccessToken(token_old);
    setClientSecureImageToken(secureImageTokenOld);
  }
};
export const AxiosConfig = () => {
  return instance;
};

export const AxiosPlusConfig = () => {
  return instancePlus;
};
