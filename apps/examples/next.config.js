
const withTM = require('next-transpile-modules')(["@huddle01/wallets"])

/** @type {import('next').NextConfig} */
const nextConfig = withTM({
  reactStrictMode: true,
  swcMinify: true,
})

module.exports = nextConfig
