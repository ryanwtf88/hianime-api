import type { NextConfig } from 'next';
import createMDX from '@next/mdx';

const nextConfig: NextConfig = {
  // Configure existing Next.js config here
  pageExtensions: ['js', 'jsx', 'md', 'mdx', 'ts', 'tsx'],
  // Enable static export for GitHub Pages
  output: 'export',
  // Configure for GitHub Pages subdirectory deployment
  basePath: '/hianime-api',
  assetPrefix: '/hianime-api/',
  // Disable image optimization for GitHub Pages (optional, but often needed)
  images: {
    unoptimized: true,
  },
};

const withMDX = createMDX({
  // Add markdown plugins here, as desired
});

export default withMDX(nextConfig);
