"use client";

import { ChevronLeft, Info, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useState, useEffect, useCallback } from "react";
import { useAccount, useWalletClient, useConfig } from "wagmi";
import { useBilloq } from "@/hooks/useBilloq";
import { contractConfig } from "@/config/contract";
import { erc20Abi } from "viem";
import { ethers } from "ethers";
import { getEthersSigner } from "@/config/adapter";
import { toast } from "react-toastify";

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
  airtime: 0,
  data: 1,
  cable: 2,
  electricity: 3,
  others: 4,
};

const tokenAddresses = {
  USDT: process.env.NEXT_PUBLIC_SEPOLIA_USDT_ADDRESS as `0x${string}`,
  USDC: process.env.NEXT_PUBLIC_SEPOLIA_USDC_ADDRESS as `0x${string}`,
};

const PaymentModal: React.FC<PaymentModalProps> = ({
  onClose,
  onBack,
  provider,
  billPlan,
  subscriberId,
  amountInNaira,
  token,
  source,
  quoteId,
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
  const { address } = useAccount();
  const { data: walletClient } = useWalletClient();
  const [billContract, setBillContract] = useState<ethers.Contract | null>(null);
  const [tokenContract, setTokenContract] = useState<ethers.Contract | null>(null);
  const { initiatePayment } = useBilloq();
  const config = useConfig();

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

      const billInstance = new ethers.Contract(
        contractConfig.address,
        contractConfig.abi,
        signer
      );
      setBillContract(billInstance);

      const tokenInstance = new ethers.Contract(paymentToken, erc20Abi, signer);
      setTokenContract(tokenInstance);
    } catch (error) {
      console.error("Contract initialization failed:", error);
      setBillContract(null);
      setTokenContract(null);
      toast.error("Failed to initialize contracts. Please try again.", {
        position: "bottom-right",
        autoClose: 5000,
        theme: "dark",
      });
    }
  }, [walletClient, address, config, paymentToken]);

  useEffect(() => {
    initializeContracts();
  }, [initializeContracts]);

  const approveToken = async () => {
    if (!tokenContract) {
      throw new Error("Token contract not initialized");
    }
    try {
      console.log("Approving token transfer...");
      const tx = await tokenContract.approve(contractConfig.address, tokenAmount);
      console.log("Approval transaction hash:", tx.hash);
      const receipt = await tx.wait();
      console.log("Approval transaction confirmed:", receipt.hash);
      return receipt;
    } catch (error: any) {
      console.error("Error approving token transfer:", error.message, error.stack);
      throw error;
    }
  };

  const payBill = async () => {
    if (!billContract) {
      throw new Error("Bill contract not initialized");
    }
    try {
      console.log("Processing bill payment...");
      const tx = await billContract.payBill(
        billType,
        subscriberId,
        BigInt(Math.floor(parseFloat(amountInNaira))),
        tokenAmount,
        provider,
        paymentToken
      );
      console.log("Bill transaction hash:", tx.hash);
      const receipt = await tx.wait();
      console.log("Bill transaction confirmed:", receipt.hash);
      setTxHash(receipt.transactionHash);

      let transactionId: bigint | null = null;
      setUserAddress(receipt.from);

      for (const log of receipt.logs) {
        try {
          const parsedLog = billContractInterface.parseLog(log);
          if (parsedLog && parsedLog.name === "BillPaid") {
            transactionId = parsedLog.args[0];
            setTransactionId(transactionId?.toString() || "");
            console.log("Found transactionId:", transactionId?.toString());
            break;
          }
        } catch (e) {
          continue;
        }
      }

      if (!transactionId) {
        throw new Error("Could not find transactionId in event logs");
      }

      return { receipt, transactionId: transactionId.toString() };
    } catch (error: any) {
      console.error("Error processing bill payment:", error.message, error.stack);
      throw error;
    }
  };

  const handlePayBill = async () => {
    if (!provider || !subscriberId || !amountInNaira || !billContract || !tokenContract) {
      toast.error("Missing required payment details or contracts not initialized!", {
        position: "bottom-right",
        autoClose: 5000,
        theme: "dark",
      });
      return;
    }

    setIsProcessing(true);
    toast.info("PROCESSING PAYMENT, PLEASE DO NOT CLOSE THIS PAGE", {
      position: "bottom-right",
      autoClose: false,
      theme: "dark",
    });

    try {
      // Step 1: Approve token transfer
      await approveToken();

      // Step 2: Pay bill via smart contract
      const { receipt, transactionId } = await payBill();

      // Step 3: Notify backend
      if (receipt.status === 1) {
        console.log("Initiating backend payment...");
        await initiatePayment({
          quoteId: quoteId,
          transaction_hash: receipt.hash,
          transactionid: transactionId,
          userAddress: receipt.from,
          cryptocurrency: token,
          cryptoAmount: convertedAmount,
        });
        console.log("Backend payment initiated successfully");

        toast.dismiss(); // Dismiss the processing toast
        toast.success("Payment completed successfully!", {
          position: "bottom-right",
          autoClose: 5000,
          theme: "dark",
        });

        setIsProcessing(false);
        onClose(); // Close modal on success
      } else {
        throw new Error("Transaction failed");
      }
    } catch (error: any) {
      console.error("Payment process failed:", error.message, error.stack);
      toast.dismiss(); // Dismiss the processing toast
      toast.error(
        error.message === "Token contract not initialized" ||
        error.message === "Bill contract not initialized"
          ? "Contracts not initialized. Please reconnect your wallet."
          : error.message === "Could not find transactionId in event logs"
          ? "Failed to retrieve transaction ID. Please try again."
          : "Failed to process payment. Please try again.",
        {
          position: "bottom-right",
          autoClose: 5000,
          theme: "dark",
        }
      );
      setIsProcessing(false);
    }
  };

  const handleBackClick = () => {
    onBack();
  };

  const handleCloseAttempt = () => {
    setShowConfirmation(true);
  };

  const handleConfirmClose = () => {
    setShowConfirmation(false);
    onClose();
  };

  const handleCancelClose = () => {
    setShowConfirmation(false);
  };

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      handleCloseAttempt();
    }
  };

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
                disabled={isProcessing}
              >
                <ChevronLeft className="h-5 w-5" />
              </Button>
              <h2 className="text-white text-lg font-medium">Payment Details</h2>
              <Button
                variant="ghost"
                size="icon"
                className="text-gray-400 hover:text-white hover:bg-gray-800"
                onClick={handleCloseAttempt}
                disabled={isProcessing}
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
                <p>
                  All payments are routed through secure smart contracts, and will be recorded onchain.
                  Total amounts include fees for electricity and TV payments.
                </p>
              </div>

              <Button
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-5"
                onClick={handlePayBill}
                disabled={isProcessing || !billContract || !tokenContract}
              >
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
                  disabled={isProcessing}
                >
                  No, Continue
                </Button>
                <Button
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white"
                  onClick={handleConfirmClose}
                  disabled={isProcessing}
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