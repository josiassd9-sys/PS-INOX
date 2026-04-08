import type {NextConfig} from 'next';
import createPWA from '@ducanh2912/next-pwa';

const withPWA = createPWA({
  dest: 'public',
  register: true,
  disable: process.env.NODE_ENV === 'development',
});

const isCapacitorBuild = process.env.CAPACITOR_BUILD === 'true';

const nextConfig: NextConfig = {
  /* config options here */
  ...(isCapacitorBuild
    ? {
        output: 'export',
      }
    : {}),
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    ...(isCapacitorBuild
      ? {
          unoptimized: true,
        }
      : {}),
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

export default withPWA(nextConfig);
