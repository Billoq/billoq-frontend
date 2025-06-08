// src/lib/tokens.ts
import { readContract } from "@wagmi/core";
import { wagmiConfig } from "@/config";
import { getContractConfig } from "@/config/contract";

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

export const fetchTokenBalance = async (
  token: TokenType,
  chainId: number,
  address: string
) => {
  try {
    const config = getContractConfig(chainId);

    const tokenAddress = config[token.toLowerCase() as keyof typeof config] as `0x${string}` | undefined;
    if (!tokenAddress) {
      throw new Error(`${token} contract not found for chain ID: ${chainId}`);
    }

    const [balance, decimals] = await Promise.all([
      readContract(wagmiConfig, {
        address: tokenAddress as `0x${string}`,
        abi: ERC20_ABI,
        functionName: "balanceOf",
        args: [address as `0x${string}`],
      }),
      readContract(wagmiConfig, {
        address: tokenAddress as `0x${string}`,
        abi: ERC20_ABI,
        functionName: "decimals",
      }),
    ]);

    const balanceInUnits = Number(balance) / 10 ** decimals;
    return balanceInUnits.toString();
  } catch (error) {
    console.error(`Error fetching ${token} balance:`, error);
    throw error;
  }
};
