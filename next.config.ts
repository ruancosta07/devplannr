import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [{
      protocol: "https",
      hostname: "dpvbxbfpfnahmtbhcadf.supabase.co"
    }]
  }
};

export default nextConfig;
