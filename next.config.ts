import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  reactCompiler: true,
  allowedDevOrigins: ['192.168.0.125']
};

export default nextConfig;
