export type BillType = "Airtime" | "Data" | "Cable" | "Electricity" | "Others";

export interface Transaction {
  id: string;
  billType: BillType;
  status: "pending" | "successful" | "failed";
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
  rawData?: any; // Keep original data for reference
}

export interface ApiTransaction {
  _id: string;
  user_address: string;
  biller_code: string;
  item_code: string;
  customer_id: string;
  quote: string;
  amountQuotedInNaira: number;
  cryptocurrency: string;
  cryptoAmount: number;
  order_status: "pending" | "successful" | "failed";
  transaction_hash: string;
  blockchain_transaction_id: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}