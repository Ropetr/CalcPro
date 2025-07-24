/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true
  },
  env: {
    NEXT_PUBLIC_APP_URL: 'https://calcpro.app.br',
  }
}

module.exports = nextConfig