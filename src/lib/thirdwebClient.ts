"use client";

import { createThirdwebClient } from "thirdweb";

const clientId = process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID;

if (!clientId) {
  throw new Error(
    "Missing NEXT_PUBLIC_THIRDWEB_CLIENT_ID. Please set it in your environment to initialize thirdweb."
  );
}

export const thirdwebClient = createThirdwebClient({
  clientId,
  rpcOverrides: {
    1135: process.env.NEXT_PUBLIC_LISK_MAINNET_RPC || "https://lisk.drpc.org",
    4202: process.env.NEXT_PUBLIC_LISK_TESTNET_RPC || "https://rpc.sepolia.lisk.com",
  },
});

