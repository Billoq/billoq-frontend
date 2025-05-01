// components/Dashboard/chain-icon.tsx
import { cn } from "@/lib/utils";

interface ChainIconProps {
  chain: string | undefined;
  className?: string;
}

export function ChainIcon({ chain, className }: ChainIconProps) {
  const getChainColor = () => {
    switch (chain) {
      case "Sepolia":
        return "bg-green-500";
      case "Lisk Sepolia":
        return "bg-purple-500";
      default:
        return "bg-red-500";
    }
  };

  return (
    <span
      className={cn(
        "inline-block h-2 w-2 rounded-full",
        getChainColor(),
        className
      )}
      title={chain || "Unknown network"}
    />
  );
}