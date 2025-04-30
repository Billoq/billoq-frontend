// components/Dashboard/stable-assets.tsx
"use client";

import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import { useBalance } from "@/context/balance-context";

export function StableAssets() {
  const { usdcBalance, usdtBalance, hideBalances, toggleBalanceVisibility, currentChain } = useBalance();

  const isUnsupportedChain = currentChain !== "Sepolia" && currentChain !== "Lisk Sepolia";

  const assets = [
    {
      name: "USDC",
      symbol: "USDC",
      value: usdcBalance ? `$${parseFloat(usdcBalance).toFixed(2)}` : "$0.00",
      localValue: usdcBalance
        ? `₦${(parseFloat(usdcBalance) * 1500).toLocaleString()}`
        : "₦0",
      icon: "/usdcIcon.png",
    },
    {
      name: "Tether",
      symbol: "USDT",
      value: usdtBalance ? `$${parseFloat(usdtBalance).toFixed(2)}` : "$0.00",
      localValue: usdtBalance
        ? `₦${(parseFloat(usdtBalance) * 1500).toLocaleString()}`
        : "₦0",
      icon: "/usdtIcon.png",
    },
  ];

  return (
    <Card className="border-slate-800 text-[#D9D9D9] bg-[#252E3A80]/50">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-[20px] font-semibold">Your Stable Assets</CardTitle>
        <div className="text-right text-[16px] font-normal text-[#60A5FA]">Value</div>
      </CardHeader>
      <CardContent className="space-y-4">
        {assets.map((asset) => (
          <div key={asset.symbol} className="flex items-center pb-5 border-b border-[#396294] justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-800">
                <Image
                  src={asset.icon || "/placeholder.svg"}
                  alt={asset.name}
                  width={32}
                  height={32}
                  className="h-6 w-6"
                />
              </div>
              <div>
                <div className="flex items-center gap-1">
                  <span className="font-medium text-lg">{asset.symbol}</span>
                  
                </div>
                <p className="text-sm font-normal text-slate-400">{asset.name}</p>
              </div>
            </div>
            <div className="text-right">
              {isUnsupportedChain || hideBalances || !(asset.symbol === "USDC" ? usdcBalance : usdtBalance) ? (
                <>
                  <p className="font-medium text-[16px] text-slate-400">
                    {isUnsupportedChain ? "N/A" : "$****"}
                  </p>
                  <p className="text-xs text-slate-400 text-[13px]">
                    {isUnsupportedChain ? "" : "₦****"}
                  </p>
                </>
              ) : (
                <>
                  <p className="font-medium text-[16px]">{asset.value}</p>
                  <p className="text-xs text-slate-400 text-[13px]">{asset.localValue}</p>
                </>
              )}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}