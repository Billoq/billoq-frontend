// "use client";

// import React, { createContext, useContext, useEffect, useState, useMemo } from 'react';
// import { useAccount } from 'wagmi';
// import { billoqService } from '../services/billoq.services';
// import { Transaction, ApiTransaction, BillType } from '@/types/transaction';
// import { useBillData } from '@/hooks/useBillData';

// interface TransactionContextType {
//   transactions: Transaction[];
//   loading: boolean;
//   error: string | null;
//   refetch: () => Promise<void>;
//   getTransactionById: (id: string) => Promise<Transaction | null>;
// }

// const TransactionContext = createContext<TransactionContextType | undefined>(undefined);

// export const TransactionProvider = ({ children }: { children: React.ReactNode }) => {
//   const { address } = useAccount();
//   const { allBillers, allBillItems, loading: billDataLoading } = useBillData();
//   const [transactions, setTransactions] = useState<Transaction[]>([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);

//   // Memoized mapping function that depends on bill data
//   const mapApiTransaction = useMemo(() => {
//     return (tx: ApiTransaction): Transaction => {
//       const billTypeMap: Record<string, BillType> = {
//         "AIRTIME": "Airtime",
//         "MOBILE": "Data",
//         "CABLE": "Cable TV",
//         "ELECTRICITY": "Electricity",
//         "OTHERS": "Others"
//       };

//       // Find matching biller and item
//       const biller = allBillers.find(b => b.biller_code === tx.biller_code);
//       const item = allBillItems.find(i =>
//         i.item_code === tx.item_code &&
//         i.biller_code === tx.biller_code
//       );

//       // Determine category from biller or fallback to transaction data
//       const categoryCode = biller?.category_code ||
//                          (tx.biller_code.startsWith("BIL") ?
//                           tx.biller_code.replace("BIL", "") :
//                           "OTHERS");

//       return {
//         id: tx._id,
//         billType: billTypeMap[categoryCode] || "Others",
//         status: tx.order_status,
//         provider: biller?.name || tx.biller_code,
//         description: item?.name || tx.item_code,
//         amountInNaira: tx.quote?.amount || tx.amountQuotedInNaira || 0,
//         amountInCrypto: tx.cryptoAmount || 0,
//         paymentMethod: tx.cryptocurrency as "USDT" | "USDC",
//         date: new Date(tx.createdAt).toLocaleDateString('en-GB'),
//         hash: tx.transaction_hash,
//         blockchain_transaction_id: tx.blockchain_transaction_id,
//         subscriberId: tx.customer_id,
//         explorerUrl: `https://sepolia.etherscan.io/tx/${tx.transaction_hash}`,
//         rawData: tx
//       };
//     };
//   }, [allBillers, allBillItems]);

//   const fetchTransactions = async () => {
//     if (!address) {
//       setTransactions([]);
//       return;
//     }

//     setLoading(true);
//     setError(null);

//     try {
//       // Wait for bill data to load if it's still loading
//       if (billDataLoading) {
//         await new Promise(resolve => {
//           const check = () => {
//             if (!billDataLoading) resolve(true);
//             else setTimeout(check, 100);
//           };
//           check();
//         });
//       }

//       const response = await billoqService.getUserTransactions(address);
//       if (response.status === 'success') {
//         const formattedTransactions = response.data.map(mapApiTransaction);
//         setTransactions(formattedTransactions);
//       } else {
//         throw new Error(response.message || 'Failed to fetch transactions');
//       }
//     } catch (err) {
//       setError(err instanceof Error ? err.message : 'Unknown error occurred');
//       console.error('Error fetching transactions:', err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const getTransactionById = async (id: string): Promise<Transaction | null> => {
//     try {
//       const response = await billoqService.getTransactionById(id);
//       if (response.status === 'success') {
//         return mapApiTransaction(response.data);
//       }
//       return null;
//     } catch (err) {
//       console.error('Error fetching transaction:', err);
//       return null;
//     }
//   };

//   // Initial fetch - runs when address or bill data changes
//   useEffect(() => {
//     if (address && !billDataLoading) {
//       fetchTransactions();
//     }
//   }, [address, billDataLoading]);

//   return (
//     <TransactionContext.Provider
//       value={{
//         transactions,
//         loading: loading || billDataLoading,
//         error,
//         refetch: fetchTransactions,
//         getTransactionById
//       }}
//     >
//       {children}
//     </TransactionContext.Provider>
//   );
// };

