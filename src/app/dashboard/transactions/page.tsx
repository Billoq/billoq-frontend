"use client";
import { DashboardHeader } from "@/components/Dashboard/dashboard-header";
import DashboardTransactions from "@/components/Dashboard/Transactions/DashboardTransactions";
import React from "react";

const Page = () => {
  return (
    <div className="flex flex-col h-screen  overflow-hidden">
      <DashboardHeader />
      <div className="flex-1 overflow-hidden">
        <DashboardTransactions />
      </div>
    </div>
  );
};

export default Page;