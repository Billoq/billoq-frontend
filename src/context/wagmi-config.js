// context/wagmi-config.js
"use client";

import { http, createConfig } from 'wagmi';
import { mainnet, sepolia, polygon, base } from 'wagmi/chains';

export const wagmiConfig = createConfig({
  chains: [mainnet, sepolia, polygon, base],
  transports: {
    [mainnet.id]: http(),
    [sepolia.id]: http(),
    [polygon.id]: http(),
    [base.id]: http()
  },
});