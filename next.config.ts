import type { NextConfig } from "next";
const nextConfig: NextConfig = {
  output: "export",
  basePath: "",
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        hostname: "localhost",
      },
      {
        protocol: "https",
        hostname: "cdnmedia.vtcgame.vn",
      },
    ],
  },
};

export default nextConfig;
