import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  /* config options here */
  webpack: (config) => {
    config.externals.push("pino-pretty", "lokijs", "encoding");

    config.resolve = config.resolve || {};
    config.resolve.alias = {
      ...(config.resolve.alias || {}),
      "@reown/appkit-wallet": path.resolve(__dirname, "./src/stubs/noop.ts"),
      "@reown/appkit-ui": path.resolve(__dirname, "./src/stubs/noop.ts"),
      "@reown/appkit-utils": path.resolve(__dirname, "./src/stubs/noop.ts"),
      "@reown/appkit-pay": path.resolve(__dirname, "./src/stubs/noop.ts"),
      "viem/actions": path.resolve(__dirname, "./src/stubs/viemActions.ts"),
    };

    return config;
  },
};

export default nextConfig;


