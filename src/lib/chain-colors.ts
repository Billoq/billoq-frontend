// lib/chain-colors.ts
import { sepolia, liskSepolia, arbitrumSepolia, bscTestnet, lisk, arbitrum, base, bsc } from 'wagmi/chains'

export interface ChainColorConfig {
  bg: string;
  border: string;
  text: string;
  dot: string;
  hex: string;
}

// Comprehensive chain color mapping
export const CHAIN_COLORS: Record<number, ChainColorConfig> = {
  // Mainnet chains
  [lisk.id]: {
    bg: 'bg-blue-500/10',
    border: 'border-blue-500/30',
    text: 'text-blue-400',
    dot: 'bg-blue-500',
    hex: '#3B82F6'
  },
  [arbitrum.id]: {
    bg: 'bg-cyan-500/10',
    border: 'border-cyan-500/30',
    text: 'text-cyan-400',
    dot: 'bg-cyan-500',
    hex: '#06B6D4'
  },
  [base.id]: {
    bg: 'bg-indigo-500/10',
    border: 'border-indigo-500/30',
    text: 'text-indigo-400',
    dot: 'bg-indigo-500',
    hex: '#6366F1'
  },
  [bsc.id]: {
    bg: 'bg-yellow-500/10',
    border: 'border-yellow-500/30',
    text: 'text-yellow-400',
    dot: 'bg-yellow-500',
    hex: '#EAB308'
  },
  
  // Testnet chains
  [sepolia.id]: {
    bg: 'bg-purple-500/10',
    border: 'border-purple-500/30',
    text: 'text-purple-400',
    dot: 'bg-purple-500',
    hex: '#A855F7'
  },
  [liskSepolia.id]: {
    bg: 'bg-blue-500/10',
    border: 'border-blue-500/30',
    text: 'text-blue-400',
    dot: 'bg-blue-500',
    hex: '#3B82F6'
  },
  [arbitrumSepolia.id]: {
    bg: 'bg-cyan-500/10',
    border: 'border-cyan-500/30',
    text: 'text-cyan-400',
    dot: 'bg-cyan-500',
    hex: '#06B6D4'
  },
  [bscTestnet.id]: {
    bg: 'bg-yellow-500/10',
    border: 'border-yellow-500/30',
    text: 'text-yellow-400',
    dot: 'bg-yellow-500',
    hex: '#EAB308'
  },
}

// Helper functions
export const getChainColor = (chainId: number | undefined): ChainColorConfig => {
  if (!chainId || !CHAIN_COLORS[chainId]) {
    return {
      bg: 'bg-gray-500/10',
      border: 'border-gray-500/30',
      text: 'text-gray-400',
      dot: 'bg-gray-500',
      hex: '#6B7280'
    }
  }
  return CHAIN_COLORS[chainId]
}

export const getChainColorByName = (chainName: string): ChainColorConfig => {
  const colorMap: Record<string, ChainColorConfig> = {
    // Mainnet
    'Lisk': CHAIN_COLORS[lisk.id],
    'Arbitrum One': CHAIN_COLORS[arbitrum.id],
    'Base': CHAIN_COLORS[base.id],
    'BNB Smart Chain': CHAIN_COLORS[bsc.id],
    
    // Testnet
    'Sepolia': CHAIN_COLORS[sepolia.id],
    'Ethereum Sepolia': CHAIN_COLORS[sepolia.id],
    'Lisk Sepolia': CHAIN_COLORS[liskSepolia.id],
    'Lisk Testnet': CHAIN_COLORS[liskSepolia.id],
    'Arbitrum Sepolia': CHAIN_COLORS[arbitrumSepolia.id],
    'Arbitrum Testnet': CHAIN_COLORS[arbitrumSepolia.id],
    'BSC Testnet': CHAIN_COLORS[bscTestnet.id],
  }
  
  return colorMap[chainName] || {
    bg: 'bg-gray-500/10',
    border: 'border-gray-500/30',
    text: 'text-gray-400',
    dot: 'bg-gray-500',
    hex: '#6B7280'
  }
}