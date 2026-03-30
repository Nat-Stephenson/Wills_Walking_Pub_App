import type { NextConfig } from 'next'
 
const nextConfig: NextConfig = {
  experimental: {
    optimizePackageImports: ['lucide-react', 'next/image'],
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
}
 
export default nextConfig