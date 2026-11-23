import {
  AxiosConfig,
  AxiosPlusConfig,
} from "@/services/client-side/axios.config";
import { getClientPublicEnv } from "@/config/public-env";
import { AxiosResponse } from "axios";
import { Data, MetaData } from "@/types/metadata";
import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
dayjs.extend(utc);
dayjs.extend(timezone);

import { CityInfo, CityShort } from "@/types/apiTypes";
import { RequestBackend } from "@/types/request";
const api = AxiosConfig();
const apiPlus = AxiosPlusConfig();
const makerCode = getClientPublicEnv().NEXT_PUBLIC_MAKER_CODE;
export const getLocation = (): Promise<AxiosResponse<Array<CityInfo>>> => {
  return apiPlus.get("/location/getcity");
};

export const getExampple = (): Promise<AxiosResponse<MetaData<CityShort>>> => {
  const requestInfo = new RequestBackend({
    time: dayjs().utc().unix(),
    fromIP: "",
    sign: "",
    makerCode: makerCode || "",
    func: "example",
    data: "",
  });
  return api.post("/Event", requestInfo);
};
