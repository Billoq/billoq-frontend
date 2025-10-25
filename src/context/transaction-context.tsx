"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useMemo,
  useCallback,
} from "react";
import { useAccount, useChainId } from "wagmi"; 
import { billoqService } from "../services/billoq.services";
import { Transaction, ApiTransaction as OriginalApiTransaction, BillType } from "@/types/transaction";
import { useBillData } from "@/hooks/useBillData";



type ApiTransaction = OriginalApiTransaction & {
  chainId?: number;
  chain_id?: number; // Alternative naming convention
  explorerUrl?: string;
  network?: string;
};

interface TransactionContextType {
  transactions: Transaction[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  getTransactionById: (id: string) => Promise<Transaction | null>;
  currentChainId: number; 
  getChainName: (chainId?: number) => string; // 🎯 Helper function
  isMainnet: boolean; // 🎯 Environment info
}

const TransactionContext = createContext<TransactionContextType | undefined>(
  undefined
);


const getChainNameFromId = (chainId: number): string => {
  const chainNames: Record<number, string> = {
    // Testnets
    11155111: "Ethereum Sepolia",
    97: "BSC Testnet", 
    421614: "Arbitrum Sepolia",
    4202: "Lisk Sepolia",
    84532: "Base Sepolia",
    
    // Mainnets
    1: "Ethereum",
    56: "BNB Smart Chain",
    42161: "Arbitrum One", 
    1135: "Lisk",
    8453: "Base",
  };
  
  return chainNames[chainId] || `Chain ${chainId}`;
};

// Function to detect explorer URL based on available transaction data
const getExplorerUrlFromTransaction = (tx: ApiTransaction, currentChainId?: number): string => {
  const hash = tx.transaction_hash;
  

  const backendChainId = tx.chainId || tx.chain_id;
  

  const chainId = backendChainId || currentChainId;
  
  if (chainId) {
    if (backendChainId) {
      console.log(`✅ Using backend chainId ${backendChainId} for transaction ${hash}`);
    } else {
      console.log(`🔄 Using current chainId ${currentChainId} for transaction ${hash}`);
    }
    
    const chainExplorers: Record<number, string> = {
      // Testnets
      11155111: "https://sepolia.etherscan.io/tx/", // Sepolia
      97: "https://testnet.bscscan.com/tx/", // BSC Testnet
      421614: "https://sepolia.arbiscan.io/tx/", // Arbitrum Sepolia
      4202: "https://sepolia-blockscout.lisk.com/tx/", // Lisk Sepolia
      84532: "https://sepolia.basescan.org/tx/", // Base Sepolia
      
      // Mainnets
      1: "https://etherscan.io/tx/", // Ethereum
      56: "https://bscscan.com/tx/", // BSC
      42161: "https://arbiscan.io/tx/", // Arbitrum
      1135: "https://blockscout.lisk.com/tx/", // Lisk Mainnet
      8453: "https://basescan.org/tx/", // Base Mainnet
    };
    
    const baseUrl = chainExplorers[chainId];
    if (baseUrl) {
      return `${baseUrl}${hash}`;
    } else {
      console.warn(`⚠️ Unknown chainId: ${chainId}, using fallback`);
    }
  } else {
    console.warn(`⚠️ No chainId available for transaction ${hash}`);
  }
  
  // If backend provides explorer URL directly
  if (tx.explorerUrl) {
    console.log(`📋 Using explorerUrl from backend: ${tx.explorerUrl}`);
    return tx.explorerUrl;
  }
  
  // Check if there's any network indicator in the raw transaction data
  if (tx.network) {
    console.log(`🌐 Using network indicator: ${tx.network}`);
    const networkExplorers: Record<string, string> = {
      'lisk-sepolia': `https://sepolia-blockscout.lisk.com/tx/${hash}`,
      'arbitrum-sepolia': `https://sepolia.arbiscan.io/tx/${hash}`,
      'bsc-testnet': `https://testnet.bscscan.com/tx/${hash}`,
      'ethereum-sepolia': `https://sepolia.etherscan.io/tx/${hash}`,
      'base-sepolia': `https://sepolia.basescan.org/tx/${hash}`,
      'lisk-mainnet': `https://blockscout.lisk.com/tx/${hash}`,
      'arbitrum-mainnet': `https://arbiscan.io/tx/${hash}`,
      'bsc-mainnet': `https://bscscan.com/tx/${hash}`,
      'base-mainnet': `https://basescan.org/tx/${hash}`,
      'ethereum-mainnet': `https://etherscan.io/tx/${hash}`,
    };
    
    if (networkExplorers[tx.network]) {
      return networkExplorers[tx.network];
    }
  }
  
  // Final fallback based on environment
  const isMainnet = process.env.NEXT_PUBLIC_ENVIRONMENT === 'mainnet';
  const fallbackUrl = isMainnet 
    ? `https://etherscan.io/tx/${hash}` // Mainnet fallback
    : `https://sepolia.etherscan.io/tx/${hash}`; // Testnet fallback
    
  console.warn(`❌ Using fallback explorer for transaction ${hash}: ${fallbackUrl}`);
  return fallbackUrl;
};

export const TransactionProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { address } = useAccount();
  const currentChainId = useChainId(); // 🎯 Get current chain ID
  const { allBillers, allBillItems, loading: billDataLoading } = useBillData();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Environment detection
  const isMainnet = process.env.NEXT_PUBLIC_ENVIRONMENT === 'mainnet';

  // Helper function to get chain name
  const getChainName = useCallback((chainId?: number) => {
    return getChainNameFromId(chainId || currentChainId);
  }, [currentChainId]);

