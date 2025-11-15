"use client";

import { ChevronLeft, Info, X, Loader2, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useState, useEffect, useCallback, useMemo } from "react";
import { useBilloq } from "@/hooks/useBilloq";
import { useBalance } from "@/context/balance-context";
import { getContractConfig } from "@/config/contract";
import { toast } from "react-toastify";
import { useAccount, useWalletClient, useConfig, useChainId } from "wagmi";
import { sepolia, liskSepolia, arbitrumSepolia, bscTestnet, mainnet, bsc, arbitrum } from "wagmi/chains";
import { erc20Abi } from "viem";
import { ethers } from "ethers";
import { getEthersSigner } from "@/config/adapter";
import {
  useActiveAccount,
  useActiveWalletChain,
} from "thirdweb/react";
import { getContract, prepareContractCall, sendTransaction, waitForReceipt } from "thirdweb";
import { fetchBalance } from "@wagmi/core";
import { wagmiConfig } from "@/config";
import { thirdwebClient } from "@/lib/thirdwebClient";
import { getChainById, defaultChain } from "@/lib/thirdwebChains";

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

interface PaymentExecutionResult {
  transactionHash: `0x${string}`;
  transactionId: string;
  from: string;
  status: number | bigint | undefined;
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
  quoteId,
  customerName,
}) => {
  const wagmiChainId = useChainId();
  const activeAccount = useActiveAccount();
  const activeWalletChain = useActiveWalletChain();
  // Use thirdweb signing if activeAccount exists (covers in-app wallets and social logins)
  const shouldUseThirdwebSigning = Boolean(activeAccount?.address);
  // Default to Base chain when using in-app wallet (social login)
  const chainId = activeWalletChain?.id ?? wagmiChainId ?? defaultChain.id;

  const { address: wagmiAddress } = useAccount();
  const connectedAddress = activeAccount?.address ?? wagmiAddress;
  const { data: walletClient } = useWalletClient();
  const config = useConfig();

  const [contractConfig, setContractConfig] = useState(getContractConfig(chainId));

  // Balance context for real exchange rates
  const { 
    exchangeRate, 
    exchangeRateLoading, 
    exchangeRateError, 
    refreshBalances 
  } = useBalance();

  const getTokenDecimals = (chainId: number): number => {
  // BSC chains use 18 decimals
  if (chainId === bscTestnet.id || chainId === bsc.id) {
    return 18;
  }
  
  // Most other chains use 6 decimals for USDT/USDC
  // Add specific overrides if needed for other chains
  return 6;
};

  // Calculate converted amount using real exchange rate
  const convertedAmount = useMemo(() => {
  if (!exchangeRate || exchangeRateLoading) {
    return "0.000000";
  }
  
  const nairAmount = parseFloat(amountInNaira || "0");
  const usdAmount = nairAmount / exchangeRate;
  
  // Show more precision for 18 decimal tokens, less for 6 decimal tokens
  const decimals = getTokenDecimals(chainId);

  const displayDecimals = decimals === 18 ? 8 : 6;
  
  return usdAmount.toFixed(displayDecimals);
}, [amountInNaira, exchangeRate, exchangeRateLoading, chainId]);

  // Check if conversion is ready
  const isConversionReady = Boolean(exchangeRate && !exchangeRateLoading && !exchangeRateError);

  const getExplorerUrl = (chainId: number, txHash: string): string => {
  const baseUrls: Record<number, string> = {
    // Testnets
    [sepolia.id]: "https://sepolia.etherscan.io/tx/",
    [bscTestnet.id]: "https://testnet.bscscan.com/tx/",
    [arbitrumSepolia.id]: "https://sepolia.arbiscan.io/tx/",
    [liskSepolia.id]: "https://sepolia-blockscout.lisk.com/tx/",
    
    // Mainnets
    [mainnet.id]: "https://etherscan.io/tx/",
    [bsc.id]: "https://bscscan.com/tx/",
    [arbitrum.id]: "https://arbiscan.io/tx/",
    1135: "https://blockscout.lisk.com/tx/", // Lisk mainnet
  }
  
  const baseUrl = baseUrls[chainId]
  if (!baseUrl) {
    console.warn(`Unknown chain ID: ${chainId}, falling back to Etherscan`)
    return `https://etherscan.io/tx/${txHash}`
  }
  
  return `${baseUrl}${txHash}`
}
  useEffect(() => {
    const contracts = getContractConfig(chainId);
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
  const coreAddress = contractConfig.address as `0x${string}`;

  const [showConfirmation, setShowConfirmation] = useState(false);
  const [paymentToken] = useState<`0x${string}`>(
    tokenAddresses[token as SupportedToken] || tokenAddresses.USDT
  );
  const [billType] = useState(BillType[source as BillTypeKey]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStep, setProcessingStep] = useState<string>("");
  const [txHash, setTxHash] = useState<`0x${string}` | undefined>(undefined);
  const [billContract, setBillContract] = useState<ethers.Contract | null>(null);
  const [tokenContract, setTokenContract] = useState<ethers.Contract | null>(null);
  const { initiatePayment } = useBilloq();

  const logGasDetails = useCallback((label: string, receipt: Record<string, unknown>) => {
    try {
      const toBigIntSafe = (value: unknown): bigint | null => {
        if (typeof value === "bigint") return value;
        if (typeof value === "number") return BigInt(Math.trunc(value));
        if (typeof value === "string" && value) return BigInt(value);
        return null;
      };

      const gasUsed = toBigIntSafe(receipt?.gasUsed);
      const gasPrice =
        toBigIntSafe(receipt?.effectiveGasPrice) ?? toBigIntSafe(receipt?.gasPrice);
      if (!gasUsed || !gasPrice) {
        console.log(`${label} gas details unavailable`, { gasUsed, gasPrice, receipt });
        return;
      }
      const gasCostWei = gasUsed * gasPrice;
      const gasCostEth = Number(ethers.formatEther(gasCostWei));
      console.log(
        `${label} Gas Usage`,
        {
          gasUsed: gasUsed.toString(),
          gasPriceWei: gasPrice.toString(),
          gasCostWei: gasCostWei.toString(),
          gasCostEth,
        }
      );
    } catch (error) {
      console.log(`${label} gas logging failed`, error);
    }
  }, []);

  
  const tokenAmount = useMemo(() => {
    if (!isConversionReady) return BigInt(0);

    const decimals = getTokenDecimals(chainId);
    const multiplier = Math.pow(10, decimals);

    return BigInt(Math.floor(parseFloat(convertedAmount) * multiplier));
  }, [convertedAmount, isConversionReady, chainId, token]);

  const [nativeBalance, setNativeBalance] = useState<bigint | null>(null);
  const [nativeBalanceLoading, setNativeBalanceLoading] = useState(false);

  useEffect(() => {
    const decimals = getTokenDecimals(chainId);
    console.log('🔍 Debug Info:', {
      chainId,
      token,
      decimals,
      convertedAmount,
      tokenAmount: tokenAmount.toString(),
      chainName:
        chainId === bsc.id
          ? 'BSC Mainnet'
          : chainId === bscTestnet.id
          ? 'BSC Testnet'
          : 'Other Chain',
    });
  }, [chainId, token, convertedAmount, tokenAmount]);

  useEffect(() => {
    const fetchNativeBalance = async () => {
      if (!connectedAddress || !chainId) {
        setNativeBalance(null);
        return;
      }

      setNativeBalanceLoading(true);

      try {
        const balanceResult = await fetchBalance(wagmiConfig, {
          address: connectedAddress as `0x${string}`,
          chainId,
        });

        setNativeBalance(balanceResult.value);
      } catch (error) {
        console.error("Failed to fetch native balance:", error);
        setNativeBalance(null);
      } finally {
        setNativeBalanceLoading(false);
      }
    };

    fetchNativeBalance();
  }, [connectedAddress, chainId, activeWalletChain]);


  const billContractInterface = new ethers.Interface(contractConfig.abi);

  // Check if contracts are ready
  const minimumNativeBalance = BigInt(1e9); // (~0.001 native token)

  const hasSufficientNativeBalance =
    nativeBalance === null || nativeBalance >= minimumNativeBalance;

  const areContractsReady = shouldUseThirdwebSigning
    ? Boolean(activeAccount?.address && chainId && isConversionReady && hasSufficientNativeBalance)
    : Boolean(
        billContract &&
          tokenContract &&
          isConversionReady &&
          hasSufficientNativeBalance &&
          !nativeBalanceLoading
      );

  const initializeContracts = useCallback(async () => {
    if (shouldUseThirdwebSigning) {
      setBillContract(null);
      setTokenContract(null);
      return;
    }

    if (!walletClient || !wagmiAddress) {
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
  }, [walletClient, wagmiAddress, config, paymentToken, shouldUseThirdwebSigning, contractConfig.address, contractConfig.abi]);

  useEffect(() => {
    initializeContracts();
  }, [initializeContracts, shouldUseThirdwebSigning]);

  const handleRefreshExchangeRate = async () => {
    try {
      await refreshBalances();
      toast.success("Exchange rate updated!", {
        position: "bottom-right",
        autoClose: 2000,
        theme: "dark",
      });
    } catch (error) {
      toast.error("Failed to refresh exchange rate", {
        position: "bottom-right",
        autoClose: 3000,
        theme: "dark",
      });
      console.log(error)
    }
  };

  const approveTokenWithWagmi = async (): Promise<void> => {
    if (!tokenContract) {
      throw new Error("Token contract not initialized");
    }
    
    setProcessingStep("Approving token transfer...");
    
    try {
      console.log("Approving token transfer...");
      // Add a small buffer (1% or minimum 1000 units) to ensure allowance is always sufficient
      const bufferAmount = tokenAmount / BigInt(100); // 1% buffer
      const minBuffer = BigInt(1000); // Minimum buffer
      const approvalAmount = tokenAmount + (bufferAmount > minBuffer ? bufferAmount : minBuffer);
      
      const tx = await tokenContract.approve(contractConfig.address, approvalAmount);
      console.log("Approval transaction hash:", tx.hash);
      const receipt = await tx.wait();
      console.log("Approval transaction confirmed:", receipt.hash);
      if (receipt.status !== BigInt(1) && receipt.status !== 1) {
        throw new Error("Approval transaction failed");
      }
      logGasDetails("Wagmi approval", receipt);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error during approval";
      console.error("Error approving token transfer:", errorMessage);
      throw new Error(`Token approval failed: ${errorMessage}`);
    }
  };

  const payBillWithWagmi = async (): Promise<PaymentExecutionResult> => {
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

      logGasDetails("Wagmi payBill", receipt);

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
        transactionHash: receipt.hash as `0x${string}`,
        transactionId: transactionId.toString(),
        from: receipt.from,
        status: receipt.status,
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error during payment";
      console.error("Error processing bill payment:", errorMessage);

      if (errorMessage.toLowerCase().includes("insufficient token balance")) {
        toast.error("Insufficient token balance. Please top up your wallet and try again.", {
          position: "bottom-right",
          autoClose: 5000,
          theme: "dark",
        });
      }

      throw new Error(`Bill payment failed: ${errorMessage}`);
    }
  };

  const executePaymentWithWagmi = async (): Promise<PaymentExecutionResult> => {
    await approveTokenWithWagmi();
    return await payBillWithWagmi();
  };

  const executePaymentWithInApp = async (): Promise<PaymentExecutionResult> => {
    if (!activeAccount?.address) {
      throw new Error("Wallet not connected");
    }

    // Default to Base chain when using in-app wallet (social login)
    const chain = activeWalletChain ?? getChainById(chainId) ?? defaultChain;
    if (!chain) {
      throw new Error("Unsupported chain");
    }

    const erc20Contract = getContract({
      address: paymentToken,
      client: thirdwebClient,
      chain,
    });

    const coreContract = getContract({
      address: coreAddress,
      client: thirdwebClient,
      chain,
    });

    setProcessingStep("Approving token transfer...");
    try {
      // Add a small buffer (1% or minimum 1000 units) to ensure allowance is always sufficient
      const bufferAmount = tokenAmount / BigInt(100); // 1% buffer
      const minBuffer = BigInt(1000); // Minimum buffer
      const approvalAmount = tokenAmount + (bufferAmount > minBuffer ? bufferAmount : minBuffer);
      
      const approveTx = prepareContractCall({
        contract: erc20Contract,
        method: "function approve(address spender, uint256 amount)",
        params: [coreAddress, approvalAmount],
      });

      const approveResult = await sendTransaction({
        account: activeAccount,
        transaction: approveTx,
      });

      const approveReceipt = await waitForReceipt({
        client: thirdwebClient,
        chain,
        transactionHash: approveResult.transactionHash,
      });

      logGasDetails("In-app approval", approveReceipt);
    } catch (error) {
      throw error; // Re-throw to be caught by outer handler
    }

    setProcessingStep("Processing bill payment...");
    try {
      const payTx = prepareContractCall({
        contract: coreContract,
        method: "function payBill(uint8,string,uint256,uint256,address)",
        params: [
          billType,
          quoteId,
          BigInt(Math.floor(parseFloat(amountInNaira))),
          tokenAmount,
          paymentToken,
        ],
      });

      const payResult = await sendTransaction({
        account: activeAccount,
        transaction: payTx,
      });

      const receipt = await waitForReceipt({
        client: thirdwebClient,
        chain,
        transactionHash: payResult.transactionHash,
      });

      logGasDetails("In-app payBill", receipt);

      let transactionId: string | null = null;
      for (const log of receipt.logs ?? []) {
        try {
          const parsedLog = billContractInterface.parseLog({
            topics: log.topics as string[],
            data: log.data,
          });

          if (parsedLog && parsedLog.name === "BillPaid") {
            transactionId = parsedLog.args[0].toString();
            break;
          }
        } catch (error) {
          console.error("Error parsing log:", error);
        }
      }

      if (!transactionId) {
        throw new Error("Could not find transactionId in event logs");
      }

      return {
        transactionHash: payResult.transactionHash,
        transactionId,
        from: activeAccount.address,
        status: receipt.status === "success" ? 1 : 0,
      };
    } catch (error) {
      throw error; // Re-throw to be caught by outer handler
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
      console.log("🔗 Current Chain ID:", chainId); // Debug log
      
      await initiatePayment({
        quoteId: quoteId,
        transaction_hash: txHash,
        transactionid: transactionId,
        userAddress: userAddress,
        cryptocurrency: token,
        cryptoAmount: convertedAmount,
        chainId: chainId.toString(),
      });
      console.log("Backend payment initiated successfully");
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error";
      console.error("Error notifying backend:", errorMessage);
      throw new Error(`Backend notification failed: ${errorMessage}`);
    }
  };

  const handlePayBill = async () => {
    if (!provider || !subscriberId || !amountInNaira || !isConversionReady) {
      toast.error("Missing required payment details or exchange rate unavailable!", {
        position: "bottom-right",
        autoClose: 5000,
        theme: "dark",
      });
      return;
    }

    if (!connectedAddress) {
      toast.error("Wallet not connected. Please connect your wallet and try again.", {
        position: "bottom-right",
        autoClose: 5000,
        theme: "dark",
      });
      return;
    }

    if (!shouldUseThirdwebSigning && (!billContract || !tokenContract)) {
      toast.error("Contracts not initialized. Please reconnect your wallet.", {
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
      const result = shouldUseThirdwebSigning
        ? await executePaymentWithInApp()
        : await executePaymentWithWagmi();

      setTxHash(result.transactionHash);

      const status = result.status;
      const isSuccessful =
        status === undefined ||
        status === 1 ||
        status === BigInt(1);

      if (isSuccessful) {
        await notifyBackend(result.transactionHash, result.transactionId, result.from);

        toast.dismiss(processingToast);
        toast.success("Payment completed successfully!", {
          position: "bottom-right",
          autoClose: 5000,
          theme: "dark",
        });

        setTimeout(() => {
          setIsProcessing(false);
          onClose();
        }, 1500);
      } else {
        throw new Error(`Transaction failed with status code: ${String(status)}`);
      }
    } catch (error) {
      console.error("Payment process failed:", error);
      toast.dismiss(processingToast);

      const extractMessage = (err: unknown): string | undefined => {
        if (!err) return undefined;
        if (typeof err === "string") return err;
        if (err instanceof Error) return err.message;
        if (typeof err === "object") {
          const anyErr = err as Record<string, unknown>;
          if (typeof anyErr.message === "string") return anyErr.message;
          if (typeof anyErr.shortMessage === "string") return anyErr.shortMessage;
          if (anyErr.cause) return extractMessage(anyErr.cause);
          if (typeof anyErr.error === "string") return anyErr.error;
          if (
            anyErr.error &&
            typeof anyErr.error === "object" &&
            typeof (anyErr.error as Record<string, unknown>).message === "string"
          ) {
            return String((anyErr.error as Record<string, unknown>).message);
          }
        }
        return undefined;
      };

      const rawMessage = extractMessage(error);

      // Check if it's a gas-related error
      const lowerMessage = rawMessage?.toLowerCase() || "";
      const isGasError = 
        lowerMessage.includes("insufficient funds for gas") ||
        lowerMessage.includes("insufficient balance") ||
        lowerMessage.includes("insufficient gas") ||
        lowerMessage.includes("tx cost") ||
        lowerMessage.includes("overshot") ||
        (lowerMessage.includes("have") && lowerMessage.includes("want"));

      let errorMessage = "Failed to process payment. Please try again.";
      
      if (isGasError) {
        // Show user-friendly gas error message
        const chainName = getChainById(chainId)?.name ?? `Chain ${chainId}`;
        errorMessage = `Insufficient gas balance! You need more native tokens (e.g., ETH) on ${chainName} to cover transaction fees. Please add gas funds and try again.`;
        toast.error(errorMessage, {
          position: "bottom-right",
          autoClose: 7000,
          theme: "dark",
        });
      } else {
        // Handle other errors
        if (rawMessage) {
          const lower = rawMessage.toLowerCase();

          if (lower.includes("contracts not initialized")) {
            errorMessage = "Contracts not initialized. Please reconnect your wallet.";
          } else if (lower.includes("failed to retrieve transaction id")) {
            errorMessage = "Failed to retrieve transaction ID. Please try again.";
          } else if (lower.includes("user rejected transaction")) {
            errorMessage = "Transaction was rejected. Please try again.";
          } else {
            errorMessage = rawMessage;
          }
        }

        toast.error(errorMessage, {
          position: "bottom-right",
          autoClose: 5000,
          theme: "dark",
        });
      }
      
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
                <div className="text-white text-right flex items-center justify-end gap-2">
                  {exchangeRateLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Loading...</span>
                    </>
                  ) : exchangeRateError ? (
                    <span className="text-red-400">Rate Error</span>
                  ) : (
                    <span>${convertedAmount}</span>
                  )}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 text-gray-400 hover:text-white"
                    onClick={handleRefreshExchangeRate}
                    disabled={exchangeRateLoading || isProcessing}
                    title="Refresh exchange rate"
                  >
                    <RefreshCw className={`h-3 w-3 ${exchangeRateLoading ? 'animate-spin' : ''}`} />
                  </Button>
                </div>

                <div className="text-gray-400">Payment Token</div>
                <div className="text-white text-right">
                  <p>{token}</p>
                </div>

                {exchangeRate && (
                  <>
                    <div className="text-gray-400">Exchange Rate</div>
                    <div className="text-white text-right text-sm">
                      ₦{exchangeRate.toLocaleString()} per USD
                    </div>
                  </>
                )}
              </div>

              {exchangeRateError && (
                <div className="flex items-start gap-2 text-xs text-red-400 bg-red-900/20 p-3 rounded border border-red-900/50">
                  <Info className="h-4 w-4 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold">Exchange Rate Error</p>
                    <p>Using fallback rate. Please refresh or try again later.</p>
                  </div>
                </div>
              )}

              

              {connectedAddress && !nativeBalanceLoading && !hasSufficientNativeBalance && (
                <div className="flex items-start gap-2 text-xs text-yellow-300 bg-yellow-900/20 p-3 rounded border border-yellow-900/50">
                  <Info className="h-4 w-4 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-yellow-200">Add native gas</p>
                    <p className="text-yellow-100/80">
                      You need a small amount of the chain’s native token (e.g., ETH) to cover gas fees before confirming this payment.
                    </p>
                  </div>
                </div>
              )}

              {isProcessing ? (
                <div className="w-full bg-[#38C3D8]/50 text-white py-5 flex items-center justify-center gap-2 rounded">
                  <Loader2 className="h-5 w-5 animate-spin" />
                  <span>{processingStep || "Processing..."}</span>
                </div>
              ) : (
                <Button
                  className="w-full bg-[#1B89A4] text-white py-5"
                  onClick={handlePayBill}
                  disabled={!areContractsReady || isProcessing}
                >
                  {!isConversionReady ? (
                    exchangeRateLoading ? "Loading Exchange Rate..." : "Exchange Rate Unavailable"
                  ) : nativeBalanceLoading ? (
                    "Checking Native Balance..."
                  ) : !hasSufficientNativeBalance ? (
                    "Add Gas Funds"
                  ) : !connectedAddress ? (
                    "Connect Wallet"
                  ) : !areContractsReady ? (
                    "Connecting to Wallet..."
                  ) : (
                    "Confirm Payment"
                  )}
                </Button>
              )}

              {txHash && (
                <div className="text-center text-sm">
                  <a 
                    href={getExplorerUrl(chainId, txHash)}
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