import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  // S3 static-website hosting resolves a folder key ending in `/` to its
  // index.html, but not an extensionless flat file. Static export's own
  // links/redirects are extensionless by default, so without this the
  // S3/CloudFront origin 404s on every internal navigation (NoSuchKey).
  trailingSlash: true,
  reactCompiler: true,
  allowedDevOrigins: ['192.168.0.125']
};

export default nextConfig;
