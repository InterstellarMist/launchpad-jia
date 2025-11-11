/** @type {import('next').NextConfig} */
const nextConfig = {
  serverExternalPackages: [
    'isomorphic-dompurify',
    'jsdom',
    'parse5',
  ],
};

module.exports = nextConfig;

