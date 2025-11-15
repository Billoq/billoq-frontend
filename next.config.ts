import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  /* config options here */
  webpack: (config) => {
    config.externals.push("pino-pretty", "lokijs", "encoding");

    config.resolve = config.resolve || {};
    config.resolve.alias = {
      ...(config.resolve.alias || {}),
      "@reown/appkit-wallet/utils": path.resolve(__dirname, "./src/stubs/wallet-utils.ts"),
      "@reown/appkit-wallet": path.resolve(__dirname, "./src/stubs/noop.ts"),
      "@reown/appkit-ui/wui-account-button": path.resolve(__dirname, "./src/stubs/ui-components.ts"),
      "@reown/appkit-ui": path.resolve(__dirname, "./src/stubs/ui-components.ts"),
      "@reown/appkit-pay": path.resolve(__dirname, "./src/stubs/noop.ts"),
    };

    return config;
  },
};

export default nextConfig;


