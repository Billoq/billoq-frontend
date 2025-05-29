"use client";

import { Eye, EyeOff, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useBalance } from "@/context/balance-context";
import Link from "next/link";


export function BalanceCard() {
  const {
    totalBalanceNGN,
    usdcBalance,
    usdtBalance,
    hideBalances,
    toggleBalanceVisibility,
    currentChain,
  } = useBalance();

  const totalUSDBalance =
    usdcBalance && usdtBalance
      ? (parseFloat(usdcBalance) + parseFloat(usdtBalance)).toFixed(2)
      : "0.00";

  const isUnsupportedChain =
    currentChain !== "Sepolia" && currentChain !== "Lisk Sepolia" && currentChain !== "Arbitrum Sepolia" && currentChain !== "BSC Testnet";

  const handleToggleVisibility = () => {
    toggleBalanceVisibility();
  };

  return (
    <div className="flex flex-col gap-4">
      <Card className="relative overflow-hidden border-0  bg-gradient-to-br from-blue-900/40 via-[#0f172a]/40 to-[#252E3A80]/50 rounded-2xl shadow-lg shadow-blue-500/10 backdrop-blur-sm">
        <div className="absolute inset-0 bg-[url('/dasboard-balanceCard.png')] bg-cover opacity-10"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-blue-500/10"></div>
        
        <CardHeader className="pb-2 relative z-10">
          <div className="flex justify-between items-center">
            <CardTitle className="text-xl font-semibold text-white/90 flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${
                currentChain === "Sepolia" ? 'bg-green-500' : 
                currentChain === "Lisk Sepolia" ? 'bg-purple-500' :
                currentChain === "Arbitrum Sepolia" ? 'bg-blue-500': 
                currentChain === "BSC Testnet"? 'bg-yellow-500' : 'bg-red-500'
              }`} />
              Total Balance
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
        </CardHeader>

        <CardContent className="relative z-10">
          <div className="space-y-4">
            {isUnsupportedChain ? (
              <div className="bg-red-900/20 border border-red-800/50 rounded-lg p-3">
                <p className="text-sm font-medium text-red-300 text-center">
                  Unsupported network. Switch to a supported chain in settings.
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
                    {totalBalanceNGN?.toLocaleString() || "0"}
                  </h2>
                  <span className="text-lg font-medium text-white/70 mb-1">NGN</span>
                </div>
                <div className="flex items-end gap-2">
                  <p className="text-xl font-medium text-white/70">
                    {totalUSDBalance}
                  </p>
                  <span className="text-sm font-medium text-white/50 mb-1">USD</span>
                </div>
              </>
            )}
          </div>
        </CardContent>

        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-400/30 via-purple-400/30 to-transparent"></div>
      </Card>

      <Link href="/dashboard/services">
        <Button className="w-full h-14 bg-gradient-to-r from-[#1D4ED8] to-[#1D4ED8]/70 hover:from-blue-500 hover:to-indigo-500 text-white rounded-xl shadow-md transition-all transform hover:-translate-y-0.5 cursor-pointer">
          <div className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            <span>Pay Bill</span>
          </div>
        </Button>
      </Link>
    </div>
  );
}