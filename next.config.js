/** @type {import('next').NextConfig} */
const path = require("path");
const nextConfig = {
  transpilePackages: ["three"],
  webpack: (config) => {
    // Ensure single instance of Three.js
    config.resolve.alias = {
      ...config.resolve.alias,
      three: path.resolve("./node_modules/three"),
    };

    config.externals = [...(config.externals || []), { canvas: "canvas" }];
    return config;
  },
};

module.exports = nextConfig;
