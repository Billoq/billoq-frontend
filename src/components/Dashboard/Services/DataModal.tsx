"use client";

import { useState } from "react";
import { X } from "lucide-react";
import networks from "./NetWork";

interface DataModalProps {
  onClose: () => void;
  onShowPayment: (data: {
    provider: string;
    accountType: string;
    amountInNaira: string;
    token: string;
    source: "airtime" | "data" | "electricity" | "cable";
  }) => void;
}

const DataModal = ({ onClose, onShowPayment }: DataModalProps) => {
  const [selectedNetwork, setSelectedNetwork] = useState<string | null>(null);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [amount, setAmount] = useState("");
  const [paymentOption, setPaymentOption] = useState<"USDT" | "USDC">("USDT");
  const [selectedProduct, setSelectedProduct] = useState<string>("");

  const handlePayment = () => {
    if (!selectedNetwork || !phoneNumber || !amount || !selectedProduct) return;
    
    onShowPayment({
      provider: `${selectedNetwork.toUpperCase()} ${selectedProduct}`,
      accountType: phoneNumber,
      amountInNaira: amount,
      token: paymentOption,
      source: "data"
    });
  }; // This closing brace was missing

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    // Only close if the click is directly on the overlay, not its children
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-slate-800/80 bg-opacity-50 z-50"
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
          <h2 className="text-2xl font-medium text-[#0080FF] mb-8">
            Mobile Data
          </h2>

          <div className="w-full mb-6">
            <p className="text-white mb-3">Select network provider</p>
            <div className="flex gap-2">
              {networks.map((network) => (
                <button
                  key={network.id}
                  className={`p-2 border rounded-md ${
                    selectedNetwork === network.id
                      ? "border-[#0080FF]"
                      : "border-[#3A414A]"
                  }`}
                  onClick={() => setSelectedNetwork(network.id)}
                >
                  <div
                    className="w-10 h-10 flex items-center justify-center rounded-md"
                    style={{ backgroundColor: network.color }}
                  >
                    {network.id === "mtn" && (
                      <span className="text-black font-bold text-xs">MTN</span>
                    )}
                    {network.id === "airtel" && (
                      <span className="text-white font-bold text-xs">
                        airtel
                      </span>
                    )}
                    {network.id === "glo" && (
                      <span className="text-white font-bold text-xs">glo</span>
                    )}
                    {network.id === "9mobile" && (
                      <span className="text-[#00AA4F] font-bold text-lg">
                        9
                      </span>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="w-full mb-6">
            <select
              className="w-full p-4 bg-[#0D1526] border border-[#3A414A] rounded-md text-gray-500 mb-3"
              value={selectedProduct}
              onChange={(e) => setSelectedProduct(e.target.value)}
            >
              <option value="" disabled hidden>
                Products
              </option>
              <option value="airtime">Airtime</option>
              <option value="data">Data</option>
              <option value="electricity">Electricity</option>
              <option value="tv">TV Subscription</option>
              <option value="betting">Betting</option>
            </select>
            <p className="text-white mb-3">Enter your phone number</p>
            <input
              type="text"
              className="w-full p-4 bg-[#0D1526] border border-[#3A414A] rounded-md text-white"
              placeholder="XXX XXXX XXXX"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
            />
          </div>

          <div className="w-full mb-6">
            <p className="text-white mb-3">Enter the amount you want</p>
            <div className="relative">
              <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white">
                ₦
              </div>
              <input
                type="text"
                className="w-full p-4 pl-8 bg-[#0D1526] border border-[#3A414A] rounded-md text-white"
                placeholder="Enter amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
            </div>
          </div>

          <div className="w-full mb-8">
            <p className="text-white mb-3">Select Payment Option</p>
            <div className="space-y-2">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="radio"
                  checked={paymentOption === "USDT"}
                  onChange={() => setPaymentOption("USDT")}
                  className="form-radio text-[#0080FF]"
                />
                <span className="text-white">USDT</span>
              </label>
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="radio"
                  checked={paymentOption === "USDC"}
                  onChange={() => setPaymentOption("USDC")}
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