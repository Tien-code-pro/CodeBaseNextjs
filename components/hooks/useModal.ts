import { useDispatch, useSelector } from "react-redux";
import appSlice from "@/app/appSlice";
import { ReactNode, useCallback } from "react";
import { v4 as uuidv4 } from "uuid";
import { RootState } from "@/redux/configure-store";

export const useModal = () => {
  const dispatch = useDispatch();
  const modals = useSelector((state: RootState) => state.app.modals);
  const {
    openModal,
    closeModal,
    closeTopModal,
    closeAllModals,
    closeIndexModal,
  } = appSlice.actions;

  const open = useCallback(
    (
      content: ReactNode,
      options?: {
        id?: string;
        closeOnClickOutside?: boolean;
        onClose?: () => void;
      }
    ) => {
      const modalId = options?.id || uuidv4();
      dispatch(
        openModal({
          id: modalId,
          content,
          closeOnClickOutside: options?.closeOnClickOutside ?? true,
          onClose: options?.onClose,
        })
      );
    },
    [dispatch, openModal]
  );

  const close = useCallback(
    (id: string) => {
      const modal = modals.find((m) => m.id === id);
      modal?.onClose?.(); // Call onClose callback if exists
      dispatch(closeModal(id));
    },
    [dispatch, closeModal, modals]
  );

  const closeTop = useCallback(() => {
    if (modals.length > 0) {
      const topModal = modals[modals.length - 1];
      topModal.onClose?.(); // Call onClose callback if exists
    }
    dispatch(closeTopModal());
  }, [dispatch, closeTopModal, modals]);

  const closeAll = useCallback(() => {
    dispatch(closeAllModals());
  }, [dispatch, closeAllModals]);
  const closeIndex = useCallback(
    (n: number) => {
      dispatch(closeIndexModal(n));
    },
    [dispatch, closeAllModals]
  );
  return {
    openModal: open,
    closeModal: close,
    closeTopModal: closeTop,
    closeAllModals: closeAll,
    closeIndex: closeIndex,
  };
};
