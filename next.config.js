/** @type {import('next').NextConfig} */
const path = require("path");

const nextConfig = {
  reactStrictMode: true,
  experimental: {
    serverActions: {},
  },
  // Next 16+ usa Turbopack por padrão; isso evita o erro de "workspace root"
  turbopack: {
    root: path.resolve(__dirname),
  },
};

module.exports = nextConfig;
