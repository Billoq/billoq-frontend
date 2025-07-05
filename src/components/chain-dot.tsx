// components/chain-dot.tsx
import { getChainColor, getChainColorByName } from "@/lib/chain-colors";

interface ChainDotProps {
  chainId?: number;
  chainName?: string;
  className?: string;
}

export const ChainDot = ({ chainId, chainName, className = "w-3 h-3" }: ChainDotProps) => {
  const colors = chainId 
    ? getChainColor(chainId) 
    : chainName 
    ? getChainColorByName(chainName) 
    : getChainColor(undefined);
    
  return <div className={`${colors.dot} ${className} rounded-full`} />;
};