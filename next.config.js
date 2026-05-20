/** @type {import('next').NextConfig} */
const nextConfig = {
  allowedDevOrigins: ["172.17.32.1"],
  turbopack: {
    root: __dirname,
  },
};

module.exports = nextConfig;
