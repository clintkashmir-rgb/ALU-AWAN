
import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  output: 'export',
  // Next.js standard export directory is 'out'. 
  // Reserved directory 'public' cannot be used as distDir.
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'picsum.photos',
      },
    ],
  },
};

export default nextConfig;
