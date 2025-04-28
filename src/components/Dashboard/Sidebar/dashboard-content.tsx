import { BalanceCard } from "@/components/balance-card"
import { StableAssets } from "@/components/stable-assets"
import { RecentTransactions } from "@/components/recent-transactions"
import { OverviewChart } from "@/components/overview-chart"
import { GiftCard } from "@/components/gift-card"

export function DashboardContent() {
  return (
    <div className="p-4 md:p-6 space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <BalanceCard />
        <StableAssets />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RecentTransactions />
        <div className="space-y-6">
          <OverviewChart />
          <GiftCard />
        </div>
      </div>
    </div>
  )
}
