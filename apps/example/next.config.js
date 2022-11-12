const withTM = require('next-transpile-modules')([
  '@wallet01/evm',
  '@wallet01/solana',
  '@wallet01/cosmos',
  '@wallet01/core',
  '@wallet01/react',
]);

/** @type {import('next').NextConfig} */
const nextConfig = withTM({
  reactStrictMode: true,
  swcMinify: true,
});

module.exports = nextConfig;
