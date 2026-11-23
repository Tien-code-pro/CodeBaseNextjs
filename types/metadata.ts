export interface MetaData<T> {
  code: number;
  mess: string;
  data: DataT<T>;
}

export interface DataT<T> {
  total: number;
  list: T[];
}

export interface Data<T> {
  code: number;
  mess: string;
  data: T;
}

export type TokenProps = {
  tokenName: string;
  tokenValue: string;
  secureImageToken?: string;
  expireTime: string;
  authen: string;
  new: boolean;
  cookieDomain?: string;
};
