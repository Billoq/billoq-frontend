// components/Dashboard/balance-card.tsx
"use client";

import { Eye, EyeOff, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useBalance } from "@/context/balance-context";

export function BalanceCard() {
  const { totalBalanceNGN, usdcBalance, usdtBalance, hideBalances, toggleBalanceVisibility, currentChain } = useBalance();

  const totalUSDBalance = usdcBalance && usdtBalance
    ? (parseFloat(usdcBalance) + parseFloat(usdtBalance)).toFixed(2)
    : "0.00";

  const isUnsupportedChain = currentChain !== "Sepolia" && currentChain !== "Lisk Sepolia";

  return (
    <div className="flex flex-col gap-4 mr-3">
      <Card className="relative overflow-hidden bg-[url('/dasboard-balanceCard.png')] h-[200px] bg-cover bg-center border-0">
        <div className="absolute inset-0 bg-black/30 backdrop-blur-lg"></div>
        <CardHeader className="pb-2 z-10">
          <CardTitle className="flex items-center text-2xl font-semibold text-white/90">
            Total Balance
            <Button
              variant="ghost"
              size="icon"
              className="ml-2 h-6 w-6 text-white/80"
              onClick={toggleBalanceVisibility}
            >
              {hideBalances ? <EyeOff className="h-6 w-8" /> : <Eye className="h-6 w-8" />}
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="z-10">
          <div className="space-y-3">
            {isUnsupportedChain ? (
              <p className="text-xl font-medium text-white/80">Unsupported network</p>
            ) : hideBalances || !usdcBalance || !usdtBalance ? (
              <>
                <h2 className="text-3xl font-bold text-white">USD: ****</h2>
                <p className="text-xl font-medium text-white/80">₦ ****</p>
              </>
            ) : (
              <>
                <h2 className="text-3xl font-bold text-white">USD: {totalUSDBalance}</h2>
                <p className="text-xl font-medium text-white/80">
                  ₦ {totalBalanceNGN?.toLocaleString() || "0"}
                </p>
              </>
            )}
          </div>
        </CardContent>
      </Card>

      <Button className="w-full h-[56px] bg-[#1D4ED8] hover:bg-blue-600 text-white">
        <Plus className="mr-2 h-4 w-4" />
        Pay Bill
      </Button>
    </div>
  );
}