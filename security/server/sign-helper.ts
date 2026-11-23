import { logError } from "@/utils/log-helper";
import crypto from "crypto";
import jwt from "jsonwebtoken";
export const imageSignHelperSSR = ({
  time,
  startTime,
  endTime,
  url,
  W,
  Q,
  session,
}: {
  time: number;
  startTime: number;
  endTime: number;
  url: string;
  W: number;
  Q: number;
  session: string;
}) => {
  return crypto
    .createHash("sha256")
    .update(
      `${time}${startTime}${endTime}${url}${Q}${W}${session}${
        process.env.API_SECRET || ""
      }`
    )
    .digest("hex");
};
export const getJWTImage: any = (token: string) => {
  try {
    return jwt.decode(token, { complete: true });
  } catch (error) {
    logError("getJWTImage", { error });
    return null;
  }
};
