"use server";
// import axios from 'axios';
import { cookies, headers } from "next/headers";
import crypto from "crypto";
import { logError, logInfo } from "@/utils/log-helper";
import axios from "axios";
import { TokenProps } from "@/types/metadata";
import dayjs from "dayjs";
import { log } from "console";
interface TokenRespon {
  code: number;
  expt: string;
  mess: string;
  data: string;
}

const encryptAESWithBase64Url = (data: string, key: string) => {
  const cipher = crypto.createCipheriv(
    "aes-128-ecb",
    Buffer.from(key, "utf8"),
    Buffer.alloc(0),
  );

  cipher.setAutoPadding(true);

  const encrypted = Buffer.concat([
    cipher.update(data, "utf8"),
    cipher.final(),
  ]);

  return encrypted
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
};

const getSecureImageToken = (tokenValue: string) => {
  if (!tokenValue) return "";

  const key = process.env.KEY_SECURE_IMAGE || "";
  if (!key) return "";

  try {
    return encryptAESWithBase64Url(tokenValue, key);
  } catch (error) {
    logError("getSecureImageToken", error);
    return "";
  }
};

const withSecureImageToken = <T extends { tokenValue: string }>(token: T) => {
  return {
    ...token,
    secureImageToken: getSecureImageToken(token.tokenValue),
  };
};

const resolveCookieDomain = (authen?: string) => {
  const configuredAuthen = (
    process.env.AUTHEN || process.env.AU_THEN || authen || ""
  ).toLowerCase();
  const baseWeb = process.env.BASE_WEB || "";

  if (
    configuredAuthen === "vtcgame-jwt" ||
    baseWeb.toLowerCase().includes(".vtcgame.vn")
  ) {
    return ".vtcgame.vn";
  }

  try {
    return new URL(baseWeb).hostname || undefined;
  } catch {
    return undefined;
  }
};

export async function getCookie(cookieName?: string) {
  const headersInstance = await headers();
  const domain = headersInstance.get("Host") || "";
  const cookieStorage = await cookies();
  let currentCookie = "";
  if (!cookieName) {
    if (domain.includes("vtc.vn")) {
      currentCookie = cookieStorage.get("auvtc.vn")?.value || "";
      logInfo("getCookie", currentCookie);
    }
    if (domain.includes("truykichpc.vn")) {
      currentCookie = cookieStorage.get("head_truykichpc.vn")?.value || "";
      logInfo("getCookie", currentCookie);
    }
    if (domain.includes("vtcgame.vn")) {
      currentCookie = cookieStorage.get(".vtcgame.vn")?.value || "";
      logInfo("getCookie", currentCookie);
    }
    if (domain.includes("localhost")) {
      // logInfo("getCookie", { currentCookie: "localhost cookies" });
    }
  } else {
    currentCookie = cookieStorage.get(cookieName)?.value || "";
    // logInfo("getCookie", cookieName, currentCookie);
  }
  return currentCookie;
}

