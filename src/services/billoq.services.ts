const API_BASE_URL = 'https://billoq-backend.onrender.com/api/v1';

interface GetQuoteParams {
  amount: number;
  item_code: string;
  customer: string;
}

interface InitiatePaymentParams {
  quoteId: string;
  transaction_hash: string;
  transactionid: string;
  userAddress: string;
  cryptocurrency: string;
  cryptoAmount: string;
  chainId?: string; // Add optional chainId parameter
}

export const billoqService = {
  // Biller Categories
  async getAllCategories() {
    const response = await fetch(`${API_BASE_URL}/categories`);
    const data = await response.json();
    console.log('📋 Categories Response:', data);
    return data;
  },

  async getBillersByCategory(category_code: string) {
    const response = await fetch(`${API_BASE_URL}/categories/${category_code}`);
    const data = await response.json();
    console.log(`🏢 Billers for ${category_code}:`, data);
    return data;
  },

  async getBillItems(category_name: string, biller_name: string) {
    const response = await fetch(
      `${API_BASE_URL}/categories/${category_name}/${biller_name}`
    );
    const data = await response.json();
    console.log(`💡 Bill items for ${category_name}/${biller_name}:`, data);
    return data;
  },

  // Bill Payment
  async validateCustomerDetails(item_code: string, customer: string) {
    const response = await fetch(
      `${API_BASE_URL}/bill-items/${item_code}/${customer}`
    );
    const data = await response.json();
    console.log(`✅ Customer validation for ${item_code}/${customer}:`, data);
    return data;
  },

  async getQuote(params: GetQuoteParams) {
    console.log('💰 Getting quote with params:', params);
    const response = await fetch(`${API_BASE_URL}/bill-items/getQuote`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(params),
    });
    const data = await response.json();
    console.log('💰 Quote Response:', data);
    return data;
  },

  async initiatePayment(params: InitiatePaymentParams) {
    console.log('🚀 Initiating payment with params:', params);
    console.log('🔍 Chain ID in params:', params.chainId || 'NOT PROVIDED');
    
    const response = await fetch(`${API_BASE_URL}/bill-items/initiatePayment`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(params),
    });
    
    const data = await response.json();
    console.log('🚀 Payment Initiation Response:', data);
    
    // Check for chain ID in response
    if (data.chainId) {
      console.log('⛓️ Chain ID found in response:', data.chainId);
    } else if (data.transaction?.chainId) {
      console.log('⛓️ Chain ID found in transaction object:', data.transaction.chainId);
    } else if (data.data?.chainId) {
      console.log('⛓️ Chain ID found in data object:', data.data.chainId);
    } else {
      console.log('⚠️ Chain ID not found in payment response');
      console.log('📋 Available response keys:', Object.keys(data));
    }
    
    return data;
  },

  async getUserTransactions(userAddress: string) {
    console.log(`📄 Getting transactions for address: ${userAddress}`);
    
    const response = await fetch(`${API_BASE_URL}/transactions/${userAddress}`);
    const data = await response.json();
    
    console.log('📄 User Transactions Response:', data);
    
    // Check for chain ID in transactions
    if (Array.isArray(data)) {
      console.log(`📊 Found ${data.length} transactions`);
      data.forEach((tx, index) => {
        if (tx.chainId) {
          console.log(`⛓️ Transaction ${index + 1} - Chain ID: ${tx.chainId}`);
        } else {
          console.log(`❌ Transaction ${index + 1} - No Chain ID found`);
          console.log(`📋 Transaction ${index + 1} keys:`, Object.keys(tx));
        }
      });
    } else if (data.transactions && Array.isArray(data.transactions)) {
      console.log(`📊 Found ${data.transactions.length} transactions in data.transactions`);
      data.transactions.forEach((tx: any, index: number) => {
        if (tx.chainId) {
          console.log(`⛓️ Transaction ${index + 1} - Chain ID: ${tx.chainId}`);
        } else {
          console.log(`❌ Transaction ${index + 1} - No Chain ID found`);
          console.log(`📋 Transaction ${index + 1} keys:`, Object.keys(tx));
        }
      });
    } else if (data.data && Array.isArray(data.data)) {
      console.log(`📊 Found ${data.data.length} transactions in data.data`);
      data.data.forEach((tx: any, index: number) => {
        if (tx.chainId) {
          console.log(`⛓️ Transaction ${index + 1} - Chain ID: ${tx.chainId}`);
        } else {
          console.log(`❌ Transaction ${index + 1} - No Chain ID found`);
          console.log(`📋 Transaction ${index + 1} keys:`, Object.keys(tx));
        }
      });
    } else {
      console.log('⚠️ Unexpected transaction response format');
      console.log('📋 Response structure:', Object.keys(data));
    }
    
    return data;
  },

  async getTransactionById(transactionId: string) {
    console.log(`🔍 Getting transaction by ID: ${transactionId}`);
    
    const response = await fetch(`${API_BASE_URL}/transaction/${transactionId}`);
    const data = await response.json();
    
    console.log('🔍 Single Transaction Response:', data);
    
    // Check for chain ID in single transaction
    if (data.chainId) {
      console.log('⛓️ Chain ID found in response:', data.chainId);
    } else if (data.transaction?.chainId) {
      console.log('⛓️ Chain ID found in transaction object:', data.transaction.chainId);
    } else if (data.data?.chainId) {
      console.log('⛓️ Chain ID found in data object:', data.data.chainId);
    } else {
      console.log('⚠️ Chain ID not found in transaction response');
      console.log('📋 Available response keys:', Object.keys(data));
    }
    
    return data;
  }
};