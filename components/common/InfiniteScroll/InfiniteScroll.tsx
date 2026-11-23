import { ReactNode, useEffect, useState } from "react";
import { CustomScroll } from "react-custom-scroll";
import SpinLoading from "../Loading/spin-loading";

const InfiniteScroll = ({
    next,
    isLoading,
    hasMore,
    children,
}: {
    next: () => void
    isLoading: boolean
    hasMore: boolean,
    children: ReactNode,
}) => {
    const [currentInnerHeight, setCurrentInnerHeight] = useState<number>()
    const [offsetInnerHeight, setOffsetInnerHeight] = useState<number>()
    const handleScroll = () => {
        if (hasMore && currentInnerHeight && offsetInnerHeight) {
            if (currentInnerHeight !== offsetInnerHeight || isLoading) {
                return;
            }
            next();
        }
    };

    useEffect(() => {
        handleScroll()
    }, [currentInnerHeight]);
    return (<>
        <CustomScroll heightRelativeToParent="100%" className=""
            onScroll={(scroll) => {
                setCurrentInnerHeight(scroll.currentTarget.scrollTop + scroll.currentTarget.clientHeight);
                setOffsetInnerHeight(scroll.currentTarget.scrollHeight)
            }}
        >
            {children}
            {hasMore ? <>{
                isLoading ? <div className="flex justify-center items-center align-middle h-[128px]">
                    <SpinLoading color="#000" height={45} width={45} position="center" />
                </div> : <div className="flex justify-center items-center align-middle h-[128px]"></div>
            }</> : <></>}
        </CustomScroll>

    </>)
}
export default InfiniteScroll;