// src/config.ts
import { sepolia,liskSepolia } from 'wagmi/chains'
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
    chains: [sepolia,liskSepolia],
    transports: {
      [sepolia.id]: http(),
      [liskSepolia.id]: http()
    },
  });