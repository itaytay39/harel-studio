/** @type {import('next').NextConfig} */
const nextConfig = {
  // Turbopack config (Next.js 16 default bundler)
  turbopack: {},
  webpack: (config) => {
    config.module.rules.push({
      test: /\.(glsl|vert|frag)$/,
      use: 'raw-loader',
    })
    return config
  },
}
module.exports = nextConfig
