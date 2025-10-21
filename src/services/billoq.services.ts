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
}

export const billoqService = {
  // Biller Categories done
  async getAllCategories() {
    const response = await fetch(`${API_BASE_URL}/categories`);
    return await response.json();
  },

  async getBillersByCategory(category_code: string) {
    const response = await fetch(`${API_BASE_URL}/categories/${category_code}`);
    return await response.json();
  },

  async getBillItems(category_name: string, biller_name: string) {
    const response = await fetch(
      `${API_BASE_URL}/categories/${category_name}/${biller_name}`
    );
    return await response.json();
  },

  // Bill Payment
  async validateCustomerDetails(item_code: string, customer: string) {
    const response = await fetch(
      `${API_BASE_URL}/bill-items/${item_code}/${customer}`
    );
    return await response.json();
  },

  async getQuote(params: GetQuoteParams) {
    const response = await fetch(`${API_BASE_URL}/bill-items/getQuote`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(params),
    });
    return await response.json();
  },

  async initiatePayment(params: InitiatePaymentParams) {
    const response = await fetch(`${API_BASE_URL}/bill-items/initiatePayment`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(params),
    });
    return await response.json();
  },

  async getUserTransactions(userAddress: string) {
    const response = await fetch(`${API_BASE_URL}/transactions/${userAddress}`);
    return await response.json();
  },

  async getTransactionById(transactionId: string) {
    const response = await fetch(`${API_BASE_URL}/transaction/${transactionId}`);
    return await response.json();
  },

  // Waitlist
  async joinWaitlist(email: string) {
    const response = await fetch(`${API_BASE_URL}/waitlist/join`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    });
    return await response.json();
  }
};