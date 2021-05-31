const isProduction = process.env.NODE_ENV === "production";

module.exports = {
  assetPrefix: "./",
  images: {
    domains: ["static-cdn.jtvnw.net"],
  },
  env: {
    STATIC_PREFIX: isProduction ? "./static" : "/static",
  },
  exportPathMap: async (
    defaultPathMap,
    { dev, dir, outDir, distDir, buildId }
  ) => {
    return !dev
      ? {
          "/video_overlay": { page: "/video_overlay.html" },
        }
      : defaultPathMap;
  },
  webpack(config, options) {
    config.optimization.minimize = false;
    return config;
  },
};
