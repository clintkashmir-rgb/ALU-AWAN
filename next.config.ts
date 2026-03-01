
import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  output: 'export',
  // Removed distDir: 'public' because 'public' is a reserved directory in Next.js
  // Static export will now correctly go to the default 'out' directory
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
