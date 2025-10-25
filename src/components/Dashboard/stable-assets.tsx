"use client";

import { Eye, EyeOff, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import { useBalance } from "@/context/balance-context";
import { cn } from "@/lib/utils";
import { getChainColorByName } from "@/lib/chain-colors";
import { ChainDot } from "@/components/chain-dot";

export function StableAssets() {
  const { 
    usdcBalance, 
    usdtBalance, 
    hideBalances, 
    toggleBalanceVisibility, 
    currentChain,
    exchangeRate, // Get exchange rate from context instead of hardcoding
    isMainnet, // Get environment info
  } = useBalance();

  // Define supported chains based on environment
  const supportedChains = isMainnet 
    ?  ["Lisk", "Arbitrum", "Base", "BSC"]
    : ["Ethereum Sepolia", "Lisk Sepolia", "Arbitrum Sepolia", "BSC Testnet"];

  const isUnsupportedChain = !supportedChains.includes(currentChain);
  
  // Use the live exchange rate from context (fallback to 1500 if not loaded yet)
  const currentRate = exchangeRate || 1500;
  
  // Get current chain colors
  const chainColors = getChainColorByName(currentChain);
  
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
      balance: usdcBalance,
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
      balance: usdtBalance,
    },
  ];

  return (
    <Card className={`border-0 bg-gradient-to-b from-[#152238B2]/80 to-[#111C2F]/80 rounded-2xl backdrop-blur-sm shadow-lg ${
      isUnsupportedChain ? 'shadow-red-900/10' : 'shadow-blue-900/10'
    }`}>
      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
        <div className="flex items-center gap-2">
          <ChainDot chainName={currentChain} className="h-3 w-3" />
          <CardTitle className="text-lg font-semibold text-white">
            Stable Assets
          </CardTitle>
          {/* Environment indicator */}
          {/* <span className={`text-xs px-2 py-1 rounded-full ${
            isMainnet 
              ? 'bg-green-900/30 text-green-400 border border-green-800/30' 
              : 'bg-orange-900/30 text-orange-400 border border-orange-800/30'
          }`}>
            {isMainnet ? 'Live' : 'Test'}
          </span> */}
          {/* Chain status indicator */}
          {/* <span className={`text-xs px-2 py-1 rounded-full border ${
            isUnsupportedChain 
              ? 'bg-red-900/30 text-red-400 border-red-800/30'
              : `${chainColors.bg} ${chainColors.text} ${chainColors.border}`
          }`}>
            {isUnsupportedChain ? 'Unsupported' : 'Active'}
          </span> */}
          {/* Exchange rate display */}
          {/* {exchangeRate && !isUnsupportedChain && (
            <span className={`text-xs ml-1 ${chainColors.text}/70`}>
              @₦{exchangeRate.toFixed(0)}
            </span>
          )} */}
        </div>
        <Button
          variant="ghost"
          size="sm"
          className={`h-8 w-8 p-0 ${chainColors.text} hover:${chainColors.text}/80`}
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
        {/* Unsupported chain warning */}
        {isUnsupportedChain && (
          <div className="bg-red-900/20 border border-red-800/50 rounded-lg p-3 mb-4">
            <p className="text-sm font-medium text-red-300 text-center">
              Unsupported {isMainnet ? 'mainnet' : 'testnet'} chain
            </p>
            <p className="text-xs text-red-400/70 text-center mt-1">
              Switch to: {supportedChains.join(', ')}
            </p>
          </div>
        )}

        {assets.map((asset) => (
          <div
            key={asset.symbol}
            className={cn(
              "flex items-center justify-between p-3 rounded-xl transition-all hover:bg-white/5",
              asset.color,
              "border",
              isUnsupportedChain && "opacity-50",
              !isUnsupportedChain && `hover:${chainColors.border} hover:${chainColors.bg}`
            )}
          >
            <div className="flex items-center gap-3">
              <div className={`flex h-10 w-10 items-center justify-center rounded-full bg-white/5 border border-white/10 ${
                !isUnsupportedChain && `hover:${chainColors.border}`
              }`}>
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
                  <ChevronRight className={`h-4 w-4 ${isUnsupportedChain ? 'text-gray-400' : chainColors.text}`} />
                </div>
                <p className="text-sm text-white/60">{asset.name}</p>
              </div>
            </div>

            <div className="text-right">
              {isUnsupportedChain || hideBalances || !asset.balance ? (
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
                  <p className={`text-xs text-white`}>{asset.localValue}</p>
                </>
              )}
            </div>
          </div>
        ))}
        
        {/* Network info footer */}
        {/* <div className={`flex items-center justify-between pt-2 border-t ${
          isUnsupportedChain ? 'border-red-500/20' : `${chainColors.border}`
        }`}>
          <div className="flex items-center gap-2">
            <ChainDot chainName={currentChain} className={`w-2 h-2 ${isUnsupportedChain ? 'opacity-50' : ''}`} />
            <span className="text-xs text-white/60">
              {currentChain}
            </span> */}
            {/* Connection status */}
            {/* <span className={`text-xs px-1 py-0.5 rounded ${
              isUnsupportedChain 
                ? 'bg-red-900/30 text-red-400'
                : `${chainColors.bg} ${chainColors.text}`
            }`}>
              {isUnsupportedChain ? 'Offline' : 'Online'}
            </span>
          </div>
          <div className="text-xs text-white/40">
            {isMainnet ? 'Real Value' : 'Test Mode'}
          </div>
        </div> */}

        {/* Chain color preview (optional - shows all available chains) */}
        {!isUnsupportedChain && (
          <div className="flex items-center gap-1 pt-2 justify-center">
            {supportedChains.map((chain) => {
              const colors = getChainColorByName(chain);
              const isActive = chain === currentChain;
              return (
                <div
                  key={chain}
                  className={`w-2 h-2 rounded-full transition-all ${
                    isActive 
                      ? `${colors.dot} scale-125 shadow-sm` 
                      : `${colors.dot} opacity-30 hover:opacity-60`
                  }`}
                  title={chain}
                />
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}