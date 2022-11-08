const withTM = require('next-transpile-modules')([
  '@wallet01/core',
  '@wallet01/react',
  '@wallet01/cosmos',
]);

/** @type {import('next').NextConfig} */
const nextConfig = withTM({
  reactStrictMode: true,
  swcMinify: true,
});

module.exports = nextConfig;
