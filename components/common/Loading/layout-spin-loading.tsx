import { useEffect } from "react";
import SpinLoading from "./spin-loading";
import appSlice from "@/app/appSlice";
import { useDispatch } from "react-redux";

const LayoutSpinLoading = () => {
    // const { updateModalState } = appSlice.actions;
    // const dispatch = useDispatch();
    // useEffect(() => {
    //     dispatch(updateModalState(null));
    // }, [])
    return (
        <div className="fixed inset-0 bg-black/50 w-full h-full z-[12] flex items-center justify-center">
            <SpinLoading
                color="#fff"
                height={65}
                width={65}
                position="center"
            />
        </div>
    )
}
export default LayoutSpinLoading;