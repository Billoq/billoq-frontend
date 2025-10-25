// src/config.ts
import { sepolia, liskSepolia, arbitrumSepolia, bscTestnet, lisk, arbitrum, base, bsc } from 'wagmi/chains'
import type { Chain } from 'wagmi/chains'
import { http, createConfig } from 'wagmi';

// Environment detection
const isMainnet = process.env.NEXT_PUBLIC_ENVIRONMENT === 'mainnet'

// Dynamic chain configuration based on environment
const mainnetChains: readonly [Chain, ...Chain[]] = [lisk, arbitrum, base, bsc]
const testnetChains: readonly [Chain, ...Chain[]] = [sepolia, liskSepolia, arbitrumSepolia, bscTestnet]

// Use appropriate chains based on environment
export const supportedChains = isMainnet ? mainnetChains : testnetChains

// Dynamic contract addresses based on environment
export const CONTRACT_ADDRESSES = isMainnet ? {
  // Mainnet addresses
  LISK_USDT: process.env.NEXT_PUBLIC_LISK_MAINNET_USDT as `0x${string}`,
  LISK_USDC: process.env.NEXT_PUBLIC_LISK_MAINNET_USDC as `0x${string}`,
  ARBITRUM_USDT: process.env.NEXT_PUBLIC_ARBITRUM_MAINNET_USDT as `0x${string}`,
  ARBITRUM_USDC: process.env.NEXT_PUBLIC_ARBITRUM_MAINNET_USDC as `0x${string}`,
  BASE_USDT: process.env.NEXT_PUBLIC_BASE_MAINNET_USDT as `0x${string}`,
  BASE_USDC: process.env.NEXT_PUBLIC_BASE_MAINNET_USDC as `0x${string}`,
  BSC_USDT: process.env.NEXT_PUBLIC_BSC_MAINNET_USDT as `0x${string}`,
  BSC_USDC: process.env.NEXT_PUBLIC_BSC_MAINNET_USDC as `0x${string}`,
  // Core contracts
  LISK_CORE: process.env.NEXT_PUBLIC_LISK_MAINNET_CORE as `0x${string}`,
  ARBITRUM_CORE: process.env.NEXT_PUBLIC_ARBITRUM_MAINNET_CORE as `0x${string}`,
  BASE_CORE: process.env.NEXT_PUBLIC_BASE_MAINNET_CORE as `0x${string}`,
  BSC_CORE: process.env.NEXT_PUBLIC_BSC_MAINNET_CORE as `0x${string}`,
} : {
  // Testnet addresses
  SEPOLIA_USDT: process.env.NEXT_PUBLIC_ETHEREUM_TESTNET_USDT as `0x${string}`,
  SEPOLIA_USDC: process.env.NEXT_PUBLIC_ETHEREUM_TESTNET_USDC as `0x${string}`,
  LISK_SEPOLIA_USDT: process.env.NEXT_PUBLIC_LISK_TESTNET_USDT as `0x${string}`,
  LISK_SEPOLIA_USDC: process.env.NEXT_PUBLIC_LISK_TESTNET_USDC as `0x${string}`,
  ARBITRUM_SEPOLIA_USDT: process.env.NEXT_PUBLIC_ARBITRUM_TESTNET_USDT as `0x${string}`,
  ARBITRUM_SEPOLIA_USDC: process.env.NEXT_PUBLIC_ARBITRUM_TESTNET_USDC as `0x${string}`,
  BSC_TESTNET_USDT: process.env.NEXT_PUBLIC_BSC_TESTNET_USDT as `0x${string}`,
  BSC_TESTNET_USDC: process.env.NEXT_PUBLIC_BSC_TESTNET_USDC as `0x${string}`,
  // Core contracts
  SEPOLIA_CORE: process.env.NEXT_PUBLIC_ETHEREUM_TESTNET_CORE as `0x${string}`,
  LISK_SEPOLIA_CORE: process.env.NEXT_PUBLIC_LISK_TESTNET_CORE as `0x${string}`,
  ARBITRUM_SEPOLIA_CORE: process.env.NEXT_PUBLIC_ARBITRUM_TESTNET_CORE as `0x${string}`,
  BSC_TESTNET_CORE: process.env.NEXT_PUBLIC_BSC_TESTNET_CORE as `0x${string}`,
}

// Dynamic transports based on environment
const createTransports = () => {
  const transports: Record<number, ReturnType<typeof http>> = {}
  
  if (isMainnet) {
    transports[lisk.id] = http()
    transports[arbitrum.id] = http()
    transports[base.id] = http()
    transports[bsc.id] = http()
  } else {
    transports[sepolia.id] = http()
    transports[liskSepolia.id] = http()
    transports[arbitrumSepolia.id] = http()
    transports[bscTestnet.id] = http()
  }
  
  return transports
}

export const wagmiConfig = createConfig({
  chains: supportedChains,
  transports: createTransports(),
});

// Export environment info for debugging
export const environmentInfo = {
  isMainnet,
  environment: process.env.NEXT_PUBLIC_ENVIRONMENT,
  supportedChainIds: supportedChains.map(chain => chain.id),
  supportedChainNames: supportedChains.map(chain => chain.name),
}