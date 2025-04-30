"use client";

import { useState, useEffect, use } from "react";
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

interface CableModalProps {
  onClose: () => void;
  onShowPayment: (paymentData: {
    provider: string;
    billPlan: string;
    subscriberId: string;
    amountInNaira: string;
    token: string;
    source: "airtime" | "data" | "electricity" | "cable";
  }) => void;
}

const CableModal: React.FC<CableModalProps> = ({ onClose, onShowPayment }) => {
  const [provider, setProvider] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [billItem, setBillItem] = useState("");
  const [amount, setAmount] = useState("");
  const [paymentOption, setPaymentOption] = useState("USDT");
  const [billers, setBillers] = useState<any[]>([]);
  const [billItems, setBillItems] = useState<any[]>([]);

  const { getBillersByCategory, getBillItems, validateCustomerDetails } = useBilloq();
  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    // Only close if the click is directly on the overlay, not its children
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  useEffect(() => {
    // Fetch billers by category when the component mounts
    const fetchBillers = async () => {
      try {
        const billers = await getBillersByCategory("CABLEBILLS");
        console.log("Fetched billers:", billers);
        setBillers(billers.data);
      } catch (error) {
        console.error("Error fetching billers:", error);
      }
    };

    fetchBillers();
  }, []);

  useEffect(() => {
    // Fetch bill items when the provider changes
    const fetchBillItems = async () => {
      if (provider) {
        try {
          const currentBiller = billers.find((biller) => biller.name === provider);
          const items = await getBillItems("CABLE", currentBiller.biller_code);
          console.log("Fetched bill items:", items);
          setBillItems(items.data);
        } catch (error) {
          console.error("Error fetching bill items:", error);
        }
      }
    };

    fetchBillItems();
  }, [provider]);

  useEffect(() => {
    //set the amount based on the selected bill item
    const selectedBillItem = billItems.find((item) => item.name === billItem);
    if (selectedBillItem) {
      setAmount(selectedBillItem.amount);
    }
  }, [billItem, billItems]);

  useEffect(() => {
    document.body.classList.add("overflow-hidden");
    return () => {
      document.body.classList.remove("overflow-hidden");
    };
  }, []);

  const handleMakePayment = () => {
    // Pass the payment data to the parent component with source information
    onShowPayment({
      provider,
      billPlan: billItem,
      subscriberId: accountNumber,
      amountInNaira: amount,
      token: paymentOption,
      source: "cable" // Add source to identify this modal
    });
    onClose();
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
            Cable Service
          </h2>

          <div className="w-full space-y-6">
            <div className="w-full">
              <p className="text-white mb-3">Provider</p>
              <Select value={provider} onValueChange={setProvider}>
                <SelectTrigger className="w-full bg-[#1a2236] border-[#3A414A] text-gray-300">
                  <SelectValue placeholder="Select provider" />
                </SelectTrigger>
                <SelectContent className="bg-[#1a2236] border-[#2a3349] text-gray-300">
                  {billers.map((item) => (
                    <SelectItem key={item.biller_code} value={item.name}>
                      {item.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="w-full">
              <p className="text-white mb-3">Smart Card Number</p>
              <Input
                value={accountNumber}
                onChange={(e) => setAccountNumber(e.target.value)}
                placeholder="XXX XXXX XXXX"
                className="w-full p-4 bg-[#1a2236] border border-[#3A414A] rounded-md text-white"
              />
            </div>

            <div className="w-full">
              <p className="text-white mb-3">Plan</p>
              <Select value={billItem} onValueChange={setBillItem}>
                <SelectTrigger className="w-full bg-[#1a2236] border-[#3A414A] text-gray-300">
                  <SelectValue placeholder="Select plan" />
                </SelectTrigger>
                <SelectContent className="bg-[#1a2236] border-[#2a3349] text-gray-300">
                  {billItems.map((item) => (
                    <SelectItem key={item.id} value={item.name}>
                      {item.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="w-full">
              <p className="text-white mb-3">Amount</p>
              <div className="relative">
                <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                  ₦
                </div>
                <Input
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  disabled
                  className="w-full p-4 pl-10 bg-[#1a2236] border border-[#3A414A] rounded-md text-white"
                  placeholder="Bill Amount"
                />
              </div>
            </div>

            <div className="w-full mb-6">
              <p className="text-white mb-3">Select Payment Option</p>
              <RadioGroup
                value={paymentOption}
                onValueChange={setPaymentOption}
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
            <div>
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
    </div>
  );
};

export default CableModal;