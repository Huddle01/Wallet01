const withTM = require('next-transpile-modules')([
  '@wallet01/react',
  '@wallet01/evm',
]);

/** @type {import('next').NextConfig} */
const nextConfig = withTM({
  reactStrictMode: true,
  swcMinify: true,
});

module.exports = nextConfig;
