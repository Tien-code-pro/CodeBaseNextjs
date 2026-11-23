"use client";
import crypto from "crypto";
import { getClientPublicEnv } from "@/config/public-env";
import { v4 as uuidv4 } from "uuid";

export class RequestBackend {
  time: number;
  sign: string;
  makerCode: string;
  func: string;
  fromIP: string;
  data: Object;
  session?: string;

  constructor(
    { time, fromIP, sign, makerCode, func, data } = {
      time: 0,
      fromIP: "",
      sign: "",
      makerCode: "",
      func: "",
      data: {},
    }
  ) {
    const tempSession = `${time}${uuidv4()}`;
    this.session = tempSession;
    this.time = time;
    this.fromIP = fromIP;
    this.sign = crypto
      .createHash("sha256")
      .update(
        `${time}${makerCode}${func}${tempSession}${
          getClientPublicEnv().NEXT_PUBLIC_API_SECRET || ""
        }`
      )
      .digest("hex");
    this.makerCode = makerCode;
    this.func = func;
    this.data = data;
  }
}
