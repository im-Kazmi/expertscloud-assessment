import withBundleAnalyzer from "@next/bundle-analyzer";

// @ts-expect-error No declaration file
import { PrismaPlugin } from "@prisma/nextjs-monorepo-workaround-plugin";
import { withSentryConfig } from "@sentry/nextjs";
import type { NextConfig } from "next";
import { createSecureHeaders } from "next-secure-headers";

const baseConfig: NextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "img.clerk.com",
      },
    ],
  },
};

export const config: NextConfig = baseConfig;
