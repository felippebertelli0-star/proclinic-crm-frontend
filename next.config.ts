import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/dashboard/portal_ias",
        destination: "/dashboard/portal-ias",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
