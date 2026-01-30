import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Ensure all routes work properly on Vercel
  trailingSlash: false,
  
  // Enable static optimization where possible
  reactStrictMode: true,
  
  // Optimize images
  images: {
    unoptimized: false,
  },
  
  // Ensure proper routing for dynamic segments
  async rewrites() {
    return [];
  },
};

export default nextConfig;
