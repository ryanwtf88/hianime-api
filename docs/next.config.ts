import type { NextConfig } from "next";
import createMDX from "@next/mdx";

const nextConfig: NextConfig = {
  // Configure existing Next.js config here
  pageExtensions: ["js", "jsx", "md", "mdx", "ts", "tsx"],
  // Enable static export for GitHub Pages
  output: 'export',
  // Disable image optimization for GitHub Pages (optional, but often needed)
  images: {
    unoptimized: true,
  },
};

const withMDX = createMDX({
  // Add markdown plugins here, as desired
});

export default withMDX(nextConfig);
