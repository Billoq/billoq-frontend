import abi from './abi.json'

type Environment = 'mainnet' | 'testnet'
const ENVIRONMENT = (process.env.NEXT_PUBLIC_ENVIRONMENT as Environment) || 'testnet'

// Map of chainId to network key
const NETWORKS: Record<number, keyof typeof contracts> = {
  1: 'ethereum',
  56: 'bsc',
  42161: 'arbitrum',
  4202: 'lisk',
  11155111: 'ethereum', // Sepolia
  97: 'bsc',            // BSC Testnet
  421614: 'arbitrum',   // Arbitrum Sepolia
  4201: 'lisk',         // Lisk Sepolia
}

const contracts = {
  ethereum: {
    mainnet: {
      core: process.env.NEXT_PUBLIC_ETHEREUM_MAINNET_CORE as `0x${string}`,
      usdc: process.env.NEXT_PUBLIC_ETHEREUM_MAINNET_USDC as `0x${string}`,
      usdt: process.env.NEXT_PUBLIC_ETHEREUM_MAINNET_USDT as `0x${string}`
    },
    testnet: {
      core: process.env.NEXT_PUBLIC_ETHEREUM_TESTNET_CORE as `0x${string}`,
      usdc: process.env.NEXT_PUBLIC_ETHEREUM_TESTNET_USDC as `0x${string}`,
      usdt: process.env.NEXT_PUBLIC_ETHEREUM_TESTNET_USDT as `0x${string}`,
    },
  },
  bsc: {
    mainnet: {
      core: process.env.NEXT_PUBLIC_BSC_MAINNET_CORE as `0x${string}`,
      usdc: process.env.NEXT_PUBLIC_BSC_MAINNET_USDC as `0x${string}`,
      usdt: process.env.NEXT_PUBLIC_BSC_MAINNET_USDT as `0x${string}`,
    },
    testnet: {
      core: process.env.NEXT_PUBLIC_BSC_TESTNET_CORE as `0x${string}`,
      usdc: process.env.NEXT_PUBLIC_BSC_TESTNET_USDC as `0x${string}`,
      usdt: process.env.NEXT_PUBLIC_BSC_TESTNET_USDT as `0x${string}`,
    },
  },
  arbitrum: {
    mainnet: {
      core: process.env.NEXT_PUBLIC_ARBITRUM_MAINNET_CORE as `0x${string}`,
      usdc: process.env.NEXT_PUBLIC_ARBITRUM_MAINNET_USDC as `0x${string}`,
      usdt: process.env.NEXT_PUBLIC_ARBITRUM_MAINNET_USDT as `0x${string}`,
    },
    testnet: {
      core: process.env.NEXT_PUBLIC_ARBITRUM_TESTNET_CORE as `0x${string}`,
      usdc: process.env.NEXT_PUBLIC_ARBITRUM_TESTNET_USDC as `0x${string}`,
      usdt: process.env.NEXT_PUBLIC_ARBITRUM_TESTNET_USDT as `0x${string}`,
    },
  },
  lisk: {
    mainnet: {
      core: process.env.NEXT_PUBLIC_LISK_MAINNET_CORE as `0x${string}`,
      usdc: process.env.NEXT_PUBLIC_LISK_MAINNET_USDC as `0x${string}`,
      usdt: process.env.NEXT_PUBLIC_LISK_MAINNET_USDT as `0x${string}`,
    },
    testnet: {
      core: process.env.NEXT_PUBLIC_LISK_TESTNET_CORE as `0x${string}`,
      usdc: process.env.NEXT_PUBLIC_LISK_TESTNET_USDC as `0x${string}`,
      usdt: process.env.NEXT_PUBLIC_LISK_TESTNET_USDT as `0x${string}`,
    },
  },
}

// Main export
export function getContractConfig(chainId: number) {
  const networkKey = NETWORKS[chainId]
  const currentContracts = contracts[networkKey]?.[ENVIRONMENT]

  if (!currentContracts) {
    throw new Error(`Unsupported chainId: ${chainId} or environment: ${ENVIRONMENT}`)
  }

  return {
    address: currentContracts.core,
    usdc: currentContracts.usdc,
    usdt: currentContracts.usdt,
    abi: abi,
  }
}
