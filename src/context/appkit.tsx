// context/appkit.tsx
"use client";

import { createAppKit } from "@reown/appkit/react";
import { EthersAdapter } from "@reown/appkit-adapter-ethers";
import { mainnet, arbitrum, polygon, base } from "@reown/appkit/networks";
import { ReactNode } from "react";

// 1. Get projectId at https://cloud.reown.com
const projectId = "8387f0bbb57a265cd4dd96c3e658ac55"; // Replace with your actual project ID

// 2. Create a metadata object
const metadata = {
  name: "Billoq",
  description: "Billoq application",
  url: "https://billoq.com", // Replace with your actual domain
  icons: ["https://billoq.com/logo.png"], // Replace with your actual logo URL
};

// 3. Create the AppKit instance
createAppKit({
  adapters: [new EthersAdapter()],
  metadata,
  networks: [mainnet, arbitrum, polygon, base],
  projectId,
  features: {
    analytics: true,
  },
});

interface AppKitProps {
  children: ReactNode;
}

export function AppKit({ children }: AppKitProps) {
  return <>{children}</>;
}