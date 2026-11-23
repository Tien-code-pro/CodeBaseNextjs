export class ServerRequestBackend {
  session?: string;
  time: number;
  sign: string;
  makerCode: string;
  func: string;
  data: Object;
  fromIP: string;

  constructor(
    { time, fromIP, sign, makerCode, func, data, session } = {
      time: 0,
      fromIP: "",
      sign: "",
      makerCode: "",
      func: "",
      data: {},
      session: "",
    }
  ) {
    this.session = session;
    this.time = time;
    this.fromIP = fromIP;
    this.sign = sign;
    this.makerCode = makerCode;
    this.func = func;
    this.data = data;
  }
}

export interface ServerPropsParamRequest {
  url: string;
  func: string;
  data: any;
  fromIP?: string;
  session?: string;
}
