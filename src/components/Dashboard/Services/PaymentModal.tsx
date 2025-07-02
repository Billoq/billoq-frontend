"use client";

import { ChevronLeft, Info, X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useState, useEffect, useCallback } from "react";
import { useAccount, useWalletClient, useConfig, useChainId } from "wagmi";
import { useBilloq } from "@/hooks/useBilloq";
import { getContractConfig } from "@/config/contract";
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
  customerName?: string;
}

interface TransactionResult {
  receipt: ethers.TransactionReceipt;
  transactionId: string;
}

// Define proper types for token addresses
type SupportedToken = "USDT" | "USDC";

const BillType = {
  airtime: 0,
  data: 1,
  cable: 2,
  electricity: 3,
  others: 4,
} as const;

// Use proper type for BillType
type BillTypeKey = keyof typeof BillType;


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
  customerName,
}) => {
  const chainId = useChainId();
  const [contractConfig, setContractConfig] = useState(getContractConfig(chainId));

  useEffect(() => {
    const contracts= getContractConfig(chainId);
    if (!contracts) {
      toast.error("Failed to load contract configuration.", {
        position: "bottom-right",
        autoClose: 5000,
        theme: "dark",
      });
    }
    setContractConfig(contracts);
  }, [chainId]);  

  const tokenAddresses: Record<SupportedToken, `0x${string}`> = {
    USDT: contractConfig["usdt"] as `0x${string}`,
    USDC: contractConfig["usdc"] as `0x${string}`,
  };

  // Simulated conversion (replace with real conversion logic if needed)
  const convertedAmount = (parseFloat(amountInNaira || "0") / 1612).toFixed(6);

  const [showConfirmation, setShowConfirmation] = useState(false);
  const [paymentToken] = useState<`0x${string}`>(
    tokenAddresses[token as SupportedToken] || tokenAddresses.USDT
  );
  const [billType] = useState(BillType[source as BillTypeKey]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStep, setProcessingStep] = useState<string>("");
  const [txHash, setTxHash] = useState<`0x${string}` | undefined>(undefined);
  const { address } = useAccount();
  const { data: walletClient } = useWalletClient();
  const [billContract, setBillContract] = useState<ethers.Contract | null>(null);
  const [tokenContract, setTokenContract] = useState<ethers.Contract | null>(null);
  const { initiatePayment } = useBilloq();
  const config = useConfig();

  const tokenAmount = BigInt(Math.floor(parseFloat(convertedAmount) * 1e18));
  const billContractInterface = new ethers.Interface(contractConfig.abi);

  // Check if contracts are ready
  const areContractsReady = Boolean(billContract && tokenContract);

  const initializeContracts = useCallback(async () => {
    if (!walletClient || !address) {
      setBillContract(null);
      setTokenContract(null);
      return;
    }

    try {
      const signer = await getEthersSigner(config);
      if (!signer) {
        throw new Error("Failed to get signer");
      }

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

  const approveToken = async (): Promise<ethers.TransactionReceipt> => {
    if (!tokenContract) {
      throw new Error("Token contract not initialized");
    }
    
    setProcessingStep("Approving token transfer...");
    
    try {
      console.log("Approving token transfer...");
      const tx = await tokenContract.approve(contractConfig.address, tokenAmount);
      console.log("Approval transaction hash:", tx.hash);
      const receipt = await tx.wait();
      console.log("Approval transaction confirmed:", receipt.hash);
      return receipt;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error during approval";
      console.error("Error approving token transfer:", errorMessage);
      throw new Error(`Token approval failed: ${errorMessage}`);
    }
  };

  const payBill = async (): Promise<TransactionResult> => {
    if (!billContract) {
      throw new Error("Bill contract not initialized");
    }
    
    setProcessingStep("Processing bill payment...");
    
    try {
      console.log("Processing bill payment...");
      const tx = await billContract.payBill(
        billType,
        quoteId,
        BigInt(Math.floor(parseFloat(amountInNaira))),
        tokenAmount,
        paymentToken
      );
      console.log("Bill transaction hash:", tx.hash);
      const receipt = await tx.wait();
      console.log("Bill transaction confirmed:", receipt.hash);
      setTxHash(receipt.hash as `0x${string}`);

      let transactionId: bigint | null = null;

      for (const log of receipt.logs) {
        try {
          const parsedLog = billContractInterface.parseLog({
            topics: log.topics as string[],
            data: log.data
          });
          
          if (parsedLog && parsedLog.name === "BillPaid") {
            transactionId = parsedLog.args[0];
            console.log("Found transactionId:", transactionId?.toString());
            break;
          }
        } catch (e) {
          console.error("Error parsing log:", e);
          continue;
        }
      }

      if (transactionId == null) {
        throw new Error("Could not find transactionId in event logs");
      }

      return { 
        receipt, 
        transactionId: transactionId.toString() 
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error during payment";
      console.error("Error processing bill payment:", errorMessage);
      throw new Error(`Bill payment failed: ${errorMessage}`);
    }
  };

  const notifyBackend = async (
    txHash: string,
    transactionId: string,
    userAddress: string
  ): Promise<void> => {
    setProcessingStep("Finalizing payment...");
    
    try {
      console.log("Initiating backend payment...");
      await initiatePayment({
        quoteId: quoteId,
        transaction_hash: txHash,
        transactionid: transactionId,
        userAddress: userAddress,
        cryptocurrency: token,
        cryptoAmount: convertedAmount,
      });
      console.log("Backend payment initiated successfully");
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error";
      console.error("Error notifying backend:", errorMessage);
      throw new Error(`Backend notification failed: ${errorMessage}`);
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
    const processingToast = toast.info("PROCESSING PAYMENT, PLEASE DO NOT CLOSE THIS PAGE", {
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
        await notifyBackend(receipt.hash, transactionId, receipt.from);

        toast.dismiss(processingToast); // Dismiss the processing toast
        toast.success("Payment completed successfully!", {
          position: "bottom-right",
          autoClose: 5000,
          theme: "dark",
        });

        // Small delay to allow the success message to be seen
        setTimeout(() => {
          setIsProcessing(false);
          onClose(); // Close modal on success
        }, 1500);
      } else {
        throw new Error("Transaction failed with status code: " + receipt.status);
      }
    } catch (error) {
      console.error("Payment process failed:", error);
      toast.dismiss(processingToast); // Dismiss the processing toast
      
      let errorMessage = "Failed to process payment. Please try again.";
      
      if (error instanceof Error) {
        if (error.message.includes("Token contract not initialized") || 
            error.message.includes("Bill contract not initialized")) {
          errorMessage = "Contracts not initialized. Please reconnect your wallet.";
        } else if (error.message.includes("Could not find transactionId")) {
          errorMessage = "Failed to retrieve transaction ID. Please try again.";
        } else if (error.message.includes("user rejected transaction")) {
          errorMessage = "Transaction was rejected. Please try again.";
        }
      }
      
      toast.error(errorMessage, {
        position: "bottom-right",
        autoClose: 5000,
        theme: "dark",
      });
      setIsProcessing(false);
    } finally {
      setProcessingStep("");
    }
  };

  const handleBackClick = () => {
    onBack();
  };

  const handleCloseAttempt = () => {
    if (isProcessing) {
      toast.warning("Please wait until the transaction completes", {
        position: "bottom-right",
        autoClose: 3000,
        theme: "dark",
      });
      return;
    }
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
    if (e.target === e.currentTarget && !isProcessing) {
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
          <Card className="w-full max-w-md mx-auto overflow-hidden bg-transparent border-0 text-[#38C3D8]">
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

                {customerName && (source === "electricity" || source === "cable") && (
                  <>
                    <div className="text-gray-400">Customer Name</div>
                    <div className="text-white text-right">{customerName}</div>
                  </>
                )}

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

              {isProcessing ? (
                <div className="w-full bg-[#38C3D8]/50 text-white py-5 flex items-center justify-center gap-2 rounded">
                  <Loader2 className="h-5 w-5 animate-spin" />
                  <span>{processingStep || "Processing..."}</span>
                </div>
              ) : (
                <Button
                  className="w-full bg-[#1B89A4] text-white py-5"
                  onClick={handlePayBill}
                  disabled={!areContractsReady}
                >
                  {!areContractsReady ? "Connecting to Wallet..." : "Confirm Payment"}
                </Button>
              )}

              {txHash && (
                <div className="text-center text-sm">
                  <a 
                    href={`https://sepolia.etherscan.io/tx/${txHash}`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-[#1B89A4] hover:underline"
                  >
                    View Transaction on Etherscan
                  </a>
                </div>
              )}

              <div className="text-center text-sm">
                <span className="text-gray-400">Need help?</span>{" "}
                <a href="#" className="text-[#1B89A4] hover:underline">
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