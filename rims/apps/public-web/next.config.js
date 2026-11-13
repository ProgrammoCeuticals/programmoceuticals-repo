/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    RIMS_API_URL: process.env.RIMS_API_URL ?? 'http://localhost:3000',
    SITE_HOSTNAME: process.env.SITE_HOSTNAME ?? 'demo-rims.localhost',
  },
  images: { domains: [] },
};
module.exports = nextConfig;
