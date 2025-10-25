"use client";

import { useEffect, useMemo, useState, useCallback } from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { useTransactions } from "@/context/transaction-context";
import { Transaction } from "@/types/transaction";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "react-toastify";
import { parse } from "date-fns";
import TransactionSuccessCard from "../TransactionSuccessCard";


type RecentTransactionDisplay = {
  id: string;
  date: string;
  description: string;
  amount: string;
  status: "completed" | "pending" | "failed";
  amountInNaira: number; // Added for sorting
  transactionId: string; // Added for modal functionality
  explorerUrl: string; // Added for modal functionality
};

interface RecentTransactionsProps {
  searchQuery?: string;
}

const mapToRecentDisplayFormat = (tx: Transaction): RecentTransactionDisplay => ({
  id: tx.id,
  date: tx.date, // Expected in DD/MM/YYYY format
  description: tx.description,
  amount: `₦${tx.amountInNaira.toFixed(2)}`, // Format as NGN
  status: tx.status, // completed, failed, or pending
  amountInNaira: tx.amountInNaira, // Keep raw amount for sorting
  transactionId: tx.hash,
  explorerUrl: tx.explorerUrl,
});

// Map RecentTransactionDisplay to TransactionSuccessCard format
const mapToSuccessCardFormat = (tx: RecentTransactionDisplay, originalTx: Transaction) => {
  console.log("🔍 Debug transaction mapping:", {
    txExplorerUrl: tx.explorerUrl,
    originalTxExplorerUrl: originalTx.explorerUrl,
    transactionHash: tx.transactionId,
    originalTxHash: originalTx.hash,
    notes: originalTx.notes,
    customerName: originalTx.customerName,
    customerId: originalTx.customerId,
    chainId: originalTx.chainId,
    backendChainId: originalTx.rawData?.chainId || originalTx.rawData?.chain_id // Check if backend actually provided chainId
  });

  // Only include chainId if it actually came from the backend
  const backendChainId = originalTx.rawData?.chainId || originalTx.rawData?.chain_id;
  
  console.log(`🔗 Transaction ${tx.transactionId} backend chainId:`, backendChainId || 'NOT PROVIDED');
  
  return {
    id: tx.transactionId, // Use the full transaction hash as ID
    billType: originalTx.billType || "Utility Bill",
    amountInNaira: originalTx.amountInNaira,
    amountInUSDT: originalTx.amountInCrypto || 0,
    paymentMethod: originalTx.paymentMethod || "USDC/USDT",
    date: tx.date,
    hash: tx.transactionId, // Use the full transaction hash
    gasFee: "2999Gwei",
    explorerUrl: originalTx.explorerUrl || tx.explorerUrl, // Use original transaction's explorerUrl first
    status: originalTx.status, // Pass the actual transaction status
    notes: originalTx.notes, // Map notes field for prepaid electricity tokens
    customerName: originalTx.customerName, // Map customer name
    customerId: originalTx.customerId, // Map customer ID
    // Only include chainId if backend provided it, otherwise omit completely
    ...(backendChainId && { chainId: String(backendChainId) })
  };
};
export function RecentTransactions({ searchQuery = "" }: RecentTransactionsProps) {
  const { transactions, loading, error, refetch } = useTransactions();

  // Modal state
  const [selectedTransaction, setSelectedTransaction] = useState<RecentTransactionDisplay | null>(null);
  const [showModal, setShowModal] = useState(false);

  // Determine if error is real (not "no transactions")
  const hasRealError = useMemo(() => {
    return !!(error && !error.toLowerCase().includes("no transactions"));
  }, [error]);

  // Debug logging
  useEffect(() => {
    console.log("RecentTransactions: loading =", loading, "error =", error, "transactions =", transactions.length);
    if (loading) {
      console.log("Loading state is active, showing skeletons");
    }
    if (hasRealError) {
      toast.error(`Failed to load transactions: ${error}`, {
        position: "bottom-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "dark",
      });
    }
    if (!loading && !error && transactions.length === 0) {
      console.log("No transactions found, should render empty state");
    }
  }, [loading, error, hasRealError, transactions.length]);

  // Filter and sort transactions
  const recentTransactions = transactions
    .map(mapToRecentDisplayFormat)
    .filter((tx) =>
      searchQuery
        ? tx.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          tx.date.toLowerCase().includes(searchQuery.toLowerCase()) ||
          tx.amount.toLowerCase().includes(searchQuery.toLowerCase()) ||
          tx.status.toLowerCase().includes(searchQuery.toLowerCase())
        : true
    )
    .sort((a, b) => {
      // Handle date parsing with date-fns
      const parseDate = (dateStr: string): Date => {
        try {
          // Normalize date format (e.g., "4/5/2025" -> "04/05/2025")
          const parts = dateStr.split("/");
          if (parts.length !== 3) throw new Error("Invalid date format");

          const day = parts[0].padStart(2, "0");
          const month = parts[1].padStart(2, "0");
          const year = parts[2];
          const normalizedDate = `${day}/${month}/${year}`;

          const date = parse(normalizedDate, "dd/MM/yyyy", new Date());
          if (isNaN(date.getTime())) {
            console.warn(`Invalid date parsed: ${dateStr} -> ${normalizedDate}`);
            return new Date(0); // Fallback to epoch
          }
          return date;
        } catch (error) {
          console.warn(`Failed to parse date: ${dateStr}`, error);
          return new Date(0); // Fallback to epoch
        }
      };

      const dateA = parseDate(a.date);
      const dateB = parseDate(b.date);

      // Primary sort: Newest date first
      const dateDiff = dateB.getTime() - dateA.getTime();
      if (dateDiff !== 0) return dateDiff;

      // Secondary sort: Higher amountInNaira first (e.g., 500 > 50)
      return b.amountInNaira - a.amountInNaira;
    })
    .slice(0, 9); // Limit to 9 transactions

  const handleRetry = () => {
    refetch();
    toast.info("Retrying to fetch transactions...", {
      position: "bottom-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      theme: "dark",
    });
  };

  // Handle transaction click
  const handleTransactionClick = useCallback((transaction: RecentTransactionDisplay) => {
    setSelectedTransaction(transaction);
    setShowModal(true);
  }, []);

  // Handle modal close
  const handleCloseModal = useCallback(() => {
    setShowModal(false);
    setSelectedTransaction(null);
  }, []);

  // Handle click outside modal to close
  const handleModalBackdropClick = useCallback(
    (e: React.MouseEvent) => {
      if (e.target === e.currentTarget) {
        handleCloseModal();
      }
    },
    [handleCloseModal],
  );

  // Get the original transaction for the success card
  const getOriginalTransaction = (transactionDisplay: RecentTransactionDisplay) => {
    return transactions.find((tx) => tx.hash === transactionDisplay.transactionId);
  };

  return (
    <>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-white">Recent Transactions</h2>
          <Link
            href="/dashboard/transactions"
            className="text-sm font-medium text-[#38C3D8] hover:text-[#38C3D8]/60 transition-colors flex items-center"
          >
            View All
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 ml-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </Link>
        </div>

        <Card className="border-0 bg-gradient-to-b from-[#152238B2]/80 to-[#111C2F]/80 rounded-xl backdrop-blur-sm shadow-lg shadow-blue-900/10">
          <CardContent className="p-0 rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-[#1A202880]">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-medium text-blue-200 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-blue-200 uppercase tracking-wider">
                      Description
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-medium text-blue-200 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-medium text-blue-200 uppercase tracking-wider">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800/50">
                  {loading ? (
                    // Loading state with skeletons
                    Array(5)
                      .fill(0)
                      .map((_, index) => (
                        <tr key={index} className="hover:bg-white/5 transition-colors">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <Skeleton className="h-4 w-20 bg-[#1E293B]" />
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <Skeleton className="h-4 w-32 bg-[#1E293B]" />
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right">
                            <Skeleton className="h-4 w-24 bg-[#1E293B] ml-auto" />
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right">
                            <Skeleton className="h-4 w-16 bg-[#1E293B] ml-auto" />
                          </td>
                        </tr>
                      ))
                  ) : hasRealError ? (
                    // Error state
                    <tr>
                      <td colSpan={4} className="py-8 text-center text-[#94A3B8]">
                        <div className="flex flex-col items-center justify-center gap-4">
                          <AlertCircle className="h-10 w-10 text-red-400" />
                          <p className="text-lg font-medium text-white">Failed to load transactions</p>
                          <p className="text-sm text-[#94A3B8]">{error}</p>
                          <Button
                            className="bg-[#1D4ED8] hover:bg-blue-600 text-white transition-all duration-200 transform hover:scale-105 shadow-lg shadow-blue-900/20 font-medium"
                            onClick={handleRetry}
                          >
                            Retry
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ) : recentTransactions.length > 0 ? (
                    // Transaction rows - now clickable!
                    recentTransactions.map((transaction, index) => (
                      <tr 
                        key={index} 
                        className="hover:bg-white/5 transition-colors cursor-pointer hover:bg-[#1E293B]/50 duration-200"
                        onClick={() => handleTransactionClick(transaction)}
                        title="Click to view transaction details"
                      >
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-300">
                          {transaction.date}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                          {transaction.description}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-right text-white">
                          {transaction.amount}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right">
                          <span
                            className={`px-2 py-1 text-xs rounded-full ${
                              transaction.status === "completed"
                                ? "bg-green-900/30 text-green-400"
                                : transaction.status === "pending"
                                ? "bg-yellow-900/30 text-yellow-400"
                                : "bg-red-900/30 text-red-400"
                            }`}
                          >
                            {transaction.status}
                          </span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    // No transactions or no search results
                    <tr>
                      <td colSpan={4} className="py-8 text-center text-[#94A3B8]">
                        <div className="flex flex-col items-center justify-center gap-2">
                          <p className="text-lg font-medium">
                            {searchQuery ? "No matching transactions found" : "No transactions found"}
                          </p>
                          <p className="text-sm">
                            {searchQuery
                              ? "Try a different search term"
                              : "Your recent transactions will appear here"}
                          </p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Transaction Details Modal */}
      {showModal && selectedTransaction && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={handleModalBackdropClick}
        >
          <div className="relative max-w-sm w-full">
            <TransactionSuccessCard
              transaction={mapToSuccessCardFormat(
                selectedTransaction,
                getOriginalTransaction(selectedTransaction) || ({} as Transaction),
              )}
              onDownload={async () => {
                try {
                  console.log("Download receipt for transaction:", selectedTransaction.id);

                  const element = document.getElementById("transaction-receipt");
                  if (!element) {
                    toast.error("Receipt element not found", {
                      position: "bottom-right",
                      autoClose: 2000,
                      theme: "dark",
                    });
                    return;
                  }

                  const html2canvas = (await import("html2canvas")).default;

                  const canvas = await html2canvas(element, {
                    background: "#0f172a", // Use background instead of backgroundColor
                    width: element.offsetWidth * 2,
                    height: element.offsetHeight * 2,
                    logging: false,
                    useCORS: true,
                    allowTaint: true,
                  });

                  const link = document.createElement("a");
                  link.download = `transaction-receipt-${selectedTransaction.id}.png`;
                  link.href = canvas.toDataURL();
                  link.click();

                  toast.success("Receipt download started!", {
                    position: "bottom-right",
                    autoClose: 2000,
                    theme: "dark",
                  });
                } catch (error) {
                  console.error("Failed to download receipt:", error);
                  toast.error("Failed to download receipt", {
                    position: "bottom-right",
                    autoClose: 2000,
                    theme: "dark",
                  });
                }
              }}
              onReturn={handleCloseModal}
            />
          </div>
        </div>
      )}
    </>
  );
}