/** @type {import('next').NextConfig} */
const nextConfig = {
  // Image optimization
  images: {
    formats: ["image/webp", "image/avif"],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60 * 60 * 24 * 30, // 30 days
  },

  // Compression
  compress: true,

  // Headers for better caching and security
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "Referrer-Policy",
            value: "origin-when-cross-origin",
          },
        ],
      },
      {
        source: "/images/(.*)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        source: "/logos/(.*)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        source: "/sw.js",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=0, must-revalidate",
          },
        ],
      },
    ];
  },

  // Webpack configuration for bundle optimization
  webpack: (config, { dev, isServer }) => {
    // Bundle analyzer (only in development)
    if (process.env.ANALYZE === "true") {
      const { BundleAnalyzerPlugin } = require("webpack-bundle-analyzer");
      config.plugins.push(
        new BundleAnalyzerPlugin({
          analyzerMode: "server",
          openAnalyzer: true,
        })
      );
    }

    // Prevent micromatch stack overflow by limiting file resolution
    config.resolve = {
      ...config.resolve,
      // Limit module resolution to prevent excessive file scanning
      modules: ["node_modules"],
      // Exclude problematic directories from resolution
      fallback: {
        ...config.resolve.fallback,
      },
    };

    // Simplified webpack configuration to prevent micromatch issues
    config.watchOptions = {
      ignored: /node_modules/,
      aggregateTimeout: 300,
      poll: false,
    };

    // Simplified bundle optimization to prevent micromatch issues
    if (!dev && !isServer) {
      config.optimization.splitChunks = {
        chunks: "all",
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: "vendors",
            chunks: "all",
            priority: 10,
          },
        },
      };
    }

    return config;
  },

  // Enable SWC minification
  swcMinify: true,

  // Enable file tracing but exclude problematic directories
  outputFileTracing: true,
  outputFileTracingExcludes: {
    "*": [
      "node_modules/@swc/core-*",
      "node_modules/@next/swc-*",
      "node_modules/next/dist/compiled/@next/swc-*",
    ],
  },

  // Enable static optimization
  trailingSlash: false,

  // Optimize bundle size
  poweredByHeader: false,

  // Enable experimental features for better performance
  experimental: {
    optimizePackageImports: [
      "framer-motion",
      "@heroicons/react",
      "@radix-ui/react-hover-card",
    ],
  },
};

export default nextConfig;
