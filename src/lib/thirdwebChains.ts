"use client";

import {
  arbitrum,
  arbitrumSepolia,
  base,
  baseSepolia,
  bsc,
  bscTestnet,
  sepolia,
} from "thirdweb/chains";
import { defineChain } from "thirdweb";

type ThirdwebChain = ReturnType<typeof defineChain>;

const liskMainnetRpc = process.env.NEXT_PUBLIC_LISK_MAINNET_RPC || "https://lisk.drpc.org";
const liskTestnetRpc =
  process.env.NEXT_PUBLIC_LISK_TESTNET_RPC || "https://rpc.sepolia.lisk.com";

export const lisk = defineChain({
  id: 1135,
  name: "Lisk",
  nativeCurrency: {
    name: "Lisk",
    symbol: "LSK",
    decimals: 18,
  },
  rpcUrls: {
    default: { http: [liskMainnetRpc] },
    public: { http: [liskMainnetRpc] },
  },
  blockExplorers: [
    {
      name: "Lisk Explorer",
      url: "https://blockscout.lisk.com",
    },
  ],
});

export const liskSepolia = defineChain({
  id: 4202,
  name: "Lisk Sepolia",
  nativeCurrency: {
    name: "Lisk",
    symbol: "LSK",
    decimals: 18,
  },
  rpcUrls: {
    default: { http: [liskTestnetRpc] },
    public: { http: [liskTestnetRpc] },
  },
  blockExplorers: [
    {
      name: "Lisk Sepolia Explorer",
      url: "https://sepolia-blockscout.lisk.com",
    },
  ],
  testnet: true,
});

const isMainnet = process.env.NEXT_PUBLIC_ENVIRONMENT === "mainnet";

export const mainnetChains: ThirdwebChain[] = [ base, arbitrum,lisk, bsc];
export const testnetChains: ThirdwebChain[] = [
  baseSepolia,
  liskSepolia,
  arbitrumSepolia,
  bscTestnet,
  sepolia,
];

export const supportedChains = (isMainnet ? mainnetChains : testnetChains) as ThirdwebChain[];
export const defaultChain = supportedChains[0] ?? (isMainnet ? base : baseSepolia);

const allChains = [...mainnetChains, ...testnetChains];

const chainMap = allChains.reduce<Record<number, ThirdwebChain>>((acc, chain) => {
  acc[chain.id] = chain;
  return acc;
}, {});

export function getChainById(chainId?: number): ThirdwebChain | undefined {
  if (!chainId) return undefined;
  return chainMap[chainId];
}

export function getChainName(chainId?: number): string {
  return getChainById(chainId)?.name ?? `Chain ${chainId ?? "Unknown"}`;
}

export const isMainnetEnvironment = isMainnet;

