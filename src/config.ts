// src/config.ts
import { mainnet, sepolia,liskSepolia, polygon, base } from 'wagmi/chains'
import { http, createConfig } from 'wagmi';
export const CONTRACT_ADDRESSES = {
  SEPOLIA_USDT: process.env.NEXT_PUBLIC_SEPOLIA_USDT_ADDRESS as `0x${string}`,
  SEPOLIA_USDC: process.env.NEXT_PUBLIC_SEPOLIA_USDC_ADDRESS as `0x${string}`,
  LISK_SEPOLIA_USDT: process.env.NEXT_PUBLIC_LISK_SEPOLIA_USDT_ADDRESS as `0x${string}`,
  LISK_SEPOLIA_USDC: process.env.NEXT_PUBLIC_LISK_SEPOLIA_USDC_ADDRESS as `0x${string}`,
  SEPOLIA_CONTRACT: process.env.NEXT_PUBLIC_SEPOLIA_CONTRACT_ADDRESS as `0x${string}`,
  LISK_SEPOLIA_CONTRACT: process.env.NEXT_PUBLIC_LISK_SEPOLIA_CONTRACT_ADDRESS as `0x${string}`,
};


export const wagmiConfig =  createConfig({
    chains: [mainnet, sepolia, polygon, base,liskSepolia],
    transports: {
      [mainnet.id]: http(),
      [sepolia.id]: http(),
      [polygon.id]: http(),
      [base.id]: http(),
      [liskSepolia.id]: http()
    },
  });