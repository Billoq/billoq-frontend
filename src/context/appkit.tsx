// context/appkit.tsx
"use client";
import { createAppKit } from "@reown/appkit/react";
import { EthersAdapter } from "@reown/appkit-adapter-ethers";
import { sepolia, liskSepolia, arbitrumSepolia, bscTestnet, lisk, arbitrum, base, bsc } from "@reown/appkit/networks";
import type { AppKitNetwork } from "@reown/appkit/networks";
import { ReactNode } from "react";

// Environment detection
const isMainnet = process.env.NEXT_PUBLIC_ENVIRONMENT === 'mainnet'

// Dynamic network configuration based on environment
const mainnetNetworks: [AppKitNetwork, ...AppKitNetwork[]] = [lisk, arbitrum, base, bsc]
const testnetNetworks: [AppKitNetwork, ...AppKitNetwork[]] = [sepolia, liskSepolia, arbitrumSepolia, bscTestnet]

// Use appropriate networks based on environment (always ensure at least one network)
const supportedNetworks = isMainnet ? mainnetNetworks : testnetNetworks

// 1. Get projectId at https://cloud.reown.com
const projectId = "a9fbadc760baa309220363ec867b732e"; // Replace with your actual project ID

// 2. Create a metadata object
const metadata = {
  name: "Billoq",
  description: `Billoq application - ${isMainnet ? 'Mainnet' : 'Testnet'} Mode`,
  url: "https://www.billoqpay.com", // Replace with your actual domain
  icons: ["https://www.billoqpay.com/logo.png"], // Replace with your actual logo URL
};

// Log environment info for debugging
console.log(`🌍 AppKit Environment: ${isMainnet ? 'Mainnet' : 'Testnet'}`);
console.log(`📡 Supported Networks:`, supportedNetworks.map(n => n.name));

// 3. Create the AppKit instance
createAppKit({
  adapters: [new EthersAdapter()],
  metadata,
  networks: supportedNetworks,
  projectId,
  features: {
    analytics: true,
  },
  // Optional: Add environment-specific features
  ...(isMainnet ? {
    // Mainnet specific configurations
    enableExplorer: true,
  } : {
    // Testnet specific configurations
    enableExplorer: true,
    enableOnramp: false, // Disable on-ramp for testnets
  })
});

interface AppKitProps {
  children: ReactNode;
}

export function AppKit({ children }: AppKitProps) {
  return <>{children}</>;
}