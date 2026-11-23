import appSlice from "@/app/appSlice";
import { useAppDispatch } from "@/redux/hooks";
import Link from "next/link";
import Image from "app/image";
import { useModal } from "@/components/hooks/useModal";
interface P {
  message?: string;
  className?: string;
}
const MessageError = (props: P) => {
  const { message, className } = props;
  function refreshPage() {
    window.location.reload();
  }
  const modal = useModal();
  return (
    // w-63-ctp h-97-ctp
    <div
      className={`bg-black bg-opacity-50 ${
        className ? className : "fixed"
      } inset-0 z-[9999] w-full h-full flex items-center justify-center`}
    >
      <div
        className={`relative bg-[#fff] p-[10px] w-full max-w-[356px] min-h-[150px] rounded-[10px]`}
        // bấm vào popup ko tự tắt
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        <Link
          href=""
          className="absolute right-[10px] w-[24px] h-[24px] top-[10px]"
        >
          <Image
            src={"assets/images/icon-close-m.png"}
            style={{ cursor: "pointer" }}
            alt="Close"
            width={24}
            height={24}
            //action khi tắt popup
            onClick={() => {
              modal.closeTopModal();
            }}
          />
        </Link>
        {/* main modal */}
        <div className="h-[100%] flex-1">
          <h4 className="text-[20px] font-bold w-full text-center mb-[10px] lg:mb-[20px] lg:text-[24px]">
            THÔNG BÁO
          </h4>
          <p className="text-center  text-[18px]">{message}</p>
        </div>
        <button
          className="bg-[#FBC12B] text-[#fff] rounded-[4px] w-[168px] h-[40px] mt-[10px] mx-auto block"
          onClick={refreshPage}
        >
          ĐÓNG
        </button>
        {/* main modal */}
      </div>
    </div>
  );
};

export default MessageError;
