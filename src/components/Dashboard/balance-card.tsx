"use client";

import { Eye, EyeOff, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useBalance } from "@/context/balance-context";
import Link from "next/link";
import { getChainColorByName } from "@/lib/chain-colors";
import { ChainDot } from "@/components/chain-dot";

export function BalanceCard() {
  const {
    totalBalanceNGN,
    usdcBalance,
    usdtBalance,
    hideBalances,
    toggleBalanceVisibility,
    currentChain,
    isMainnet, // This should be available from your updated balance context
  } = useBalance();

  const totalUSDBalance =
    usdcBalance && usdtBalance
      ? (parseFloat(usdcBalance) + parseFloat(usdtBalance)).toFixed(2)
      : "0.00";

  // Define supported chains based on environment
  const supportedChains = isMainnet
    ? ["Lisk", "Arbitrum", "Base", "BSC"]
    : ["Ethereum Sepolia", "Lisk Sepolia", "Arbitrum Sepolia", "BSC Testnet"];

  const isUnsupportedChain = !supportedChains.includes(currentChain);

  // Get chain colors
  const chainColors = getChainColorByName(currentChain);

  const handleToggleVisibility = () => {
    toggleBalanceVisibility();
  };

  return (
    <div className="flex flex-col gap-4">
      <Card className={`relative overflow-hidden border-0 bg-gradient-to-br from-blue-900/40 via-[#0f172a]/40 to-[#252E3A80]/50 rounded-2xl shadow-lg backdrop-blur-sm ${isUnsupportedChain ? 'shadow-red-500/10' : 'shadow-blue-500/10'
        }`}>
        {/* Dynamic background gradient based on chain color */}
        <div className="absolute inset-0 bg-[url('/dasboard-balanceCard.png')] bg-cover opacity-10"></div>
       <div 
          className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-opacity-10"
          style={{
            background: `linear-gradient(135deg, transparent, transparent, ${chainColors.hex}20)`,
          }}
        ></div>
        
        <CardHeader className="pb-2 relative z-10">
          <div className="flex justify-between items-center">
            <CardTitle className="text-xl font-semibold text-white/90 flex items-center gap-2">
              <ChainDot chainName={currentChain} className="w-3 h-3" />
              <span>Total Balance</span>
              {/* Environment indicator */}
              <span className={`text-xs px-2 py-1 rounded-full ${isMainnet
                  ? 'bg-green-900/30 text-green-400 border border-green-800/30'
                  : 'bg-orange-900/30 text-orange-400 border border-orange-800/30'
                }`}>
                {isMainnet ? 'Mainnet' : 'Testnet'}
              </span>
            </CardTitle>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-white/60 hover:text-white hover:bg-white/10 rounded-full"
              onClick={handleToggleVisibility}
            >
              {hideBalances ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </Button>
          </div>

          {/* Chain name with network info */}
          <div className="flex items-center gap-2 mt-1">
            <p className={`text-sm ${isUnsupportedChain ? 'text-red-400' : chainColors.text}`}>
              {currentChain}
            </p>
            {/* Status indicators */}
            <div className="flex gap-2">
              {isUnsupportedChain && (
                <span className="text-xs bg-red-900/30 text-red-400 px-2 py-1 rounded-full border border-red-800/30">
                  Unsupported
                </span>
              )}
              {/* {!isUnsupportedChain && (
                <span className={`text-xs px-2 py-1 rounded-full border ${chainColors.bg} ${chainColors.text} ${chainColors.border}`}>
                  Active
                </span>
              )} */}
            </div>
          </div>
        </CardHeader>

        <CardContent className="relative z-10">
          <div className="space-y-4">
            {isUnsupportedChain ? (
              <div className="bg-red-900/20 border border-red-800/50 rounded-lg p-3">
                <p className="text-sm font-medium text-red-300 text-center">
                  Unsupported network. Switch to a supported {isMainnet ? 'mainnet' : 'testnet'} chain in settings.
                </p>
                <p className="text-xs text-red-400/70 text-center mt-1">
                  Supported: {supportedChains.join(', ')}
                </p>
              </div>
            ) : hideBalances || !usdcBalance || !usdtBalance ? (
              <>
                <div className="flex items-end gap-2">
                  <h2 className="text-3xl font-bold text-white tracking-tight">******</h2>
                  <span className="text-lg font-medium text-white/70 mb-1">NGN</span>
                </div>
                <div className="flex items-end gap-2">
                  <p className="text-xl font-medium text-white/70">******</p>
                  <span className="text-sm font-medium text-white/50 mb-1">USD</span>
                </div>
              </>
            ) : (
              <>
                <div className="flex items-end gap-2">
                  <h2 className="text-3xl font-bold text-white tracking-tight">
                    ₦{totalBalanceNGN?.toLocaleString() || "0"}
                  </h2>
                  <span className="text-lg font-medium text-white/70 mb-1">NGN</span>
                </div>
                <div className="flex items-end gap-2">
                  <p className="text-xl font-medium text-white/70">
                    ${totalUSDBalance}
                  </p>
                  <span className="text-sm font-medium text-white/50 mb-1">USD</span>
                </div>

                {/* Balance breakdown with chain colors */}
                {/* <div className={`flex justify-between items-center pt-2 border-t ${chainColors.border}/30`}>
                  <div className="text-center">
                    <p className="text-xs text-white/50">USDC</p>
                    <p className={`text-sm font-medium ${chainColors.text}`}>
                      {parseFloat(usdcBalance || '0').toFixed(2)}
                    </p>
                  </div>
                  <div className={`w-px h-8 ${chainColors.bg}`}></div>
                  <div className="text-center">
                    <p className="text-xs text-white/50">USDT</p>
                    <p className={`text-sm font-medium ${chainColors.text}`}>
                      {parseFloat(usdtBalance || '0').toFixed(2)}
                    </p>
                  </div>
                </div> */}
              </>
            )}
          </div>
        </CardContent>

        {/* Dynamic bottom gradient */}
        <div
          className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r opacity-50"
          style={{
            background: `linear-gradient(90deg, ${chainColors.hex}60, ${chainColors.hex}30, transparent)`,
          }}
        ></div>
      </Card>

      <Link href="/dashboard/services">
          <Button className="w-full h-14 bg-gradient-to-r from-[#1B89A4] to-[#1B89A4]/70 hover:from-[#1B89A4]/80 hover:to-[#1B89A4]/80 text-white rounded-xl shadow-md transition-all transform hover:-translate-y-0.5 cursor-pointer">
          <div className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            <span>Pay Bill</span>
          
          </div>
        </Button>
      </Link>
    </div>
  );
}