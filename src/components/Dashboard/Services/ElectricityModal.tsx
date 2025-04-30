"use client";

import React, { useEffect, useState } from "react";
import { DollarSign, X } from "lucide-react";
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

interface ElectricityModalProps {
  onClose: () => void;
  onShowPayment: (paymentData: {
    provider: string;
    billPlan: string;
    subscriberId: string;
    amountInNaira: string;
    token: string;
    source: "airtime" | "data" | "electricity" | "cable";
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

const ElectricityModal: React.FC<ElectricityModalProps> = ({
  onClose,
  onShowPayment,
  state,
  onStateChange,
}) => {
  const [billers, setBillers] = useState<Biller[]>([]);
  const [billItems, setBillItems] = useState<any[]>([]);
  const [totalAmount, setTotalAmount] = useState("");

  const { getBillersByCategory, getBillItems, getQuote } = useBilloq();

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  useEffect(() => {
    const fetchBillers = async () => {
      try {
        const billers = await getBillersByCategory("UTILITYBILLS");
        setBillers(billers.data);
      } catch (error) {
        console.error("Error fetching billers:", error);
      }
    };

    fetchBillers();
  }, []);

  useEffect(() => {
    const fetchBillItems = async () => {
      if (state.provider) {
        try {
          const biller = billers.find((b) => b.name === state.provider);
          if (biller) {
            const items = await getBillItems("ELECTRICITY", biller.biller_code);
            setBillItems(items.data);
          }
        } catch (error) {
          console.error("Error fetching bill items:", error);
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
    if (!state.provider || !state.accountNumber || !state.billPlan || !state.amount) return;

    const billItem = billItems.find((item) => item.name === state.billPlan);
    try{
      const quote = await getQuote({amount: parseFloat(state.amount) , item_code: billItem.item_code, customer: state.accountNumber});
      console.log("Quote response:", quote);
      setTotalAmount(quote.data.totalAmount);
    } catch (error) {
      console.error("Error fetching quote:", error);
    }

    onShowPayment({
      provider: state.provider,
      billPlan: state.billPlan,
      subscriberId: state.accountNumber,
      amountInNaira: totalAmount,
      token: state.paymentOption,
      source: "electricity",
    });
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
          <h2 className="text-2xl font-medium text-blue-500 mb-8">Electricity Bill Payment</h2>

          <div className="w-full space-y-6">
            <div className="w-full">
              <p className="text-white mb-3">Provider</p>
              <Select
                value={state.provider}
                onValueChange={(value: string) => onStateChange({ ...state, provider: value })}
              >
                <SelectTrigger className="w-full bg-[#1a2236] border-[#3A414A] text-gray-300">
                  <SelectValue placeholder="Select Provider" />
                </SelectTrigger>
                <SelectContent className="bg-[#1a2236] border-[#2a3349] text-gray-300">
                  {billers.map((biller) => (
                    <SelectItem key={biller.biller_code} value={biller.name}>
                      {biller.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="w-full">
              <p className="text-white mb-3">Meter Number</p>
              <Input
                value={state.accountNumber}
                onChange={(e) => onStateChange({ ...state, accountNumber: e.target.value })}
                placeholder="Enter meter number"
                className="w-full p-4 bg-[#1a2236] border border-[#3A414A] rounded-md text-white"
              />
            </div>

            <div className="w-full">
              <p className="text-white mb-3">Account Type</p>
              <Select
                value={state.billPlan}
                onValueChange={(value: string) => onStateChange({ ...state, billPlan: value })}
              >
                <SelectTrigger className="w-full bg-[#1a2236] border-[#3A414A] text-gray-300">
                  <SelectValue placeholder="Select account type" />
                </SelectTrigger>
                <SelectContent className="bg-[#1a2236] border-[#2a3349] text-gray-300">
                  {billItems.map((item) => (
                    <SelectItem key={item.item_code} value={item.name}>
                      {item.name}
                    </SelectItem>
                  ))}
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
                  onChange={(e) => onStateChange({ ...state, amount: e.target.value })}
                  className="w-full p-4 pl-10 bg-[#1a2236] border border-[#3A414A] rounded-md text-white"
                  placeholder="Enter amount"
                />
              </div>
            </div>

            <div className="w-full mb-6">
              <p className="text-white mb-3">Select Payment Option</p>
              <RadioGroup
                value={state.paymentOption}
                onValueChange={(value) =>
                  onStateChange({ ...state, paymentOption: value as "USDT" | "USDC" })
                }
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
            >
              Make Payment
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ElectricityModal;