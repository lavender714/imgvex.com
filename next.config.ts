import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    unoptimized: true,
  },
  turbopack: {
    root: "D:\\程序\\AI\\项目文件夹\\synapse",
  },
};

export default nextConfig;
