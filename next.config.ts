import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    turbo: {
      rules: {
        "*.svg": ["@svgr/webpack"],
      },
    },
  },
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      issuer: /\.[jt]sx?$/,
      use: [
        {
          loader: "@svgr/webpack",
          options: {
            svgo: true, // Enables SVG optimization
            svgoConfig: {
              plugins: [{ removeViewBox: false }], // Ensure viewBox is not removed
            },
          },
        },
      ],
    });
    return config;
  },
};

export default nextConfig;
