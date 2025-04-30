"use client";

import { useEffect, useState } from "react";
import React from "react";
import { X } from "lucide-react";
import networks from "./NetWork";
import { useBilloq } from "@/hooks/useBilloq";

interface DataModalProps {
  onClose: () => void;
  onShowPayment: (data: {
    provider: string;
    billPlan: string;
    subscriberId: string;
    amountInNaira: string;
    token: string;
    source: "airtime" | "data" | "electricity" | "cable";
  }) => void;
  state: {
    selectedNetwork: string;
    billPlan: string;
    phoneNumber: string;
    amount: string;
    paymentOption: "USDT" | "USDC";
  };
  onStateChange: (newState: {
    selectedNetwork: string;
    phoneNumber: string;
    amount: string;
    paymentOption: "USDT" | "USDC";
    billPlan: string;
  }) => void;
}

const DataModal = ({ onClose, onShowPayment, state, onStateChange }: DataModalProps) => {
  const [selectedNetwork, setSelectedNetwork] = useState<string | null>(null);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [totalAmount, setTotalAmount] = useState("");
  const [paymentOption, setPaymentOption] = useState<"USDT" | "USDC">("USDT");
  const [billers, setBillers] = useState<any[]>([]); // Adjust type as needed
  const [billItems, setBillItems] = useState<any[]>([]); // Adjust type as needed
  const [billPlan, setBillPlan] = useState("");

  const { getBillersByCategory, getBillItems, validateCustomerDetails, getQuote } = useBilloq();

  useEffect(() => {
    // Fetch billers by category when the component mounts
    const fetchBillers = async () => {
      try {
        const billers = await getBillersByCategory("MOBILEDATA");
        console.log("Fetched billers:", billers);
        setBillers(billers.data);
      } catch (error) {
        console.error("Error fetching billers:", error);
      }
    };

    fetchBillers();
  }, []);

  useEffect(() => {
    const fetchBillItems = async () => {
      if (state.selectedNetwork) {
          try {
            const selectedBiller = billers.find((biller) => biller.name === state.selectedNetwork);
            const currentBillItems = await getBillItems("MOBILE", selectedBiller.biller_code)
            console.log("Fetched Bill items:", currentBillItems)
            setBillItems(currentBillItems.data);
          } catch (error) {
            console.error("Error fetching bill plans:", error);
          }
      }
    };

    fetchBillItems();
  }, [state.selectedNetwork, billers]);

  useEffect(() => {
    //set the amount based on the selected bill item
    const selectedBillItem = billItems.find((item) => item.name === state.billPlan);
    if (selectedBillItem) {
      onStateChange({ ...state, amount: selectedBillItem.amount })
    }
  }, [state.billPlan, billItems, billers]);

  const handlePayment = async () => {
    if (!state.selectedNetwork || !state.phoneNumber || !state.amount || !state.billPlan) return;

    const billItem = billItems.find((item) => item.name === state.billPlan);
    try{
      const quote = await getQuote({amount: parseFloat(state.amount) , item_code: billItem.item_code, customer: state.phoneNumber});
      console.log("Quote response:", quote);
      setTotalAmount(quote.data.totalAmount);
    } catch (error) {
      console.error("Error fetching quote:", error);
    }

    onShowPayment({
      provider: `${state.selectedNetwork.toUpperCase()}`,
      billPlan: state.billPlan,
      subscriberId: state.phoneNumber,
      amountInNaira: totalAmount,
      token: state.paymentOption,
      source: "data"
    });
  };

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
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
          <h2 className="text-2xl font-medium text-[#0080FF] mb-8">Mobile Data</h2>

          <div className="w-full mb-6">
            <p className="text-white mb-3">Select network provider</p>
            <div className="flex gap-2">
            {billers.map((biller) => {
                const network = networks.find((net) => net.id.includes(biller.name.split(" ")[0]));
                return (
                  <button
                  key={biller.biller_code}
                  className={`p-2 border cursor-pointer rounded-md ${
                    state.selectedNetwork === biller.name ? "border-[#0080FF]" : "border-[#3A414A]"
                  }`}
                  onClick={() => onStateChange({ ...state, selectedNetwork: biller.name })}
                  >
                  <div
                    className="w-10 h-10 flex items-center justify-center rounded-md"
                    style={{ backgroundColor: network?.color || "#3A414A" }}
                  >
                    {network?.id === "MTN Nigeria" && <span className="text-black font-bold text-xs">MTN</span>}
                    {network?.id === "AIRTEL NIGERIA" && <span className="text-white font-bold text-xs">airtel</span>}
                    {network?.id === "GLO NIGERIA" && <span className="text-white font-bold text-xs">glo</span>}
                    {network?.id === "9MOBILE NIGERIA" && <span className="text-[#00AA4F] font-bold text-lg">9</span>}
                  </div>
                  </button>
                );
                })}
            </div>
          </div>

          <div className="w-full mb-6">
            <p className="text-white mb-3">Select product</p>
            <select
              className="w-full p-4 bg-[#0D1526] border border-[#3A414A] rounded-md text-white"
              value={state.billPlan}
              onChange={(e) => onStateChange({ ...state, billPlan: e.target.value })}
            >
              <option value="" disabled hidden>
              Select Plan
              </option>
              {billItems.map((item) => (
              <option key={item.item_code} value={item.name}>
                {item.name}
              </option>
              ))}
            </select>
          </div>

          <div className="w-full mb-6">
            <p className="text-white mb-3">Enter your phone number</p>
            <input
              type="text"
              className="w-full p-4 bg-[#0D1526] border border-[#3A414A] rounded-md text-white"
              placeholder="XXX XXXX XXXX"
              value={state.phoneNumber}
              onChange={(e) => onStateChange({ ...state, phoneNumber: e.target.value })}
            />
          </div>

          <div className="w-full mb-6">
            <p className="text-white mb-3">Amount</p>
            <div className="relative">
              <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white">₦</div>
              <input
                type="text"
                className="w-full p-4 pl-8 bg-[#0D1526] border border-[#3A414A] rounded-md text-white"
                placeholder="Data Amount"
                disabled
                value={state.amount}
                onChange={(e) => onStateChange({ ...state, amount: e.target.value })}
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
                  className="form-radio text-[#0080FF]"
                />
                <span className="text-white">USDT</span>
              </label>
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="radio"
                  checked={state.paymentOption === "USDC"}
                  onChange={() => onStateChange({ ...state, paymentOption: "USDC" })}
                  className="form-radio text-[#0080FF]"
                />
                <span className="text-white">USDC</span>
              </label>
            </div>
          </div>

          <button
            className="w-full py-4 bg-[#0080FF] text-white rounded-md font-medium"
            onClick={handlePayment}
          >
            Make Payment
          </button>
        </div>
      </div>
    </div>
  );
};

export default DataModal;