// export const useTransactions = () => {
//   const context = useContext(TransactionContext);
//   if (context === undefined) {
//     throw new Error('useTransactions must be used within a TransactionProvider');
//   }
//   return context;
// };

"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useMemo,
  useCallback,
} from "react";
import { useAccount } from "wagmi";
import { billoqService } from "../services/billoq.services";
import { Transaction, ApiTransaction, BillType } from "@/types/transaction";
import { useBillData } from "@/hooks/useBillData";

interface TransactionContextType {
  transactions: Transaction[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  getTransactionById: (id: string) => Promise<Transaction | null>;
}

const TransactionContext = createContext<TransactionContextType | undefined>(
  undefined
);

export const TransactionProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { address } = useAccount();
  const { allBillers, allBillItems, loading: billDataLoading } = useBillData();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Memoized mapping function that depends on bill data
  const mapApiTransaction = useMemo(() => {
    return (tx: ApiTransaction): Transaction => {
      const billTypeMap: Record<string, BillType> = {
        AIRTIME: "Airtime",
        MOBILE: "Data",
        CABLE: "Cable TV",
        ELECTRICITY: "Electricity",
        OTHERS: "Others",
      };

      // Find matching biller and item
      const biller = allBillers.find((b) => b.biller_code === tx.biller_code);
      const item = allBillItems.find(
        (i) => i.item_code === tx.item_code && i.biller_code === tx.biller_code
      );

      // Determine category from biller or fallback to transaction data
      const categoryCode =
        biller?.category_code ||
        (tx.biller_code.startsWith("BIL")
          ? tx.biller_code.replace("BIL", "")
          : "OTHERS");

      return {
        id: tx._id,
        billType: billTypeMap[categoryCode] || "Others",
        status: tx.order_status,
        provider: biller?.name || tx.biller_code,
        description: item?.name || tx.item_code,
        amountInNaira: tx.quote?.amount || tx.amountQuotedInNaira || 0,
        amountInCrypto: tx.cryptoAmount || 0,
        paymentMethod: tx.cryptocurrency as "USDT" | "USDC",
        date: new Date(tx.createdAt).toLocaleDateString("en-GB"),
        hash: tx.transaction_hash,
        blockchain_transaction_id: tx.blockchain_transaction_id,
        subscriberId: tx.customer_id,
        explorerUrl: `https://sepolia.etherscan.io/tx/${tx.transaction_hash}`,
        rawData: tx,
      };
    };
  }, [allBillers, allBillItems]);

  const fetchTransactions = useCallback(async () => {
    if (!address) {
      setTransactions([]);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Wait for bill data to load if it's still loading
      if (billDataLoading) {
        await new Promise((resolve) => {
          const check = () => {
            if (!billDataLoading) resolve(true);
            else setTimeout(check, 100);
          };
          check();
        });
      }

      const response = await billoqService.getUserTransactions(address);
      if (response.status === "success") {
        const formattedTransactions = response.data.map(mapApiTransaction);
        setTransactions(formattedTransactions);
      } else {
        throw new Error(response.message || "Failed to fetch transactions");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error occurred");
      console.error("Error fetching transactions:", err);
    } finally {
      setLoading(false);
    }
  }, [address, billDataLoading, mapApiTransaction]);

  const getTransactionById = useCallback(
    async (id: string): Promise<Transaction | null> => {
      try {
        const response = await billoqService.getTransactionById(id);
        if (response.status === "success") {
          return mapApiTransaction(response.data);
        }
        return null;
      } catch (err) {
        console.error("Error fetching transaction:", err);
        return null;
      }
    },
    [mapApiTransaction]
  );

  // Initial fetch - runs when address or bill data changes
  useEffect(() => {
    if (address && !billDataLoading) {
      fetchTransactions();
    }
  }, [address, billDataLoading, fetchTransactions]);

  return (
    <TransactionContext.Provider
      value={{
        transactions,
        loading: loading || billDataLoading,
        error,
        refetch: fetchTransactions,
        getTransactionById,
      }}
    >
      {children}
    </TransactionContext.Provider>
  );
};

export const useTransactions = () => {
  const context = useContext(TransactionContext);
  if (context === undefined) {
    throw new Error(
      "useTransactions must be used within a TransactionProvider"
    );
  }
  return context;
};
