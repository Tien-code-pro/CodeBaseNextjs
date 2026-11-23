import Image from "app/image";
import { useModal } from "@/components/hooks/useModal";
import Link from "next/link";
interface P {}
const Modalemplate = (props: P) => {
  const modal = useModal();
  return (
    // w-63-ctp h-97-ctp
    <div className="bg-black bg-opacity-50 fixed inset-0 z-20 w-full h-full flex items-center justify-center">
      <div
        className={`relative lg:p-10 p-4 bg-background-demo bg-contain w-[640px] bg-no-repeat bg-center lg:h-[410px]`}
        // bấm vào popup ko tự tắt
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        <button
          className="absolute right-0 lg:-top-20 -top-14"
          //action khi tắt popup
          onClick={() => {
            // dispatch(updateModalState(null));
            modal.closeTopModal();
          }}
        >
          <Image
            src={"/assets/images/btn_clos_demo.png"}
            style={{ cursor: "pointer" }}
            width={78}
            height={65}
            alt=""
          />
        </button>
      </div>
    </div>
  );
};

export default Modalemplate;
