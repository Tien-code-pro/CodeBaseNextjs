import moment from "moment";
import { getClientPublicEnv } from "@/config/public-env";

const toHex = (buffer: ArrayBuffer) => {
  return [...new Uint8Array(buffer)]
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
};

const sha256 = async (value: string) => {
  const encoded = new TextEncoder().encode(value);
  const digest = await window.crypto.subtle.digest("SHA-256", encoded);

  return toHex(digest);
};

export const imageSignHelper = async ({
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
  return sha256(
    `${time}${startTime}${endTime}${url}${Q}${W}${session}${
      getClientPublicEnv().NEXT_PUBLIC_API_SECRET || ""
    }`
  );
};

export const basicSignHelper = () => {
  return sha256(`${moment().utc().unix}vtcintecom}`);
};
