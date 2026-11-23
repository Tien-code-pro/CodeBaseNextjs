"use client";

import { authHandler } from "@/security/auth-handler";
import { TokenProps } from "@/types/metadata";
import { useEffect } from "react";

type AuthTokenClientProps = {
  token?: TokenProps;
};

export const AuthTokenClient = ({ token }: AuthTokenClientProps) => {
  useEffect(() => {
    if (!token) return;

    authHandler(token);
  }, [token]);

  return null;
};
