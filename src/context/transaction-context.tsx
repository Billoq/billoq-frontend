"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';
import { useAccount } from 'wagmi';
import { billoqService } from '../services/billoq.services';
import { Transaction, ApiTransaction, BillType } from '@/types/transaction';
import { useBilloq } from '@/hooks/useBilloq';

interface TransactionContextType {
  transactions: Transaction[];
  loading: boolean;
  error: string | null;
  refreshTransactions: () => Promise<void>;
  getTransactionById: (id: string) => Promise<Transaction | null>;
}

const TransactionContext = createContext<TransactionContextType | undefined>(undefined);

export const TransactionProvider = ({ children }: { children: React.ReactNode }) => {
  const { address } = useAccount();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { getBillItems } = useBilloq();

  // Map API transaction to our frontend format
  const mapApiTransaction = (tx: ApiTransaction): Transaction => {
    // You'll need to implement this mapping based on your biller/item codes
    // This is a simplified version - adjust according to your actual data
    const billTypeMap: Record<string, BillType> = {
      "BIL100": "Airtime",
      "BIL200": "Data",
      // Add other mappings as needed
    };

    return {
      id: tx._id,
      billType: billTypeMap[tx.biller_code] || "Others",
      status: tx.order_status,
      provider: "Unknown Provider", // You'll need to map this from biller_code
      description: "Unknown Item",  // You'll need to map this from item_code
      amountInNaira: tx.amountQuotedInNaira,
      amountInCrypto: tx.cryptoAmount,
      paymentMethod: tx.cryptocurrency as "USDT" | "USDC",
      date: new Date(tx.createdAt).toLocaleDateString('en-GB'),
      hash: tx.transaction_hash,
      blockchain_transaction_id: tx.blockchain_transaction_id,
      subscriberId: tx.customer_id,
      explorerUrl: `https://sepolia.etherscan.io/tx/${tx.transaction_hash}`,
      rawData: tx
    };
  };

  const fetchTransactions = async () => {
    if (!address) {
      setTransactions([]);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await billoqService.getUserTransactions(address);
      if (response.status === 'success') {
        const formattedTransactions = response.data.map(mapApiTransaction);
        setTransactions(formattedTransactions);
      } else {
        throw new Error(response.message || 'Failed to fetch transactions');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
      console.error('Error fetching transactions:', err);
    } finally {
      setLoading(false);
    }
  };

  const getTransactionById = async (id: string): Promise<Transaction | null> => {
    try {
      const response = await billoqService.getTransactionById(id);
      if (response.status === 'success') {
        return mapApiTransaction(response.data);
      }
      return null;
    } catch (err) {
      console.error('Error fetching transaction:', err);
      return null;
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchTransactions();
  }, [address]);

  return (
    <TransactionContext.Provider
      value={{
        transactions,
        loading,
        error,
        refreshTransactions: fetchTransactions,
        getTransactionById
      }}
    >
      {children}
    </TransactionContext.Provider>
  );
};

export const useTransactions = () => {
  const context = useContext(TransactionContext);
  if (context === undefined) {
    throw new Error('useTransactions must be used within a TransactionProvider');
  }
  return context;
};