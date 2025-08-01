// src/config.ts
import { mainnet, sepolia, polygon, base } from 'wagmi/chains'

export const CONTRACT_ADDRESSES = {
  SEPOLIA_USDT: process.env.NEXT_PUBLIC_SEPOLIA_USDT_ADDRESS as `0x${string}`,
  SEPOLIA_USDC: process.env.NEXT_PUBLIC_SEPOLIA_USDC_ADDRESS as `0x${string}`,
  LISK_SEPOLIA_USDT: process.env.NEXT_PUBLIC_LISK_SEPOLIA_USDT_ADDRESS as `0x${string}`,
  LISK_SEPOLIA_USDC: process.env.NEXT_PUBLIC_LISK_SEPOLIA_USDC_ADDRESS as `0x${string}`,
  SEPOLIA_CONTRACT: process.env.NEXT_PUBLIC_SEPOLIA_CONTRACT_ADDRESS as `0x${string}`,
  LISK_SEPOLIA_CONTRACT: process.env.NEXT_PUBLIC_LISK_SEPOLIA_CONTRACT_ADDRESS as `0x${string}`,
};

export const WAGMI_CHAINS = {
  mainnet,
  sepolia,
  polygon,
  base,
  // Add custom chains if needed
};

export const WAGMI_CONFIG = createConfig({
  chains: Object.values(WAGMI_CHAINS),
  transports: {
    [mainnet.id]: http(),
    [sepolia.id]: http(),
    [polygon.id]: http(),
    [base.id]: http()
  },
});