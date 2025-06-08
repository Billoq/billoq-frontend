// context/appkit.tsx
"use client";

import { createAppKit } from "@reown/appkit/react";
import { EthersAdapter } from "@reown/appkit-adapter-ethers";
import {  sepolia, liskSepolia, arbitrumSepolia, bscTestnet } from "@reown/appkit/networks";
import { ReactNode } from "react";

// 1. Get projectId at https://cloud.reown.com
const projectId = "8387f0bbb57a265cd4dd96c3e658ac55"; // Replace with your actual project ID

// 2. Create a metadata object
const metadata = {
  name: "Billoq",
  description: "Billoq application",
  url: "https://www.billoqpay.com", // Replace with your actual domain
  icons: ["https://www.billoqpay.com/logo.png"], // Replace with your actual logo URL
};

// 3. Create the AppKit instance
createAppKit({
  adapters: [new EthersAdapter()],
  metadata,
  networks: [ liskSepolia, sepolia, arbitrumSepolia, bscTestnet],
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