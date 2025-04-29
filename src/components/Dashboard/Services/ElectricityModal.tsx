"use client";

import { useState, useEffect } from "react";
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

interface ElectricityModalProps {
  onClose: () => void;
  onShowPayment: (paymentData: {
    provider: string;
    accountType: string;
    amountInNaira: string;
    token: string;
    source: "airtime" | "data" | "electricity" | "cable";
  }) => void;
}

const ElectricityModal: React.FC<ElectricityModalProps> = ({ onClose, onShowPayment }) => {
  const [provider, setProvider] = useState("National Grid");
  const [accountNumber, setAccountNumber] = useState("");
  const [accountType, setAccountType] = useState("National Grid");
  const [amount, setAmount] = useState("");
  const [paymentOption, setPaymentOption] = useState("USDT");

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    // Only close if the click is directly on the overlay, not its children
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

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
      accountType,
      amountInNaira: amount,
      token: paymentOption,
      source: "electricity" // Add source to identify this modal
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
            Electricity Bill Payment
          </h2>

          <div className="w-full space-y-6">
            <div className="w-full">
              <p className="text-white mb-3">Provider</p>
              <Select value={provider} onValueChange={setProvider}>
                <SelectTrigger className="w-full bg-[#1a2236] border-[#3A414A] text-gray-300">
                  <SelectValue placeholder="Select provider" />
                </SelectTrigger>
                <SelectContent className="bg-[#1a2236] border-[#2a3349] text-gray-300">
                  <SelectItem value="National Grid">National Grid</SelectItem>
                  <SelectItem value="EDF Energy">EDF Energy</SelectItem>
                  <SelectItem value="British Gas">British Gas</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="w-full">
              <p className="text-white mb-3">Meter Number</p>
              <Input
                value={accountNumber}
                onChange={(e) => setAccountNumber(e.target.value)}
                placeholder="Enter meter number"
                className="w-full p-4 bg-[#1a2236] border border-[#3A414A] rounded-md text-white"
              />
            </div>

            <div className="w-full">
              <p className="text-white mb-3">Account Type</p>
              <Select value={accountType} onValueChange={setAccountType}>
                <SelectTrigger className="w-full bg-[#1a2236] border-[#3A414A] text-gray-300">
                  <SelectValue placeholder="Select account type" />
                </SelectTrigger>
                <SelectContent className="bg-[#1a2236] border-[#2a3349] text-gray-300">
                  <SelectItem value="National Grid">Standard</SelectItem>
                  <SelectItem value="Prepayment">Prepayment</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="w-full">
              <p className="text-white mb-3">Enter the amount you want</p>
              <div className="relative">
                <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                  <DollarSign className="h-4 w-4" />
                </div>
                <Input
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full p-4 pl-10 bg-[#1a2236] border border-[#3A414A] rounded-md text-white"
                  placeholder="Enter amount"
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

export default ElectricityModal;