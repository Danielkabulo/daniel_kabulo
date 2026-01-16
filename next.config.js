/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  compress: true,
  
  // Disable ESLint during build (temporary for compatibility with ESLint 9)
  eslint: {
    ignoreDuringBuilds: true,
  },
  
  // Enable standalone output for Docker
  output: 'standalone',
  
  // Environment variables
  env: {
    NEXT_PUBLIC_APP_NAME: 'Kamoa Supervision',
    NEXT_PUBLIC_APP_VERSION: '1.0.0',
  },

  // Security headers
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin'
          },
        ],
      },
    ]
  },
}

module.exports = nextConfig;