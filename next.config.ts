import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: process.env.R2_PUBLIC_HOSTNAME
      ? [{ protocol: "https", hostname: process.env.R2_PUBLIC_HOSTNAME }]
      : [],
  },
};

export default nextConfig;
