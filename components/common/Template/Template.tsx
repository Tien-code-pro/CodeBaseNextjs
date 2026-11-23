"use client";
import appSlice from "@/app/appSlice";
import { useAppDispatch } from "@/redux/hooks";
import MessageTemplate from "./MessageTemplate";

const Template = () => {
  // copy phần khai báo này
  const dispatch = useAppDispatch();

  return (
    <>
      <button
        className="text-[#ffeeb7] bg-[#610000] py-2 px-5 my-5 rounded"
        onClick={() => {
          // mở popup
          // dispatch(
          //   updateModalState(<MessageTemplate message="Demo mở popup" />)
          // );
        }}
      >
        Mở popup
      </button>
    </>
  );
};
export default Template;
