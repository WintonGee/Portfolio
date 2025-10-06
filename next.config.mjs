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

  // Disable build traces collection to prevent micromatch stack overflow
  generateBuildId: async () => {
    return "build-" + Date.now();
  },

  // Optimize build performance
  outputFileTracing: true,

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
    turbo: {
      rules: {
        "*.svg": {
          loaders: ["@svgr/webpack"],
          as: "*.js",
        },
      },
    },
    // Include data folder in serverless function bundle
    outputFileTracingIncludes: {
      "/api/chat": ["./data/chatbot-embeddings.json"],
      "/api/chatbot-sources": [
        "./data/chatbot/contact/availability.md",
        "./data/chatbot/personal/basic-info.md",
        "./data/chatbot/personal/education.md",
        "./data/chatbot/professional/achievements.md",
        "./data/chatbot/professional/afterquery-software-engineer.md",
        "./data/chatbot/professional/ai-ethics-research.md",
        "./data/chatbot/professional/cochat-founder.md",
        "./data/chatbot/professional/cochat-project.md",
        "./data/chatbot/professional/foodmanager-project.md",
        "./data/chatbot/professional/linkedin-apprentice.md",
        "./data/chatbot/professional/mercor-ai-engineer.md",
        "./data/chatbot/professional/portfolio-project.md",
        "./data/chatbot/professional/projects.md",
        "./data/chatbot/professional/ricoh-software-engineer-intern.md",
        "./data/chatbot/professional/square-apprentice.md",
        "./data/chatbot/professional/summary.md",
        "./data/chatbot/professional/tribot-software-developer.md",
        "./data/chatbot/professional/trustyfaq-project.md",
        "./data/chatbot/skills/detailed-skills.md",
        "./data/chatbot/skills/technical.md"
      ],
    },
  },
};

export default nextConfig;
