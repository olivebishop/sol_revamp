import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  typedRoutes: true,
  cacheComponents: false,
  reactCompiler: true,
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'dehakhyjxyadeogocxxi.supabase.co',
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
