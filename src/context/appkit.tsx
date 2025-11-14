// context/appkit.tsx
"use client";
import { ThirdwebProvider } from "thirdweb/react";
import {
  defaultChain,
  isMainnetEnvironment,
  supportedChains,
} from "@/lib/thirdwebChains";
import { ReactNode } from "react";

// Log environment info for debugging
console.log(`🌍 Environment: ${isMainnetEnvironment ? 'Mainnet' : 'Testnet'}`);
console.log(`📡 Supported Networks:`, supportedChains.map(chain => chain.name));
console.log(`🔧 Default Chain:`, defaultChain.name);

interface AppKitProps {
  children: ReactNode;
}

export function AppKit({ children }: AppKitProps) {
  return (
    <ThirdwebProvider>
      {children}
    </ThirdwebProvider>
  );
}