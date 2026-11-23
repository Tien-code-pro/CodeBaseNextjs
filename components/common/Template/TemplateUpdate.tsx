"use client";
import { useModal } from "@/components/hooks/useModal";
import MessageTemplate from "./MessageTemplate";

const TemplateUpdate = () => {
  const modal = useModal();

  // ✅ Mở popup đơn giản
  const handleOpenSimple = () => {
    modal.openModal(<MessageTemplate message="Demo mở popup" />);
  };

  // ✅ Mở popup lồng nhau (3 cấp)
  const handleOpenNested = () => {
    modal.openModal(
      <div className="bg-white p-8 rounded-lg flex gap-x-10 w-[800px]">
        <h2>Popup cấp 1</h2>
        <button
          onClick={() => {
            // Popup cấp 2
            modal.openModal(
              <div className="bg-blue-100 p-8 rounded-lg">
                <h2>Popup cấp 2</h2>
                <PopupLevel2 />
              </div>
            );
          }}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Mở popup cấp 2
        </button>
        <button onClick={() => handleCloseTop()}>Đóng popup này</button>
      </div>,
      {
        id: "modal-level-1",
        closeOnClickOutside: true,
      }
    );
  };
  // ✅ Đóng popup cụ thể
  const handleCloseSpecific = (id: string) => {
    modal.closeModal(id);
  };
  // ✅ Đóng popup trên cùng
  const handleCloseTop = () => {
    modal.closeTopModal();
  };

  // ✅ Đóng tất cả popup
  const handleCloseAll = () => {
    modal.closeAllModals();
  };

  return (
    <div className="flex gap-x-6">
      <button
        onClick={() => {
          modal.openModal(<MessageTemplate message="Demo mở popup" />);
        }}
      >
        Mở popup đơn giản
      </button>
      <button onClick={handleOpenNested}>Mở popup lồng nhau (3 cấp)</button>
      <button onClick={handleCloseTop}>Đóng popup trên cùng</button>
    </div>
  );
};
export default TemplateUpdate;

const PopupLevel2 = () => {
  const modal = useModal();
  const handleCloseTop = () => {
    modal.closeTopModal();
  };
  // ✅ Đóng popup cụ thể
  const handleCloseSpecific = (id: string) => {
    modal.closeModal(id);
  };
  return (
    <>
      <button
        onClick={() => {
          // Popup cấp 3
          modal.openModal(
            <div className="bg-green-100 p-8 rounded-lg flex gap-x-4">
              <h2>Popup cấp 3 (cuối cùng)</h2>
              <button onClick={() => handleCloseTop()}>Đóng popup này</button>
              <button onClick={() => handleCloseSpecific("modal-level-1")}>
                Đóng popup 1
              </button>
            </div>
          );
        }}
        className="bg-green-500 text-white px-4 py-2 rounded"
      >
        Mở popup cấp 3
      </button>
      <button onClick={() => handleCloseTop()}>Đóng popup này</button>
    </>
  );
};
