/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['firebasestorage.googleapis.com'],
  },
  babel: {
    presets: ['next/babel'],
    plugins: [
      [
        "import",
        {
          libraryName: "antd",
          style: true,
        },
      ],
    ],
  },
};

module.exports = nextConfig;
