import { BalanceCard } from "./balance-card";
import { GiftCard } from "./gift-card";
import { OverviewChart } from "./overview-chart/overview-chart";
import { RecentTransactions } from "./recent-Transaction";
import { StableAssets } from "./stable-assets";

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
          <OverviewChart/>
          <GiftCard/>
        </div>
      </div>
    </div>
  )
}
