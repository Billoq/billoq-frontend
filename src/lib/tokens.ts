import { getContract, readContract } from "thirdweb";
import { thirdwebClient } from "@/lib/thirdwebClient";
import { getChainById } from "@/lib/thirdwebChains";
import { getContractConfig } from "@/config/contract";

type TokenType = "USDC" | "USDT";

const getKnownTokenDecimals = (token: TokenType, chainId: number): number => {
  // BSC (mainnet & testnet) stablecoins use 18 decimals
  if (chainId === 56 || chainId === 97) {
    return 18;
  }

  // Default to 6 decimals for USDC/USDT on other supported chains
  return 6;
};

export const fetchTokenBalance = async (
  token: TokenType,
  chainId: number,
  address: string
) => {
  try {
    const config = getContractConfig(chainId);
    const chain = getChainById(chainId);

    if (!chain) {
      throw new Error(`Unsupported chain ID: ${chainId}`);
    }

    const tokenAddress =
      (config[token.toLowerCase() as keyof typeof config] as `0x${string}` | undefined);

    if (!tokenAddress) {
      throw new Error(`${token} contract not found for chain ID: ${chainId}`);
    }

    const contract = getContract({
      address: tokenAddress,
      client: thirdwebClient,
      chain,
    });

    const balance = await readContract({
      contract,
      method: "function balanceOf(address) view returns (uint256)",
      params: [address],
    });

    const decimals = getKnownTokenDecimals(token, chainId);
    const balanceInUnits = Number(balance) / 10 ** decimals;
    return balanceInUnits.toString();
  } catch (error) {
    console.error(`Error fetching ${token} balance:`, error);
    throw error;
  }
};
