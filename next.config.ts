import type { NextConfig } from 'next'
 
const nextConfig: NextConfig = {
  // Removed static export configuration for better development experience
  // Add back `output: 'export'` only if you need static hosting
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
}
 
export default nextConfig