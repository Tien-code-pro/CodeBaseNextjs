import { AxiosConfig } from "@/services/client-side/axios.config";
import { getClientPublicEnv } from "@/config/public-env";
import { AxiosResponse } from "axios";
import { Data, MetaData } from "@/types/metadata";
import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
dayjs.extend(utc);
dayjs.extend(timezone);
import { RequestBackend } from "@/types/request";

import { AccountFullInfoType } from "@/types/componentTypes";
const api = AxiosConfig();
const makerCode = getClientPublicEnv().NEXT_PUBLIC_MAKER_CODE;
export const getAccountInfo = (): Promise<AxiosResponse<any>> => {
  const requestInfo = new RequestBackend({
    time: dayjs().utc().unix(),
    fromIP: "",
    sign: "",
    makerCode: makerCode || "",
    func: "",
    data: "",
  });
  return api.post("/UserInfo", requestInfo);
};
export const getFullAccountInfo = (): Promise<
  AxiosResponse<Data<AccountFullInfoType>>
> => {
  const requestInfo = new RequestBackend({
    time: dayjs().utc().unix(),
    fromIP: "",
    sign: "",
    makerCode: makerCode || "",
    func: "account-get-info",
    data: "",
  });
  return api.post("/Event", requestInfo);
};

export const getAccountLogin = (): Promise<AxiosResponse<MetaData<any>>> => {
  const requestInfo = new RequestBackend({
    time: dayjs().utc().unix(),
    fromIP: "",
    sign: "",
    makerCode: makerCode || "",
    func: "account-login",
    data: "",
  });
  return api.post("/Event", requestInfo);
};

export const accountGetBalance = (): Promise<AxiosResponse<Data<any>>> => {
  const requestInfo = new RequestBackend({
    time: dayjs().utc().unix(),
    fromIP: "",
    sign: "",
    makerCode: makerCode || "",
    func: "account-balance",
    data: "",
  });
  return api.post("/Event", requestInfo);
};
export const accountVerificationGetInfo = (): Promise<
  AxiosResponse<Data<any>>
> => {
  const requestInfo = new RequestBackend({
    time: dayjs().utc().unix(),
    fromIP: "",
    sign: "",
    makerCode: makerCode || "",
    func: "account-verification-get-info",
    data: "",
  });
  return api.post("/Event", requestInfo);
};
