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
import { Transaction, ApiTransaction as OriginalApiTransaction, BillType } from "@/types/transaction";

// Extend ApiTransaction to include optional chainId and explorerUrl for type safety
type ApiTransaction = OriginalApiTransaction & {
  chainId?: number;
  explorerUrl?: string;
  network?: string;
};
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

// Function to detect explorer URL based on available transaction data
const getExplorerUrlFromTransaction = (tx: ApiTransaction): string => {
  const hash = tx.transaction_hash;
  
  // If your backend provides chain information, use it
  if (tx.chainId) {
    const chainExplorers: Record<number, string> = {
      // Testnets
      11155111: "https://sepolia.etherscan.io/tx/", // Sepolia
      97: "https://testnet.bscscan.com/tx/", // BSC Testnet
      421614: "https://sepolia.arbiscan.io/tx/", // Arbitrum Sepolia
      4202: "https://sepolia-blockscout.lisk.com/tx/", // Lisk Sepolia
      
      // Mainnets
      1: "https://etherscan.io/tx/", // Ethereum
      56: "https://bscscan.com/tx/", // BSC
      42161: "https://arbiscan.io/tx/", // Arbitrum
      1135: "https://blockscout.lisk.com/tx/", // Lisk Mainnet
    };
    
    const baseUrl = chainExplorers[tx.chainId];
    if (baseUrl) {
      return `${baseUrl}${hash}`;
    }
  }
  
  // If your backend provides explorer URL directly
  if (tx.explorerUrl) {
    return tx.explorerUrl;
  }
  
  // Temporary fallback: Try to detect from transaction hash patterns or other data
  // This is not reliable but can work as a temporary solution
  
  // If you have information about which network was used, add logic here
  // For example, if certain billers only work on certain chains
  
  // Check if there's any network indicator in the raw transaction data
  if (tx.network) {
    const networkExplorers: Record<string, string> = {
      'lisk-sepolia': `https://sepolia-blockscout.lisk.com/tx/${hash}`,
      'arbitrum-sepolia': `https://sepolia.arbiscan.io/tx/${hash}`,
      'bsc-testnet': `https://testnet.bscscan.com/tx/${hash}`,
      'ethereum-sepolia': `https://sepolia.etherscan.io/tx/${hash}`,
    };
    
    if (networkExplorers[tx.network]) {
      return networkExplorers[tx.network];
    }
  }
  
  // Final fallback to Sepolia Etherscan (but log a warning)
  console.warn(`No chain info found for transaction ${hash}, using Sepolia Etherscan as fallback`);
  return `https://sepolia.etherscan.io/tx/${hash}`;
};

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
        explorerUrl: getExplorerUrlFromTransaction(tx), // ✅ DYNAMIC EXPLORER URL
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