import { setToken } from "@/services/client-side/axios.config";
import { TokenProps } from "@/types/metadata";

export const authHandler = (token: TokenProps) => {
  setToken(token);
};
