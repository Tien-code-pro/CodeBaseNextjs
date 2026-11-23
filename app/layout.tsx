import "./globals.css";
import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { Providers } from "@/redux/provider";
// import { GoogleTagManager  } from '@next/third-parties/google'
// import Script from "next/script";
// import { WebVitals } from "@/components/web-vitals/webVitals";
import { PublicEnv } from "@/config/public-env";
import NextTopLoader from "nextjs-toploader";
import { seoConfig } from "@/config/seo.config";
import LayoutEventError from "@/components/common/HandleError/LayoutEventError";
import { AuthTokenProvider } from "@/components/common/Auth/AuthTokenProvider";
import { ModalProvider } from "@/components/common/Modal/ModalProvider";

const inter = Inter({ subsets: ["latin"] });
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 3,
  userScalable: true,
};

export const metadata: Metadata = {
  metadataBase: new URL(seoConfig.siteUrl),

  // Basic SEO
  title: {
    default: seoConfig.defaultTitle,
    template: `%s | ${seoConfig.siteName}`,
  },
  description: seoConfig.defaultDescription,
  keywords: seoConfig.defaultKeywords,
  authors: [{ name: seoConfig.company.name }],
  creator: seoConfig.company.name,
  publisher: seoConfig.game.publisher,

  // Open Graph
  openGraph: {
    type: "website",
    locale: "vi_VN",
    url: seoConfig.siteUrl,
    siteName: seoConfig.siteName,
    title: seoConfig.defaultTitle,
    description: seoConfig.defaultDescription,
    images: [
      {
        url: `${seoConfig.siteUrl}${seoConfig.images.ogImage}`,
        width: 1200,
        height: 630,
        alt: seoConfig.siteName,
        type: "image/jpeg",
      },
    ],
  },

  // Twitter Card
  twitter: {
    card: "summary_large_image",
    title: seoConfig.defaultTitle,
    description: seoConfig.defaultDescription,
    images: [`${seoConfig.siteUrl}${seoConfig.images.ogImage}`],
    creator: "@vtcgame",
  },

  // Icons
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png" }],
  },

  // Manifest
  manifest: "/site.webmanifest",

  // Robots
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },

  // Verification (thêm sau khi có)
  verification: {
    google: "your-google-verification-code",
    // yandex: "your-yandex-verification-code",
    // bing: "your-bing-verification-code",
  },

  // Alternates
  alternates: {
    canonical: seoConfig.siteUrl,
  },

  // Other
  category: "games",
  classification: "Gaming",

  // App-specific
  applicationName: seoConfig.siteName,
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: seoConfig.siteName,
  },
  formatDetection: {
    telephone: false,
    email: false,
    address: false,
  },
};

export default async function asyncRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <PublicEnv />
      </head>
      <body className={inter.className}>
        <Providers>
          {/* <WebVitals /> */}
          {/* <LayoutEventError /> */}
          <AuthTokenProvider />
          <ModalProvider />
          <NextTopLoader color="#fc0505" />
          {children}
        </Providers>
      </body>

      {/*       <Script
        id="src-jquery"
        async
        src="https://code.jquery.com/jquery-3.1.1.min.js"
      />
      <Script
        id="header-login"
        async
        src="https://header.vtcgame.vn/headerJS/headjs.js?vs=13062023"
      />
      <Script
        id="body-login"
        async
        src="https://header.vtcgame.vn/headerJS/BodyCall.js?vs=20161227"
      /> */}
    </html>
  );
}
