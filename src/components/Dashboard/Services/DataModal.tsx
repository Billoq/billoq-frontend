"use client";

import { useEffect, useState } from "react";
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
}

const DataModal = ({ onClose, onShowPayment }: DataModalProps) => {
  const [selectedNetwork, setSelectedNetwork] = useState<string | null>(null);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [amount, setAmount] = useState("");
  const [paymentOption, setPaymentOption] = useState<"USDT" | "USDC">("USDT");
  const [billers, setBillers] = useState<any[]>([]); // Adjust type as needed
  const [billItems, setBillItems] = useState<any[]>([]); // Adjust type as needed
  const [billPlan, setBillPlan] = useState("");

  const { getBillersByCategory, getBillItems, validateCustomerDetails } = useBilloq();

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
      if (selectedNetwork) {
          try {
            const selectedBiller = billers.find((biller) => biller.name === selectedNetwork);
            const currentBillItems = await getBillItems("MOBILE", selectedBiller.biller_code)
            console.log("Fetched Bill items:", currentBillItems)
            setBillItems(currentBillItems.data);
          } catch (error) {
            console.error("Error fetching bill plans:", error);
          }
      }
    };

    fetchBillItems();
  }, [selectedNetwork, billers]);

  useEffect(() => {
    //set the amount based on the selected bill item
    const selectedBillItem = billItems.find((item) => item.name === billPlan);
    if (selectedBillItem) {
      setAmount(selectedBillItem.amount);
    }
  }, [billPlan, billItems, billers]);

  const handlePayment = () => {
    if (!selectedNetwork || !phoneNumber || !amount || !billPlan) return;
    
    onShowPayment({
      provider: `${selectedNetwork.toUpperCase()}`,
      billPlan: billPlan,
      subscriberId: phoneNumber,
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
            {billers.map((biller) => {
                const network = networks.find((net) => net.id.includes(biller.name.split(" ")[0]));
                return (
                  <button
                  key={biller.biller_code}
                  className={`p-2 border cursor-pointer rounded-md ${
                    selectedNetwork === biller.name ? "border-[#0080FF]" : "border-[#3A414A]"
                  }`}
                  onClick={() => setSelectedNetwork(biller.name)}
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
            <select
              className="w-full p-4 bg-[#0D1526] border border-[#3A414A] rounded-md text-gray-500 mb-3"
              value={billPlan}
              onChange={(e) => setBillPlan(e.target.value)}
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
            <p className="text-white mb-3">Amount</p>
            <div className="relative">
              <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white">
                ₦
              </div>
              <input
                type="text"
                className="w-full p-4 pl-8 bg-[#0D1526] border border-[#3A414A] rounded-md text-white"
                placeholder="Data Amount"
                disabled
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