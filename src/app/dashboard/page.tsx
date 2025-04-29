// app/dashboard/page.tsx
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppKitAccount } from "@reown/appkit/react";
import { useAccount } from "wagmi";
import { DashboardContent } from "@/components/Dashboard/dashboard-content";
import { DashboardHeader } from "@/components/Dashboard/dashboard-header";
import { BalanceProvider } from "@/context/balance-context"; // Updated import

export default function Dashboard() {
  const router = useRouter();
  const { isConnected: appkitIsConnected } = useAppKitAccount();
  const { isConnected: wagmiIsConnected } = useAccount();
  const isConnected = appkitIsConnected || wagmiIsConnected;

  useEffect(() => {
    if (!isConnected) {
      router.push("/");
    }
  }, [isConnected, router]);

  return (
    <div className="flex-1 bg-[#0f172a]">
      <DashboardHeader />
      <BalanceProvider>
        <DashboardContent />
      </BalanceProvider>
    </div>
  );
}