"use client";
import { useModal } from "@/components/hooks/useModal";
import { registerOnSpecialError } from "@/services/client-side/axios.config";
import React, { useEffect } from "react";
import MessageError from "../Message/MessageError";

export default function LayoutEventError() {
  const modal = useModal();
  useEffect(() => {
    registerOnSpecialError((res) => {
      console.log("LayoutEventError", res);
      modal.openModal(
        <MessageError message={res?.data?.mess || "Bạn thao tác lại nhé"} />
      );
    });
  }, [modal]);
  return <></>;
}
