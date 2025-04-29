import { Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Image from "next/image"

const assets = [
  {
    name: "USDC",
    symbol: "USDC",
    value: "$2,000.00",
    localValue: "₦3,150,000.00",
    icon: "/usdcIcon.png?height=32&width=32",
  },
  {
    name: "Tether",
    symbol: "USDT",
    value: "$3,500.00",
    localValue: "₦5,140,030.00",
    icon: "/usdtIcon.png?height=32&width=32",
  },
]

export function StableAssets() {
  return (
    <Card className="border-slate-800 text-[#D9D9D9] bg-[#252E3A80]/50">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-[20px] font-semibold">Your Stable Assets</CardTitle>
        <div className="text-right text-[16px] font-normal text-[#60A5FA]">Value</div>
      </CardHeader>
      <CardContent className="space-y-4">
        {assets.map((asset) => (
          <div key={asset.symbol} className="flex items-center   pb-5 border-b border-[#396294] justify-between">
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
                  <span className="font-medium text-lg ">{asset.symbol}</span>
                  <Button variant="ghost" size="icon" className="h-4 w-4 text-slate-400">
                    <Eye className="h-3 w-3" />
                  </Button>
                </div>
                <p className="text-sm font-normal text-slate-400">{asset.name}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="font-medium text-[16px]">{asset.value}</p>
              <p className="text-xs text-slate-400 text-[13px]">{asset.localValue}</p>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