const getTokenServer = async () => {
  const currentCookie = await getCookie();
  const beta = process.env.HOST || "";
  const key = process.env.key || "";
  const KeySignAU = process.env.API_SECRET || "";
  let signText = "";

  if (process.env.NODE_ENV === "production") {
    signText = `${dayjs().unix()}${currentCookie}${key}${KeySignAU}`;
  } else {
    signText = `${dayjs().unix()}1${key}${KeySignAU}`;
  }
  const sign = crypto.createHash("sha256").update(signText).digest("hex");

  let api_oauth = "";
  if (process.env.NODE_ENV === "production") {
    api_oauth =
      `${
        process.env.API_OAUTH
      }/api/oauth?time=${dayjs().unix()}&data=${currentCookie}&key=${key}&sign=${sign}` ||
      "";
  } else {
    api_oauth =
      `${
        process.env.API_OAUTH
      }/api/oauth?time=${dayjs().unix()}&data=1&key=${key}&sign=${sign}` || "";
  }
  if (api_oauth) {
    try {
      const res = await fetch(api_oauth, {
        method: "GET",
      });
      const data: TokenRespon = await res.json();
      const tokenName = await getSiteName();

      logInfo(
        "requireAuth",
        { api_oauth },
        { tokenName, tokenValue: data.data },
      );
      // let response = NextResponse.next();     // // Set a cookie to hide the banner
      // response.cookies.set('show-banner', 'false');
      return withSecureImageToken({
        tokenName,
        tokenValue: data.data,
        expt: data?.expt,
      });
    } catch (error) {
      // logError("Oauth", error);
      const tokenName = await getSiteName();
      return withSecureImageToken({
        tokenName,
        tokenValue: "",
        expt: "",
      });
    }
  } else {
    return withSecureImageToken({
      tokenName: "",
      tokenValue: "",
      expt: "",
    });
  }
};
export async function requireAuth() {
  const authen = process.env.AUTHEN || process.env.AU_THEN || "vtc-jwt";
  const currentToken = await getCookie(authen);
  const currentCookie = await getCookie();
  let token: TokenProps = {
    tokenName: "",
    tokenValue: currentToken,
    secureImageToken: getSecureImageToken(currentToken),
    expireTime: "",
    authen: authen,
    new: false,
  };
  const site = await getSiteName();
  const time = dayjs().unix();
  const payload = {
    time: time,
    fromIP: "",
    sign: crypto
      .createHash("sha256")
      .update(`${time}${process.env.MAKER_CODE}${process.env.API_SECRET || ""}`)
      .digest("hex"),
    makerCode: process.env.MAKER_CODE || "",
    func: "",
    data: "",
  };
  try {
    if (currentToken) {
      const user = await axios.post(
        `${process.env.API_BACKEND}/UserInfo`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${currentToken}`,
          },
        },
      );
      const userData = user?.data;
      if (userData && userData?.code > 0) {
        if (currentCookie) {
          token = {
            authen: authen,
            tokenName: site,
            tokenValue: currentToken,
            secureImageToken: getSecureImageToken(currentToken),
            expireTime: "",
            new: false,
          };
          logInfo("requireAuth has cookie", { token, userData });
        } else {
          const temp = await getTokenServer();
          token = {
            ...temp,
            authen: token.authen,
            expireTime: temp.expt,
            new: true,
          };
          logInfo("requireAuth no cookie", { token, userData });
        }
      } else {
        if (currentCookie) {
          const temp = await getTokenServer();
          token = { ...temp, authen: authen, expireTime: temp.expt, new: true };
          logInfo("requireAuth no UserInfo, has cookie", { token, userData });
        } else {
          token = {
            authen: authen,
            tokenName: site,
            tokenValue: currentToken,
            secureImageToken: getSecureImageToken(currentToken),
            expireTime: "",
            new: false,
          };
          logInfo("requireAuth no UserInfo, no cookie", { token, userData });
        }
      }
    } else {
      // const user = await axios.post(
      //   `${process.env.API_BACKEND}/UserInfo`,
      //   payload,
      //   {
      //     headers: {
      //       Authorization: `Bearer ${currentToken}`,
      //     },
      //   }
      // );
      // const userData = user?.data;
      const temp = await getTokenServer();
      token = { ...temp, authen: authen, expireTime: temp.expt, new: true };
      logInfo("requireAuth no current token", { token });
    }
  } catch (error) {
    logError("requireAuth error try 1", error);
    try {
      const temp = await getTokenServer();
      token = { ...temp, authen: authen, expireTime: temp.expt, new: true };
      logInfo("requireAuth try 2", { token });
    } catch (error) {
      logError("requireAuth error try 2", error);
    }
  }
  return {
    ...token,
    cookieDomain: resolveCookieDomain(token.authen),
  };
}
export async function cookieToken(token: TokenProps) {
  const cookieStorage = await cookies();
  if (token.new) {
    const domain = token.cookieDomain || resolveCookieDomain(token.authen);
    cookieStorage.set(token.authen, token.tokenValue, {
      expires: token.expireTime
        ? dayjs(token.expireTime).toDate()
        : dayjs().add(1, "hour").toDate(),
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      ...(domain ? { domain } : {}),
    });
    if (token.secureImageToken) {
      cookieStorage.set(
        `${token.authen}-secure-image`,
        token.secureImageToken,
        {
          expires: token.expireTime
            ? dayjs(token.expireTime).toDate()
            : dayjs().add(1, "hour").toDate(),
          httpOnly: false,
          secure: process.env.NODE_ENV === "production",
        },
      );
    }
  }
}
async function getSiteName() {
  const headersInstance = await headers();
  const domain = headersInstance.get("Host") || "";
  logInfo("getSiteName", domain);

  if (domain.includes("vtc.vn")) {
    return "auvtc.vn";
  }
  if (domain.includes("truykichpc.vn")) {
    return "head_truykichpc.vn";
  }
  if (domain.includes("vtcgame.vn")) {
    return ".vtcgame.vn";
  }
  if (domain.includes("localhost")) {
    return "localhost";
  }
  return "";
}
