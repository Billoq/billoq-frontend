"use client";

import React, { useEffect, useState } from "react";
import { X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useBilloq } from "@/hooks/useBilloq";
import { toast } from "react-toastify";

interface ElectricityModalProps {
  onClose: () => void;
  onShowPayment: (paymentData: {
    provider: string;
    billPlan: string;
    subscriberId: string;
    amountInNaira: string;
    token: string;
    source: "airtime" | "data" | "electricity" | "cable";
    quoteId: string;
  }) => void;
  state: {
    provider: string;
    accountNumber: string;
    billPlan: string;
    amount: string;
    paymentOption: "USDT" | "USDC";
  };
  onStateChange: (newState: {
    provider: string;
    accountNumber: string;
    billPlan: string;
    amount: string;
    paymentOption: "USDT" | "USDC";
  }) => void;
}

interface Biller {
  biller_code: string;
  name: string;
}

interface BillItem {
  item_code: string;
  name: string;
  amount?: number;
  [key: string]: unknown; // For any additional properties we don't explicitly define
}

const ElectricityModal: React.FC<ElectricityModalProps> = ({
  onClose,
  onShowPayment,
  state,
  onStateChange,
}) => {
  const [billers, setBillers] = useState<Biller[]>([]);
  const [billItems, setBillItems] = useState<BillItem[]>([]);
  const [isLoadingBillers, setIsLoadingBillers] = useState(false);
  const [isLoadingBillItems, setIsLoadingBillItems] = useState(false);
  const [isLoadingPayment, setIsLoadingPayment] = useState(false);
  const { getBillersByCategory, getBillItems, getQuote } = useBilloq();

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  useEffect(() => {
    const fetchBillers = async () => {
      setIsLoadingBillers(true);
      try {
        const timeout = setTimeout(() => {
          setIsLoadingBillers(false);
          toast.error("Loading providers timed out. Please try again.", {
            position: "bottom-right",
            autoClose: 5000,
            theme: "dark",
          });
        }, 10000); // 10-second timeout

        const billersResponse = await getBillersByCategory("UTILITYBILLS");
        console.log("Billers response:", billersResponse);

        if (!billersResponse?.data || !Array.isArray(billersResponse.data)) {
          throw new Error("Invalid billers data format");
        }

        setBillers(billersResponse.data);
        clearTimeout(timeout);
      } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : "Failed to load providers";
        console.error("Error fetching billers:", errorMessage);
        toast.error(
          errorMessage === "Invalid billers data format"
            ? "Received invalid provider data. Please try again."
            : "Failed to load providers. Please try again.",
          {
            position: "bottom-right",
            autoClose: 5000,
            theme: "dark",
          }
        );
      } finally {
        setIsLoadingBillers(false);
      }
    };

    fetchBillers();
  }, []);

  useEffect(() => {
    const fetchBillItems = async () => {
      if (state.provider) {
        setIsLoadingBillItems(true);
        try {
          const timeout = setTimeout(() => {
            setIsLoadingBillItems(false);
            toast.error("Loading account types timed out. Please try again.", {
              position: "bottom-right",
              autoClose: 5000,
              theme: "dark",
            });
          }, 10000); // 10-second timeout

          const currentBiller = billers.find(
            (biller) => biller.name === state.provider
          );
          if (!currentBiller) {
            throw new Error("Selected provider not found");
          }

          const itemsResponse = await getBillItems("ELECTRICITY", currentBiller.biller_code);
          console.log("Bill items response:", itemsResponse);

          if (!itemsResponse?.data || !Array.isArray(itemsResponse.data)) {
            throw new Error("Invalid bill items data format");
          }

          setBillItems(itemsResponse.data);
          clearTimeout(timeout);
        } catch (error: unknown) {
          const errorMessage = error instanceof Error ? error.message : "Failed to load account types";
          console.error("Error fetching bill items:", errorMessage);
          toast.error(
            errorMessage === "Invalid bill items data format"
              ? "Received invalid account type data. Please try again."
              : errorMessage === "Selected provider not found"
              ? "Selected provider not found. Please choose another."
              : "Failed to load account types. Please try again.",
            {
              position: "bottom-right",
              autoClose: 5000,
              theme: "dark",
            }
          );
        } finally {
          setIsLoadingBillItems(false);
        }
      }
    };

    fetchBillItems();
  }, [state.provider, billers]);

  useEffect(() => {
    document.body.classList.add("overflow-hidden");
    return () => {
      document.body.classList.remove("overflow-hidden");
    };
  }, []);

  const handleMakePayment = async () => {
    // Validate required fields
    if (
      !state.provider ||
      !state.accountNumber ||
      !state.billPlan ||
      !state.amount ||
      !state.paymentOption
    ) {
      toast.error("Please fill in all required fields!", {
        position: "bottom-right",
        autoClose: 5000,
        theme: "dark",
      });
      return;
    }

    // Validate amount
    if (isNaN(parseFloat(state.amount)) || parseFloat(state.amount) <= 0) {
      toast.error("Please enter a valid amount!", {
        position: "bottom-right",
        autoClose: 5000,
        theme: "dark",
      });
      return;
    }

    setIsLoadingPayment(true);
    const billItem = billItems.find((item) => item.name === state.billPlan);

    if (!billItem) {
      toast.error("Selected account type not found", {
        position: "bottom-right",
        autoClose: 5000,
        theme: "dark",
      });
      setIsLoadingPayment(false);
      return;
    }

    try {
      const timeout = setTimeout(() => {
        setIsLoadingPayment(false);
        toast.error("Payment processing timed out. Please try again.", {
          position: "bottom-right",
          autoClose: 5000,
          theme: "dark",
        });
      }, 10000); // 10-second timeout

      const quote = await getQuote({
        amount: parseFloat(state.amount),
        item_code: billItem.item_code,
        customer: state.accountNumber,
      });
      console.log("Quote response:", quote);

      if (!quote?.data || !quote.data.totalAmount || !quote.data._id) {
        throw new Error("Invalid quote data format");
      }

      const totalAmount = quote.data.totalAmount.toString();
      const quoteId = quote.data._id;

      onShowPayment({
        provider: state.provider,
        billPlan: state.billPlan,
        subscriberId: state.accountNumber,
        amountInNaira: totalAmount,
        token: state.paymentOption,
        source: "electricity",
        quoteId: quoteId,
      });

      clearTimeout(timeout);
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "Failed to process payment";
      console.error("Error fetching quote:", errorMessage);
      toast.error(
        errorMessage === "Invalid quote data format"
          ? "Received invalid payment data. Please try again."
          : "Failed to process payment. Please try again.",
        {
          position: "bottom-right",
          autoClose: 5000,
          theme: "dark",
        }
      );
    } finally {
      setIsLoadingPayment(false);
    }
  };

  return (
    <div
      className="fixed inset-0 flex items-start justify-center bg-slate-800/80 z-50 overflow-y-auto py-10"
      onClick={handleOverlayClick}
    >
      <div
        className="relative w-full max-w-xl p-6 border rounded-lg bg-[#0f172a] m-4"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="absolute top-4 right-4 text-gray-400 hover:text-white"
          onClick={onClose}
        >
          <X size={20} />
        </button>

        <div className="flex flex-col items-center">
          <h2 className="text-2xl font-medium text-blue-500 mb-8">
            Electricity Bill Payment
          </h2>

          <div className="w-full space-y-6">
            <div className="w-full">
              <p className="text-white mb-3">Provider</p>
              <Select
                value={state.provider}
                onValueChange={(value: string) =>
                  onStateChange({ ...state, provider: value })
                }
                disabled={isLoadingBillers || isLoadingBillItems || isLoadingPayment}
              >
                <SelectTrigger className="w-full bg-[#1a2236] border-[#3A414A] text-gray-300 relative">
                  <SelectValue placeholder="Select Provider" />
                  {isLoadingBillers && (
                    <Loader2
                      size={20}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 animate-spin"
                    />
                  )}
                </SelectTrigger>
                <SelectContent className="bg-[#1a2236] border-[#2a3349] text-gray-300">
                  {billers.length === 0 ? (
                    <div className="text-gray-500 p-2">No providers available</div>
                  ) : (
                    billers.map((biller) => (
                      <SelectItem key={biller.biller_code} value={biller.name}>
                        {biller.name}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>

            <div className="w-full">
              <p className="text-white mb-3">Meter Number</p>
              <Input
                value={state.accountNumber}
                onChange={(e) =>
                  onStateChange({ ...state, accountNumber: e.target.value })
                }
                placeholder="Enter meter number"
                className="w-full p-4 bg-[#1a2236] border-[#3A414A] rounded-md text-white"
                disabled={isLoadingBillers || isLoadingBillItems || isLoadingPayment}
              />
            </div>

            <div className="w-full">
              <p className="text-white mb-3">Account Type</p>
              <Select
                value={state.billPlan}
                onValueChange={(value: string) =>
                  onStateChange({ ...state, billPlan: value })
                }
                disabled={isLoadingBillers || isLoadingBillItems || isLoadingPayment}
              >
                <SelectTrigger className="w-full bg-[#1a2236] border-[#3A414A] text-gray-300 relative">
                  <SelectValue placeholder="Select account type" />
                  {isLoadingBillItems && (
                    <Loader2
                      size={20}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 animate-spin"
                    />
                  )}
                </SelectTrigger>
                <SelectContent className="bg-[#1a2236] border-[#2a3349] text-gray-300">
                  {billItems.length === 0 ? (
                    <div className="text-gray-500 p-2">No account types available</div>
                  ) : (
                    billItems.map((item) => (
                      <SelectItem key={item.item_code} value={item.name}>
                        {item.name}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>

            <div className="w-full">
              <p className="text-white mb-3">Enter the amount you want</p>
              <div className="relative">
                <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                  ₦
                </div>
                <Input
                  value={state.amount}
                  onChange={(e) =>
                    onStateChange({ ...state, amount: e.target.value })
                  }
                  className="w-full p-4 pl-10 bg-[#1a2236] border-[#3A414A] rounded-md text-white"
                  placeholder="Enter amount"
                  disabled={isLoadingBillers || isLoadingBillItems || isLoadingPayment}
                />
              </div>
            </div>

            <div className="w-full mb-6">
              <p className="text-white mb-3">Select Payment Option</p>
              <RadioGroup
                value={state.paymentOption}
                onValueChange={(value) =>
                  onStateChange({
                    ...state,
                    paymentOption: value as "USDT" | "USDC",
                  })
                }
                disabled={isLoadingBillers || isLoadingBillItems || isLoadingPayment}
                className="flex flex-col space-y-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem
                    value="USDT"
                    id="USDT"
                    className="border-gray-500 text-[#0080FF]"
                  />
                  <Label htmlFor="USDT" className="text-white">
                    USDT
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem
                    value="USDC"
                    id="USDC"
                    className="border-gray-500 text-[#0080FF]"
                  />
                  <Label htmlFor="USDC" className="text-white">
                    USDC
                  </Label>
                </div>
              </RadioGroup>
            </div>

            <Button
              className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-medium"
              onClick={handleMakePayment}
              disabled={isLoadingBillers || isLoadingBillItems || isLoadingPayment}
            >
              {isLoadingPayment ? "Processing..." : "Make Payment"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ElectricityModal;