import { useState } from 'react';
import { billoqService } from '../services/billoq.services';

export function useBilloq() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleApiCall = async <T,>(apiCall: () => Promise<T>) => {
    setLoading(true);
    setError(null);
    try {
      const result = await apiCall();
      return result;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    getAllCategories: () => handleApiCall(billoqService.getAllCategories),
    getBillersByCategory: (category_code: string) =>
      handleApiCall(() => billoqService.getBillersByCategory(category_code)),
    getBillItems: (category_name: string, biller_name: string) =>
      handleApiCall(() => billoqService.getBillItems(category_name, biller_name)),
    validateCustomerDetails: (item_code: string, customer: string) =>
      handleApiCall(() =>
        billoqService.validateCustomerDetails(item_code, customer)
      ),
    getQuote: (params: {
      amount: number;
      item_code: string;
      customer: string;
    }) => handleApiCall(() => billoqService.getQuote(params)),
    initiatePayment: (params: {
      quoteId: string;
      transaction_hash: string;
      transactionid: string;
      userAddress: string;
      cryptocurrency: string;
      cryptoAmount: string;
      chainId?: string;
    }) => handleApiCall(() => billoqService.initiatePayment(params)),
    getUserTransactions: (userAddress: string) => 
        handleApiCall(() => billoqService.getUserTransactions(userAddress)),
    getTransactionById: (transactionId: string) =>
    handleApiCall(() => billoqService.getTransactionById(transactionId)),
  };
}