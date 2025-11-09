import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  webpack: (config) => {
    config.externals.push("pino-pretty", "lokijs", "encoding");

    config.resolve = config.resolve || {};
    config.resolve.alias = {
      ...(config.resolve.alias || {}),
      "@reown/appkit-wallet": require.resolve("./src/stubs/noop"),
      "@reown/appkit-ui": require.resolve("./src/stubs/noop"),
      "@reown/appkit-utils": require.resolve("./src/stubs/noop"),
      "@reown/appkit-pay": require.resolve("./src/stubs/noop"),
    };

    return config;
  },
};

export default nextConfig;


