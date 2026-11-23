import ImageTemplatePage from "@/components/common/Template/ImageTemplate/ImageTemplatePage";
import Template from "@/components/common/Template/Template";
import TemplateUpdate from "@/components/common/Template/TemplateUpdate";
import { getPageMetadata } from "@/config/seo.config";
import { Metadata } from "next";
import { Suspense } from "react";
export const metadata: Metadata = getPageMetadata(
  undefined, // Dùng title mặc định
  undefined, // Dùng description mặc định
  undefined, // Dùng OG image mặc định
  undefined // Dùng keywords mặc định
);
export default function Home() {
  return (
    <main className="text-black">
      <TemplateUpdate />
      <Suspense fallback={<></>}>
        <ImageTemplatePage />
      </Suspense>
      <div className="w-full h-full flex justify-center">
        <div className="bg-background-demo w-[1113px] h-[687px] text-center content-center">
          <p className="text-[40px]">Hello world</p>
        </div>
      </div>
      {/*  */}
    </main>
  );
}
