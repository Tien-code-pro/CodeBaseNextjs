"use server";

import { ServerRequestBackend } from "@/types/request-server";
import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
dayjs.extend(utc);
dayjs.extend(timezone);
import { cookies } from "next/headers";
import crypto from "crypto";
import { v4 as uuidv4 } from "uuid";
import { logError, logInfo } from "@/utils/log-helper";
import axios, { AxiosResponse } from "axios";
import { createHttpAgent } from "@/http/temporal-loom";
import { requireAuth } from "./authen";
export const apiHelper = async (
  url: string,
  func: string,
  makerCode: string,
  data: any,
  fromIP?: string
) => {
  let res = {} as AxiosResponse;

  const token_info = await requireAuth();
  const full_path = process.env.API_BACKEND + url;
  const time = dayjs().utc().unix();
  const session = `${time}${uuidv4()}`;
  const requestInfo = new ServerRequestBackend({
    session,
    time,
    sign: "",
    makerCode: makerCode,
    func: func,
    data: data,
    fromIP: fromIP || "",
  });
  const key = `${time}${makerCode}${func}${session}${process.env.API_SECRET || ""}`;
  const api_sign = crypto.createHash("sha256").update(key).digest("hex");
  requestInfo.sign = api_sign;
  try {
    const cookieStore = await cookies();
    const token = !token_info.new
      ? cookieStore.get(token_info.authen)?.value
      : token_info.tokenValue;
    res = await axios.post(full_path, requestInfo, {
      withCredentials: true,
      headers: {
        Authorization: `Bearer ${token}`,
        ...(process.env.BASE_WEB
          ? {
              Origin: new URL(process.env.BASE_WEB).origin,
              Referer: `${process.env.BASE_WEB.replace(/\/+$/, "")}/`,
            }
          : {}),
      },
      httpAgent: createHttpAgent(),
    });

    logInfo(
      "apiHelper",
      { full_path, requestInfo, key, token: token },
      {
        HTTP_STATUS: res.status,
        STATUS_TEXT: res.statusText,
        code: res.data.code,
        mess: res.data.mess,
      }
    );
  } catch (error) {
    logError(
      "apiHelper",
      { full_path, requestInfo, key, token: token_info },
      { error }
    );
  }
  return res;
};
export const apiPlusHelper = async (url: string) => {
  let res = {} as AxiosResponse;
  const full_path = process.env.API_PLUS + url;

  try {
    res = await axios.get(full_path);

    logInfo(
      "apiPlusHelper",
      { full_path },
      {
        HTTP_STATUS: res.status,
        STATUS_TEXT: res.statusText,
        code: res.data.code,
        mess: res.data.mess,
      }
    );
  } catch (error) {
    logError("apiPlusHelper", { full_path }, { error });
  }
  return res;
};
