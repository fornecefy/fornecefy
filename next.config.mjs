/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    turbo: {
      root: '.',
    },
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
}

export default nextConfig
