import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    minimumCacheTTL: 60,
    dangerouslyAllowSVG: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.prismic.io",
      },
    ],
    domains: [
      "gjyzysizrvtqthttctlb.supabase.co",
    ]
  },
  output: "standalone",
};

export default nextConfig;
