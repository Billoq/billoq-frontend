"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useActiveAccount } from "thirdweb/react";
import { DashboardContent } from "@/components/Dashboard/dashboard-content";
import { DashboardHeader } from "@/components/Dashboard/dashboard-header";
import { BalanceProvider } from "@/context/balance-context";
import { toast } from "react-toastify";

export default function Dashboard() {
  const router = useRouter();
  const account = useActiveAccount();
  const isConnected = Boolean(account?.address);
  const [searchQuery, setSearchQuery] = useState<string>("");

  useEffect(() => {
    if (!isConnected) {
      toast.warn("Please connect your wallet to access the dashboard", {
        position: "bottom-right",
        autoClose: 3000,
      });
      router.push("/");
    }
  }, [isConnected, router]);

  const handleSearch = (query: string) => {
    setSearchQuery(query.trim().toLowerCase());
  };

  return (
    <div className="flex-1 bg-[#11171F]">
      <DashboardHeader onSearch={handleSearch} />
      <BalanceProvider>
        <DashboardContent searchQuery={searchQuery} />
      </BalanceProvider>
    </div>
  );
}