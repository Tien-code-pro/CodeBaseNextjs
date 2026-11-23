import { AxiosResponse } from "axios";
import { apiHelper, apiPlusHelper } from "../api";
import { MetaData } from "@/types/metadata";
import { CityInfo, CityShort } from "@/types/apiTypes";

export const getExampleSSR = (): Promise<
  AxiosResponse<MetaData<CityShort>>
> => {
  return apiHelper(
    "/Event",
    "get-location",
    process.env.MAKER_CODE_FAM!,
    "",
    ""
  );
};
export const getLocationSSR = (): Promise<
  AxiosResponse<Array<CityInfo>>
> => {
  return apiPlusHelper(
    "/location/getcity",
  );
};
