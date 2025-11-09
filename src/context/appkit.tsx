// context/appkit.tsx
"use client";

import { ReactNode, useMemo } from "react";
import { AutoConnect, ThirdwebProvider } from "thirdweb/react";
import { thirdwebClient } from "@/lib/thirdwebClient";
import {
  defaultChain,
  isMainnetEnvironment,
  supportedChains,
} from "@/lib/thirdwebChains";

interface AppKitProps {
  children: ReactNode;
}

const appMetadata = {
  name: "Billoq",
  url: "https://www.billoqpay.com",
  description: `Billoq application - ${isMainnetEnvironment ? "Mainnet" : "Testnet"} Mode`,
  logoUrl: "https://www.billoqpay.com/logo.png",
};

export function AppKit({ children }: AppKitProps) {
  const chains = useMemo(() => supportedChains, []);

  return (
    <ThirdwebProvider
      client={thirdwebClient}
      activeChain={defaultChain}
      supportedChains={chains}
      appMetadata={appMetadata}
      locale="en-US"
    >
      <AutoConnect client={thirdwebClient} timeout={1500} />
      {children}
    </ThirdwebProvider>
  );
}