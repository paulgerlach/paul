import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 31536000,
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    dangerouslyAllowSVG: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.prismic.io",
      },
      {
        protocol: "https",
        hostname: "api.qrserver.com",
      },
    ],
  },
  output: "standalone",
  experimental: {
    // Tree-shake unused exports from these packages to reduce bundle size
    optimizePackageImports: [
      "lucide-react",
      "react-icons",
    ],
  },
};

export default nextConfig;
