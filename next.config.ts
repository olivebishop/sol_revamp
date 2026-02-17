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
