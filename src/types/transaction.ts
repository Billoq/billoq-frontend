export type BillType = "Airtime" | "Data" | "Cable TV" | "Electricity" | "Others";

export interface Transaction {
  id: string;
  billType: BillType;
  status: "pending" | "completed" | "failed";
  provider: string;
  description: string;
  amountInNaira: number;
  amountInCrypto: number;
  paymentMethod: "USDT" | "USDC";
  date: string;
  hash: string;
  blockchain_transaction_id: string;
  subscriberId: string;
  explorerUrl: string;
  notes?: string; // Prepaid electricity token/meter number
  customerName?: string; // Customer name from quote
  customerId?: string; // Customer ID from quote
  rawData?: ApiTransaction; // Keep original data for reference
}

export interface TransactionQuote {
    _id: string;
    billerCode: string;
    billType?: string; // e.g., "Electricity/Utility Bills"
    provider?: string; // e.g., "IKEJA DISCO ELECTRICITY BILLS"
    description?: string; // e.g., "IKEDC  PREPAID"
    itemCode: string;
    customerName?: string | null; // Make optional and allow null
    customerId?: string; // Make optional since it might not always be present
    amount: number;
    fee: number;
    vatOnFee: number;
    totalAmount: number;
    createdAt: string;
    __v: number;
}

export interface ApiTransaction {
    _id: string;
    user_address: string;
    biller_code: string;
    item_code: string;
    customer_id: string;
    quote: TransactionQuote;
    amountQuotedInNaira?: number; // Optional for backward compatibility
    cryptocurrency?: string;      // Optional for backward compatibility
    cryptoAmount?: number;        // Optional for backward compatibility
    order_status: "pending" | "completed" | "failed";
    transaction_hash: string;
    blockchain_transaction_id: string;
    createdAt: string;
    updatedAt: string;
    __v: number;
    notes?: string; // Prepaid electricity token/meter number
}