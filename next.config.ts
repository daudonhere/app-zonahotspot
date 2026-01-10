import withPWAInit from "@ducanh2912/next-pwa";
import type { NextConfig } from "next";
const withPWA = withPWAInit({
  dest: "public",
  register: true,
  cacheOnFrontEndNav: true,
  aggressiveFrontEndNavCaching: true,
  reloadOnOnline: true,
  disable: false,
  workboxOptions: {
    disableDevLogs: true,
    runtimeCaching: [
      {
        urlPattern: /^https?.*\.(png|jpg|jpeg|svg|webp)$/i,
        handler: "CacheFirst",
        options: {
          cacheName: "images-cache",
          expiration: {
            maxEntries: 100,
            maxAgeSeconds: 60 * 60 * 24 * 30,
          },
        },
      },
      {
        urlPattern: /^https?.*\.(js|css)$/i,
        handler: "StaleWhileRevalidate",
        options: {
          cacheName: "static-resources",
        },
      },
    ],
  },
  fallbacks: {
    document: "/offline",
  },
});
const nextConfig: NextConfig = {
  webpack: (config, { dev }) => {
    if (dev) {
      config.watchOptions = {
        ...config.watchOptions,
        ignored: [
          "**/public/sw.js",
          "**/public/workbox-*.js",
          "**/public/worker-*.js",
          "**/public/sw.js.map",
        ],
      };
    }
        return config;
      },
      async rewrites() {
        return [
          {
            source: "/api-proxy/:path*",
            destination: `${process.env.NEXT_PUBLIC_API_URL}/:path*`,
          },
        ];
      },
      turbopack: {},
    };
    export default withPWA(nextConfig);
