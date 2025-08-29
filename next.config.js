/** @type {import('next').NextConfig} */
const nextConfig = {
  trailingSlash: true,
  images: {
    unoptimized: true,
    domains: ['tc.artemisia.icu'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'tc.artemisia.icu',
        port: '',
        pathname: '/file/**',
      },
    ]
  }
}

module.exports = nextConfig