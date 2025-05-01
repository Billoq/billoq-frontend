"use client";

import { ChevronLeft, Info, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useState, useEffect, useCallback } from "react";
import { useAccount, useWalletClient, useConfig } from "wagmi";
import { useBilloq } from "@/hooks/useBilloq";
import { contractConfig } from "@/config/contract";
import { erc20Abi } from "viem";
import {ethers} from "ethers";
import { getEthersSigner } from "@/config/adapter";

interface PaymentModalProps {
  onClose: () => void;
  onBack: () => void;
  provider: string;
  billPlan: string;
  subscriberId: string;
  amountInNaira: string;
  token: string;
  source: "airtime" | "data" | "electricity" | "cable";
  quoteId: string;
}

const BillType = {
  "airtime": 0,
  "data": 1,
  "cable": 2,
  "electricity": 3,
  "others": 4
}

const tokenAddresses = {
  "USDT": process.env.NEXT_PUBLIC_SEPOLIA_USDT_ADDRESS as `0x${string}`,
  "USDC": process.env.NEXT_PUBLIC_SEPOLIA_USDC_ADDRESS as `0x${string}`
}

const PaymentModal: React.FC<PaymentModalProps> = ({
  onClose,
  onBack,
  provider,
  billPlan,
  subscriberId, 
  amountInNaira, 
  token,
  source,
  quoteId
}) => {

  // Simulated conversion (replace with real conversion logic if needed)
  const convertedAmount = (parseFloat(amountInNaira || "0") / 1612).toFixed(6);

  const [showConfirmation, setShowConfirmation] = useState(false);
  const [paymentToken, setPaymentToken] = useState(tokenAddresses[token as keyof typeof tokenAddresses]);
  const [billType, setBillType] = useState(BillType[source as keyof typeof BillType]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [txHash, setTxHash] = useState<`0x${string}` | undefined>(undefined);
  const [transactionId, setTransactionId] = useState<string>("");
  const [userAddress, setUserAddress] = useState<string>("");
  const [txStatus, setTxStatus] = useState<boolean>(false);
  const { address } = useAccount();
  const { data: walletClient } = useWalletClient();
  const [billContract, setBillContract] = useState<ethers.Contract | null>(null);
  const [tokenContract, setTokenContract] = useState<ethers.Contract | null>(null);
  const { initiatePayment } = useBilloq();
  const config = useConfig();

  // Convert Naira to token amount (using a fixed rate for example)
  
  const tokenAmount = BigInt(Math.floor(parseFloat(convertedAmount) * 1e18));
  const billContractInterface = new ethers.Interface(contractConfig.abi);
 
  const initializeContracts = useCallback(async () => {
    if (!walletClient || !address) {
      setBillContract(null);
      setTokenContract(null);
      return;
    }

    try {
      const signer = await getEthersSigner(config);
      
      // Initialize bill payment contract
      const billInstance = new ethers.Contract(
        contractConfig.address,
        contractConfig.abi,
        signer
      );
      setBillContract(billInstance);

      // Initialize token contract
      const tokenInstance = new ethers.Contract(
        paymentToken,
        erc20Abi,
        signer
      );
      setTokenContract(tokenInstance);
    } catch (error) {
      console.error("Contract initialization failed:", error);
      setBillContract(null);
      setTokenContract(null);
    }
  }, [walletClient, address, config, paymentToken]);

  useEffect(() => {
    initializeContracts();
  }, [initializeContracts]);

  const payBill = async () => {
    if (!billContract || !tokenContract) {
      console.error("Contract not initialized");
      return;
    }
    try {
      console.log('Processing bill payment:');
      const tx = await billContract.payBill(
        billType,
        subscriberId,
        BigInt(Math.floor(parseFloat(amountInNaira))),
        tokenAmount,
        provider,
        paymentToken
      );
      console.log('Bill Transaction hash:', tx.hash);
      const receipt = await tx.wait();
      console.log('Bill Transaction confirmed:', receipt.hash);
      setTxHash(receipt.transactionHash);
      console.log("Receipt:", receipt);

      let transactionId: bigint | null = null;

      setUserAddress(receipt.from);

      for (const log of receipt.logs) {
        try {
          // Try to parse the log as a BillPaid event
          const parsedLog = billContractInterface.parseLog(log);
          
          if (parsedLog && parsedLog.name === "BillPaid") {
            // The first indexed argument is transactionId
            transactionId = parsedLog.args[0];
            setTransactionId(transactionId?.toString() || "");
            console.log('Found transactionId:', transactionId?.toString());
            break;
          }
        } catch (e) {
          // This log wasn't a BillPaid event, continue checking
          continue;
        }
      }
  
      if (!transactionId) {
        throw new Error("Could not find transactionId in event logs");
      }

      if (receipt.status === 1) {
        await initiatePayment({
          quoteId: quoteId,
          transaction_hash: receipt.hash,
          transactionid: transactionId.toString(), // Use the extracted transactionId
          userAddress: receipt.from,
          cryptocurrency: token,
          cryptoAmount: convertedAmount
        });
      }

    } catch (error) {
      console.error('Error processing bill payment:', error);
    }
  }

  const approveToken = async () => {
    if (!tokenContract) {
      console.error("Token contract not initialized");
      return
    }
    try {
      console.log('Approving token transfer...');
      const tx = await tokenContract.approve(
        contractConfig.address,
        tokenAmount
      );
      console.log('Approval transaction hash:', tx.hash);
      const receipt = await tx.wait();
      console.log('Approval transaction confirmed:', receipt.hash);
    } catch (error) {
      console.error('Error approving token transfer:', error);
    }
  }
  // const handleSuccessfulPayment = async () => {

  //   // if (!txStatus){
  //   //   console.error("Bill Transaction failed");
  //   //   return;}
  //   try {
  //     console.log('Payment successful, sending data to backend...');
  //     await initiatePayment({
  //       quoteId: quoteId,
  //       transaction_hash: txHash!,
  //       transactionid: transactionId, // Using transaction ID from events
  //       userAddress: userAddress, // Sender address from receipt
  //       cryptocurrency: paymentToken,
  //       cryptoAmount: convertedAmount
  //     });

  //     console.log('Payment completed successfully!');
  //     onClose(); // Close modal on success
  //   } catch (error) {
  //     console.error('Backend integration failed:', error);
  //     console.error('Payment completed but backend integration failed');
  //   } finally {
  //     setIsProcessing(false);
  //   }
  // };
  

  const handlePayBill = async () => {
    if (!provider || !subscriberId || !amountInNaira) return;
    setIsProcessing(true);
    await approveToken();
    await payBill();
    // await handleSuccessfulPayment();
  };
      

  const handleBackClick = () => {
    onBack();
  };

  const handleCloseAttempt = () => {
    setShowConfirmation(true);
  };

  const handleConfirmClose = () => {
    setShowConfirmation(false);
    onClose(); // Triggers handleClosePaymentModal, resetting all modal states
  };

  const handleCancelClose = () => {
    setShowConfirmation(false);
  };

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      handleCloseAttempt();
    }
  };

  // Enhanced bill type detection
  const getBillType = () => {
    if (provider.includes("DSTV") || provider.includes("GOTV") || provider.includes("STARTIMES")) {
      return "Cable TV";
    }
    if (provider.includes("MTN") || provider.includes("AIRTEL") || provider.includes("GLO") || provider.includes("9MOBILE")) {
      if (provider.includes("DATA")) return "Mobile Data";
      return "Airtime";
    }
    return "Electricity";
  };

  return (
    <>
      <div
        className="fixed inset-0 flex items-center justify-center bg-slate-800/80 p-4 z-50"
        onClick={handleOverlayClick}
      >
        <Card className="w-full max-w-md mx-auto overflow-hidden bg-transparent border-0 text-blue-400">
          <Card className="bg-gray-900 border-0 shadow-xl">
            <div className="flex items-center justify-between p-4 border-b border-gray-800">
              <Button
                variant="ghost"
                size="icon"
                className="text-gray-400 hover:text-white hover:bg-gray-800"
                onClick={handleBackClick}
              >
                <ChevronLeft className="h-5 w-5" />
              </Button>
              <h2 className="text-white text-lg font-medium">Payment Details</h2>
              <Button
                variant="ghost"
                size="icon"
                className="text-gray-400 hover:text-white hover:bg-gray-800"
                onClick={handleCloseAttempt}
              >
                <X className="h-5 w-5" />
              </Button>
            </div>

            <CardContent className="p-6 space-y-6">
              <div className="grid grid-cols-2 gap-y-4">
                <div className="text-gray-400">Bill Type</div>
                <div className="text-white text-right">{getBillType()}</div>

                <div className="text-gray-400">Provider</div>
                <div className="text-white text-right">{provider}</div>

                <div className="text-gray-400">Bill Plan</div>
                <div className="text-white text-right">{billPlan}</div>

                <div className="text-gray-400">Subscriber ID</div>
                <div className="text-white text-right">{subscriberId}</div>

                <div className="text-gray-400">Total Amount in Naira</div>
                <div className="text-white text-right">₦{amountInNaira}</div>

                <div className="text-gray-400">Total Amount in USD</div>
                <div className="text-white text-right">${convertedAmount}</div>

                <div className="text-gray-400">Payment Token</div>
                <div className="text-white text-right">
                  <p>{token}</p>
                </div>
              </div>

              <div className="flex items-start gap-2 text-xs text-gray-400 bg-gray-800/50 p-3 rounded">
                <Info className="h-4 w-4 flex-shrink-0 mt-0.5" />
                <p>All payments are routed through secure smart contracts, and will be recorded onchain.</p>
                <p>Total amounts include fees for electricity and TV payments</p>
              </div>

              <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-5" onClick={handlePayBill} disabled={isProcessing}>
                {isProcessing ? (
                  <span className="flex items-center justify-center">
                    Processing...
                  </span>
                ) : (
                  "Confirm Payment"
                )}
              </Button>

              <div className="text-center text-sm">
                <span className="text-gray-400">Need help?</span>{" "}
                <a href="#" className="text-blue-400 hover:underline">
                  Chat with Support
                </a>
              </div>
            </CardContent>
          </Card>
        </Card>
      </div>

      {/* Confirmation Dialog */}
      {showConfirmation && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/70 z-50">
          <Card className="w-full max-w-sm bg-gray-900 border-gray-800">
            <CardContent className="p-6 space-y-6">
              <div className="space-y-2">
                <h3 className="text-lg font-medium text-white">Are you sure you want to quit?</h3>
                <p className="text-gray-400">Your payment details will not be saved.</p>
              </div>
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  className="flex-1 bg-transparent text-white hover:bg-gray-800 hover:text-white"
                  onClick={handleCancelClose}
                >
                  No, Continue
                </Button>
                <Button
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white"
                  onClick={handleConfirmClose}
                >
                  Yes, Quit
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
};

export default PaymentModal;