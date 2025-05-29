"use client";

import React, { useEffect, useState } from "react";
import { X, Loader2 } from "lucide-react";
import networks from "./NetWork";
import { useBilloq } from "@/hooks/useBilloq";
import { toast } from "react-toastify";

interface AirtimePaymentProps {
  onClose: () => void;
  onShowPayment: (data: {
    provider: string;
    billPlan: string;
    subscriberId: string;
    amountInNaira: string;
    token: string;
    source: "airtime" | "data" | "electricity" | "cable";
    quoteId: string;
  }) => void;
  state: {
    selectedNetwork: string;
    phoneNumber: string;
    amount: string;
    totalAmount: string;
    billPlan: string;
    paymentOption: "USDT" | "USDC";
  };
  onStateChange: (newState: {
    selectedNetwork: string;
    phoneNumber: string;
    amount: string;
    totalAmount: string;
    billPlan: string;
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
  [key: string]: unknown; // For any additional properties we don't know about
}

const AirtimePaymentModal = ({ onClose, onShowPayment, state, onStateChange }: AirtimePaymentProps) => {
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

        const billersResponse = await getBillersByCategory("AIRTIME");
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
      if (state.selectedNetwork) {
        setIsLoadingBillItems(true);
        try {
          const timeout = setTimeout(() => {
            setIsLoadingBillItems(false);
            toast.error("Loading plans timed out. Please try again.", {
              position: "bottom-right",
              autoClose: 5000,
              theme: "dark",
            });
          }, 10000); // 10-second timeout

          const currentBiller = billers.find((biller) => biller.name === state.selectedNetwork);
          if (!currentBiller) {
            throw new Error("Selected provider not found");
          }

          const itemsResponse = await getBillItems("AIRTIME", currentBiller.biller_code);
          console.log("Bill items response:", itemsResponse);

          if (!itemsResponse?.data || !Array.isArray(itemsResponse.data)) {
            throw new Error("Invalid bill items data format");
          }

          setBillItems(itemsResponse.data);
          if (itemsResponse.data.length > 0) {
            onStateChange({ ...state, billPlan: itemsResponse.data[itemsResponse.data.length < 2 ? 0 : 2].name });
          }

          clearTimeout(timeout);
        } catch (error: unknown) {
          const errorMessage = error instanceof Error ? error.message : "Failed to load plans";
          console.error("Error fetching bill items:", errorMessage);
          toast.error(
            errorMessage === "Invalid bill items data format"
              ? "Received invalid plan data. Please try again."
              : errorMessage === "Selected provider not found"
              ? "Selected provider not found. Please choose another."
              : "Failed to load plans. Please try again.",
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
  }, [state.selectedNetwork, billers]);

  useEffect(() => {
    document.body.classList.add("overflow-hidden");
    return () => {
      document.body.classList.remove("overflow-hidden");
    };
  }, []);

  const handlePayment = async () => {
    // Validate required fields
    if (
      !state.selectedNetwork ||
      !state.phoneNumber ||
      !state.amount ||
      !state.billPlan ||
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
      toast.error("Selected plan not found", {
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
        customer: state.phoneNumber,
      });
      console.log("Quote response:", quote);

      if (!quote?.data || !quote.data.totalAmount || !quote.data._id) {
        throw new Error("Invalid quote data format");
      }

      const totalAmount = quote.data.totalAmount.toString();
      const quoteId = quote.data._id;

      onShowPayment({
        provider: state.selectedNetwork.toUpperCase(),
        billPlan: state.billPlan,
        subscriberId: state.phoneNumber,
        amountInNaira: totalAmount,
        token: state.paymentOption,
        source: "airtime",
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
      className="fixed inset-0 flex items-center justify-center bg-slate-800/80 p-4 z-50"
      onClick={handleOverlayClick}
    >
      <div
        className="relative w-full max-w-xl p-6 border border-[#111C2F] rounded-lg bg-[#0D1526]"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="absolute top-4 right-4 text-gray-400 hover:text-white"
          onClick={onClose}
        >
          <X size={20} />
        </button>

        <div className="flex flex-col items-center">
          <h2 className="text-2xl font-medium text-[#38C3D8] mb-8">Airtime</h2>

          <div className="w-full mb-6">
            <p className="text-white mb-3">Select network provider</p>
            <div className="flex gap-2 relative">
              {isLoadingBillers && (
                <Loader2
                  size={20}
                  className="absolute right-0 top-0 text-gray-400 animate-spin"
                />
              )}
              {billers.length === 0 && !isLoadingBillers ? (
                <div className="text-gray-500">No providers available</div>
              ) : (
                billers.map((biller) => {
                  const network = networks.find((net) => net.id === biller.name);
                  return (
                    <button
                      key={biller.biller_code}
                      className={`p-2 border rounded-md ${
                        state.selectedNetwork === biller.name
                          ? "border-[#38C3D8]"
                          : "border-[#3A414A]"
                      }`}
                      onClick={() => onStateChange({ ...state, selectedNetwork: biller.name })}
                      disabled={isLoadingBillers || isLoadingBillItems || isLoadingPayment}
                    >
                      <div
                        className="w-10 h-10 flex items-center justify-center rounded-md"
                        style={{ backgroundColor: network?.color || "#3A414A" }}
                      >
                        {network?.id === "MTN Nigeria" && (
                          <span className="text-black font-bold text-xs">MTN</span>
                        )}
                        {network?.id === "AIRTEL NIGERIA" && (
                          <span className="text-white font-bold text-xs">airtel</span>
                        )}
                        {network?.id === "GLO NIGERIA" && (
                          <span className="text-white font-bold text-xs">glo</span>
                        )}
                        {network?.id === "9MOBILE NIGERIA" && (
                          <span className="text-[#00AA4F] font-bold text-lg">9</span>
                        )}
                      </div>
                    </button>
                  );
                })
              )}
            </div>
          </div>

          <div className="w-full mb-6">
            <p className="text-white mb-3">Enter your phone number</p>
            <input
              type="text"
              className="w-full p-4 bg-[#0D1526] border border-[#3A414A] rounded-md text-white"
              placeholder="XXX XXXX XXXX"
              value={state.phoneNumber}
              onChange={(e) => onStateChange({ ...state, phoneNumber: e.target.value })}
              disabled={isLoadingBillers || isLoadingBillItems || isLoadingPayment}
            />
          </div>

          <div className="w-full mb-6">
            <p className="text-white mb-3">Enter the amount you want</p>
            <div className="relative">
              <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white">₦</div>
              <input
                type="text"
                className="w-full p-4 pl-8 bg-[#0D1526] border border-[#3A414A] rounded-md text-white"
                placeholder="Enter amount"
                value={state.amount}
                onChange={(e) => onStateChange({ ...state, amount: e.target.value })}
                disabled={isLoadingBillers || isLoadingBillItems || isLoadingPayment}
              />
            </div>
          </div>

          <div className="w-full mb-8">
            <p className="text-white mb-3">Select Payment Option</p>
            <div className="space-y-2">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="radio"
                  checked={state.paymentOption === "USDT"}
                  onChange={() => onStateChange({ ...state, paymentOption: "USDT" })}
                  className="form-radio text-[#38C3D8]"
                  disabled={isLoadingBillers || isLoadingBillItems || isLoadingPayment}
                />
                <span className="text-white">USDT</span>
              </label>
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="radio"
                  checked={state.paymentOption === "USDC"}
                  onChange={() => onStateChange({ ...state, paymentOption: "USDC" })}
                  className="form-radio text-[#38C3D8]"
                  disabled={isLoadingBillers || isLoadingBillItems || isLoadingPayment}
                />
                <span className="text-white">USDC</span>
              </label>
            </div>
          </div>

          <button
            className="w-full py-4 bg-[#38C3D8] text-white rounded-md font-medium disabled:bg-gray-500"
            onClick={handlePayment}
            disabled={isLoadingBillers || isLoadingBillItems || isLoadingPayment}
          >
            {isLoadingPayment ? "Processing..." : "Make Payment"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AirtimePaymentModal;