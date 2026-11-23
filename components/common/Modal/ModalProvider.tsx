"use client";

import appSlice from "@/app/appSlice";
import { RootState } from "@/redux/configure-store";
import { useAppSelector } from "@/redux/hooks";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

export const ModalProvider = () => {
  const modals = useAppSelector((state: RootState) => state.app.modals);
  const dispatch = useDispatch();
  const { closeModal } = appSlice.actions;

  useEffect(() => {
    if (modals.length > 0) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [modals.length]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && modals.length > 0) {
        const topModal = modals[modals.length - 1];
        topModal.onClose?.();
        dispatch(closeModal(topModal.id));
      }
    };

    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [modals, dispatch, closeModal]);

  if (modals.length === 0) return null;

  return (
    <>
      {modals.map((modal, index) => (
        <ModalLayer
          key={modal.id}
          modal={modal}
          zIndex={1000 + index * 10}
          isTopModal={index === modals.length - 1}
        />
      ))}
    </>
  );
};

interface ModalLayerProps {
  modal: {
    id: string;
    content: React.ReactNode;
    closeOnClickOutside?: boolean;
    onClose?: () => void;
  };
  zIndex: number;
  isTopModal: boolean;
}

const ModalLayer = ({ modal, zIndex, isTopModal }: ModalLayerProps) => {
  const dispatch = useDispatch();
  const { closeModal } = appSlice.actions;

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget && modal.closeOnClickOutside !== false) {
      modal.onClose?.();
      dispatch(closeModal(modal.id));
    }
  };

  return (
    <div
      className="modal-backdrop"
      onClick={handleBackdropClick}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: isTopModal
          ? "rgba(0, 0, 0, 0.5)"
          : "rgba(0, 0, 0, 0.2)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex,
        animation: "fadeIn 0.2s ease-in-out",
      }}
    >
      <div
        className="modal-content"
        style={{
          animation: "slideUp 0.2s ease-in-out",
          maxHeight: "90vh",
          overflow: "auto",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {modal.content}
      </div>
    </div>
  );
};