  // Memoized mapping function that depends on bill data and current chain
  const mapApiTransaction = useMemo(() => {
    return (tx: ApiTransaction): Transaction => {
      const billTypeMap: Record<string, BillType> = {
        AIRTIME: "Airtime",
        MOBILEDATA: "Data", 
        MOBILE: "Data",
        CABLEBILLS: "Cable TV",
        CABLE: "Cable TV",
        UTILITYBILLS: "Electricity",
        ELECTRICITY: "Electricity",
        OTHERS: "Others",
      };

      // Find matching biller and item
      const biller = allBillers.find((b) => b.biller_code === tx.biller_code);
      const item = allBillItems.find(
        (i) => i.item_code === tx.item_code && i.biller_code === tx.biller_code
      );

      // Determine category from biller or fallback to transaction data
      let categoryCode = biller?.category_code;
      
      // If no biller data available, try to infer from quote data
      if (!categoryCode && tx.quote) {
        const billType = tx.quote.billType?.toLowerCase();
        const provider = tx.quote.provider?.toLowerCase();
        const description = tx.quote.description?.toLowerCase();
        
        if (billType?.includes('electricity') || billType?.includes('utility') || 
            provider?.includes('disco') || provider?.includes('electric') ||
            description?.includes('prepaid') || description?.includes('postpaid')) {
          categoryCode = "UTILITYBILLS";
        } else if (billType?.includes('cable') || provider?.includes('cable') || provider?.includes('tv')) {
          categoryCode = "CABLEBILLS";
        } else if (billType?.includes('data') || description?.includes('data')) {
          categoryCode = "MOBILEDATA";
        } else if (billType?.includes('airtime') || description?.includes('airtime')) {
          categoryCode = "AIRTIME";
        }
      }
      
      // Final fallback to extracting from biller code
      if (!categoryCode) {
        categoryCode = tx.biller_code.startsWith("BIL")
          ? tx.biller_code.replace("BIL", "")
          : "OTHERS";
      }

      // Extract chainId from transaction (backend chainId takes priority)
      const transactionChainId = tx.chainId || tx.chain_id;
      
      // Log chainId for debugging
      if (transactionChainId) {
        console.log(`🔗 Transaction ${tx._id} has backend chainId: ${transactionChainId} (${getChainNameFromId(transactionChainId)})`);
      } else {
        console.log(`❌ Transaction ${tx._id} missing chainId, using current: ${currentChainId} (${getChainNameFromId(currentChainId)})`);
      }

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
        explorerUrl: getExplorerUrlFromTransaction(tx, currentChainId), // 🎯 Pass current chain ID
        chainId: transactionChainId || currentChainId, // 🎯 Use backend chainId or fallback to current
        notes: tx.notes,
        customerName: tx.quote?.customerName || undefined,
        customerId: tx.quote?.customerId || undefined,
        rawData: tx,
      };
    };
  }, [allBillers, allBillItems, currentChainId]);

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

      console.log(`🔄 Fetching transactions for address: ${address} on ${getChainName()}`);
      const response = await billoqService.getUserTransactions(address);
      
      if (response.status === "success") {
        console.log(`📊 Processing ${response.data.length} transactions`);
        
        // Debug: Check if any transactions have chainId
        const transactionsWithChainId = response.data.filter((tx: ApiTransaction) => tx.chainId || tx.chain_id);
        console.log(`⛓️ Found ${transactionsWithChainId.length} transactions with backend chainId`);
        
        // Group transactions by chainId for better debugging
        const transactionsByChain = response.data.reduce((acc: Record<string, number>, tx: ApiTransaction) => {
          const chainId = tx.chainId || tx.chain_id || currentChainId;
          const chainName = getChainNameFromId(chainId);
          acc[chainName] = (acc[chainName] || 0) + 1;
          return acc;
        }, {});
        
        console.log(`📈 Transactions by chain:`, transactionsByChain);
        
        const formattedTransactions = response.data.map(mapApiTransaction);
        setTransactions(formattedTransactions);
        
        console.log(`✅ Successfully processed ${formattedTransactions.length} transactions`);
      } else {
        throw new Error(response.message || "Failed to fetch transactions");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error occurred");
      console.error("Error fetching transactions:", err);
    } finally {
      setLoading(false);
    }
  }, [address, billDataLoading, mapApiTransaction, currentChainId, getChainName]);

  const getTransactionById = useCallback(
    async (id: string): Promise<Transaction | null> => {
      try {
        console.log(`🔍 Fetching transaction by ID: ${id}`);
        const response = await billoqService.getTransactionById(id);
        
        if (response.status === "success") {
          console.log(`✅ Found transaction: ${id}`);
          
          // Check if this transaction has chainId
          const chainId = response.data.chainId || response.data.chain_id;
          if (chainId) {
            console.log(`⛓️ Transaction ${id} has backend chainId: ${chainId} (${getChainNameFromId(chainId)})`);
          } else {
            console.log(`❌ Transaction ${id} missing chainId, using current: ${currentChainId} (${getChainName()})`);
          }
          
          return mapApiTransaction(response.data);
        }
        return null;
      } catch (err) {
        console.error("Error fetching transaction:", err);
        return null;
      }
    },
    [mapApiTransaction, currentChainId, getChainName]
  );

  // Initial fetch - runs when address, chain, or bill data changes
  useEffect(() => {
    if (address && !billDataLoading) {
      console.log(`🔄 Chain changed to ${getChainName()}, refetching transactions...`);
      fetchTransactions();
    }
  }, [address, currentChainId, billDataLoading, fetchTransactions, getChainName]);

  return (
    <TransactionContext.Provider
      value={{
        transactions,
        loading: loading || billDataLoading,
        error,
        refetch: fetchTransactions,
        getTransactionById,
        currentChainId, // 🎯 Expose current chain ID
        getChainName, // 🎯 Expose chain name helper
        isMainnet, // 🎯 Expose environment info
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