"use client";

import { Eye, EyeOff, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import { useBalance } from "@/context/balance-context";
import { cn } from "@/lib/utils";
import { ChainIcon } from "./chain-icon";

export function StableAssets() {
  const { 
    usdcBalance, 
    usdtBalance, 
    hideBalances, 
    toggleBalanceVisibility, 
    currentChain,
    exchangeRate // 🎯 Get exchange rate from context instead of hardcoding
  } = useBalance();

  const isUnsupportedChain =
    currentChain !== "Sepolia" && currentChain !== "Lisk Sepolia" && currentChain !== "Arbitrum Sepolia" && currentChain !== "BSC Testnet";
  
  // Use the live exchange rate from context (fallback to 1500 if not loaded yet)
  const currentRate = exchangeRate || 1500;
  
  const assets = [
    {
      name: "USD Coin",
      symbol: "USDC",
      value: usdcBalance ? `$${parseFloat(usdcBalance).toFixed(2)}` : "$0.00",
      localValue: usdcBalance
        ? `₦${(parseFloat(usdcBalance) * currentRate).toLocaleString()}`
        : "₦0",
      icon: "/usdc-icon.svg",
      color: "bg-blue-500/10 border-blue-500/30",
    },
    {
      name: "Tether",
      symbol: "USDT",
      value: usdtBalance ? `$${parseFloat(usdtBalance).toFixed(2)}` : "$0.00",
      localValue: usdtBalance
        ? `₦${(parseFloat(usdtBalance) * currentRate).toLocaleString()}`
        : "₦0",
      icon: "/usdt-icon.svg",
      color: "bg-green-500/10 border-green-500/30",
    },
  ];

  return (
    <Card className="border-0 bg-gradient-to-b from-[#152238B2]/80 to-[#111C2F]/80 rounded-2xl backdrop-blur-sm shadow-lg shadow-blue-900/10">
      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
        <div className="flex items-center gap-2">
          <ChainIcon chain={currentChain} className="h-3 w-3" />
          <CardTitle className="text-lg font-semibold text-white">
            Stable Assets
          </CardTitle>
          {/* Optional: Show current exchange rate in header */}
          {/* {exchangeRate && (
            // <span className="text-xs text-blue-400 ml-2">
            //   @₦{exchangeRate.toFixed(0)}
            // </span>
          )} */}
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="text-blue-400 hover:text-blue-300 h-8 w-8 p-0"
          onClick={toggleBalanceVisibility}
        >
          {hideBalances ? (
            <EyeOff className="h-4 w-4" />
          ) : (
            <Eye className="h-4 w-4" />
          )}
        </Button>
      </CardHeader>

      <CardContent className="space-y-4 pt-2">
        {assets.map((asset) => (
          <div
            key={asset.symbol}
            className={cn(
              "flex items-center justify-between p-3 rounded-xl transition-all hover:bg-white/5",
              asset.color,
              "border"
            )}
          >
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/5 border border-white/10">
                <Image
                  src={asset.icon}
                  alt={asset.name}
                  width={24}
                  height={24}
                  className="h-6 w-6"
                />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-medium text-white">{asset.symbol}</span>
                  <ChevronRight className="h-4 w-4 text-blue-400" />
                </div>
                <p className="text-sm text-white/60">{asset.name}</p>
              </div>
            </div>

            <div className="text-right">
              {isUnsupportedChain || hideBalances || !(asset.symbol === "USDC" ? usdcBalance : usdtBalance) ? (
                <>
                  <p className="font-medium text-white/80">
                    {isUnsupportedChain ? "N/A" : "$****"}
                  </p>
                  <p className="text-xs text-white/40">
                    {isUnsupportedChain ? "" : "₦****"}
                  </p>
                </>
              ) : (
                <>
                  <p className="font-medium text-white">{asset.value}</p>
                  <p className="text-xs text-white/60">{asset.localValue}</p>
                </>
              )}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}