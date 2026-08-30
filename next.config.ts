import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "i0.wp.com" },
      { protocol: "https", hostname: "debrownieexpress.nl" },
      { protocol: "https", hostname: "aromaticessence.co" },
      { protocol: "https", hostname: "cf-img-a-in.tosshub.com" },
      { protocol: "https", hostname: "sanwariyasweets.in" },
      { protocol: "https", hostname: "thecinnamonjar.com" },
      { protocol: "https", hostname: "media-assets.swiggy.com" },
      { protocol: "https", hostname: "shop.fourall.ca" },
      { protocol: "https", hostname: "blob.vercel-storage.com" },
      { protocol: "https", hostname: "*.vercel-storage.com" },
    ],
  },
};

export default nextConfig;
