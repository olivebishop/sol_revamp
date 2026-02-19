import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  typedRoutes: true,
  cacheComponents: true,
  reactCompiler: true,
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    // Enable image optimization for Supabase Storage
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    remotePatterns: [
      {
        protocol: 'https',
        // Extract hostname from NEXT_PUBLIC_SUPABASE_URL or use default
        hostname: process.env.NEXT_PUBLIC_SUPABASE_URL 
          ? new URL(process.env.NEXT_PUBLIC_SUPABASE_URL).hostname 
          : 'dehakhyjxyadeogocxxi.supabase.co', // Fallback to old hostname if env var not set
        pathname: '/storage/v1/object/public/**',
      },
    ],
    // Optimize images for better performance
    minimumCacheTTL: 60,
  },

  turbopack: {
    root: process.cwd(),
  } as any,

  experimental: {
    turbopackFileSystemCacheForDev: true,
  },

  compiler: {
    removeConsole: process.env.NODE_ENV === "production",
  },
};

export default nextConfig;
