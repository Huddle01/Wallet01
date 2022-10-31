
const withTM = require('next-transpile-modules')(["@huddle01-wallets/core", "@huddle01-wallets/cosmos"])

/** @type {import('next').NextConfig} */
const nextConfig = withTM({
  reactStrictMode: true,
  swcMinify: true,
})

module.exports = nextConfig
