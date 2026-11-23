'use client'

import ImageTemplateView from "./ImageTemplateView"

// import dynamic from "next/dynamic";

// const ImageTemplateView = dynamic(() => import('./ImageTemplateView'), {
//     ssr: false, //Client component
//     loading: () => <></>
// })
export default function ImageTemplatePage() {
    return (
        <>
            <ImageTemplateView />
        </>
    )
}