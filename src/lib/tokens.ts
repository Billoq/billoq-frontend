// src/lib/tokens.ts
import { readContract } from "@wagmi/core";
import { wagmiConfig } from "@/config";
import { sepolia, liskSepolia } from "wagmi/chains";

const ERC20_ABI = [
  {
    constant: true,
    inputs: [{ name: "_owner", type: "address" }],
    name: "balanceOf",
    outputs: [{ name: "balance", type: "uint256" }],
    type: "function",
    stateMutability: "view",
  },
  {
    constant: true,
    inputs: [],
    name: "decimals",
    outputs: [{ name: "", type: "uint8" }],
    type: "function",
    stateMutability: "view",
  },
] as const;

type TokenType = "USDC" | "USDT";

const CONTRACT_ADDRESSES = {
  USDC: {
    [sepolia.id]: process.env.NEXT_PUBLIC_SEPOLIA_USDC_ADDRESS as `0x${string}`,
    [liskSepolia.id]: process.env.NEXT_PUBLIC_LISK_SEPOLIA_USDC_ADDRESS as `0x${string}`,
  },
  USDT: {
    [sepolia.id]: process.env.NEXT_PUBLIC_SEPOLIA_USDT_ADDRESS as `0x${string}`,
    [liskSepolia.id]: process.env.NEXT_PUBLIC_LISK_SEPOLIA_USDT_ADDRESS as `0x${string}`,
  },
};

export const fetchTokenBalance = async (
  token: TokenType,
  chainId: number,
  address: string
) => {
  try {
    const supportedChainIds = Object.keys(CONTRACT_ADDRESSES.USDC).map(Number);
    if (!supportedChainIds.includes(chainId)) {
      throw new Error(`Unsupported chain ID: ${chainId}`);
    }

    const contractAddress = CONTRACT_ADDRESSES[token][chainId as keyof typeof CONTRACT_ADDRESSES.USDC];

    const [balance, decimals] = await Promise.all([
      readContract(wagmiConfig, {
        address: contractAddress,
        abi: ERC20_ABI,
        functionName: "balanceOf",
        args: [address as `0x${string}`],
      }),
      readContract(wagmiConfig, {
        address: contractAddress,
        abi: ERC20_ABI,
        functionName: "decimals",
      }),
    ]);

    const balanceInUnits = Number(balance) / 10 ** decimals;
    return balanceInUnits.toString();
  } catch (error) {
    console.error(`Error fetching ${token} balance:`, error);
    throw error; // Let the caller handle the error
  }
};