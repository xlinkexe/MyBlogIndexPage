/** @type {import('next').NextConfig} */
const nextConfig = {
  trailingSlash: true,
  images: {
<<<<<<< HEAD
    unoptimized: true,
    domains: ['tc.artemisia.icu'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'tc.artemisia.icu',
        port: '',
        pathname: '/file/**',
      },
    ],
=======
    unoptimized: true
>>>>>>> 2fcfa30f36494be9a432437c7fca25e2b110ebb8
  }
}

module.exports = nextConfig