"use client";

import React, { useState } from "react";
import {
  Book,
  FileText,
  Flame,
  Globe,
  Lightbulb,
  Smartphone,
  Tv,
  Video,
  Droplet,
} from "lucide-react";
import ServiceItem from "./ServiceItems";
import AirtimePaymentModal from "./AirtimePaymentModal";
import DataModal from "./DataModal";
import ElectricityModal from "./ElectricityModal";
import CableModal from "./CableModal";
import PaymentModal from "./PaymentModal";

interface PaymentData {
  provider: string;
  billPlan: string;
  subscriberId: string;
  amountInNaira: string;
  token: string;
  source: "airtime" | "data" | "electricity" | "cable";
}

const DashboardServices = () => {
  // Modal visibility states
  const [showAirtimePaymentModal, setShowAirtimePaymentModal] = useState(false);
  const [showDataModal, setShowDataModal] = useState(false);
  const [showElectricityModal, setShowElectricityModal] = useState(false);
  const [showCableModal, setShowCableModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  // State preservation for each modal
  const [airtimeState, setAirtimeState] = useState({
    selectedNetwork: "",
    phoneNumber: "",
    amount: "",
    billPlan: "",
    paymentOption: "USDT" as "USDT" | "USDC",
  });

  const [dataState, setDataState] = useState({
    selectedNetwork: "",
    phoneNumber: "",
    amount: "",
    paymentOption: "USDT" as "USDT" | "USDC",
    billPlan: "",
  });

  const [electricityState, setElectricityState] = useState({
    provider: "",
    accountNumber: "",
    billPlan: "",
    amount: "",
    paymentOption: "USDT" as "USDT" | "USDC",
  });

  const [cableState, setCableState] = useState({
    provider: "",
    accountNumber: "",
    billItem: "",
    amount: "",
    paymentOption: "USDT" as "USDT" | "USDC",
  });

  const [paymentData, setPaymentData] = useState<PaymentData>({
    provider: "",
    billPlan: "",
    subscriberId: "",
    amountInNaira: "",
    token: "",
    source: "airtime",
  });

  const handleServiceSelect = (service: string) => {
    switch (service) {
      case "Mobile Recharge":
        setShowAirtimePaymentModal(true);
        break;
      case "Internet":
        setShowDataModal(true);
        break;
      case "Electricity":
        setShowElectricityModal(true);
        break;
      case "Cable TV":
        setShowCableModal(true);
        break;
      default:
        console.log(`Service ${service} not implemented`);
    }
  };

  const handleShowPayment = (data: PaymentData) => {
    setPaymentData(data);
    // Hide all service modals but keep them mounted
    setShowAirtimePaymentModal(false);
    setShowDataModal(false);
    setShowElectricityModal(false);
    setShowCableModal(false);
    // Show payment modal
    setShowPaymentModal(true);
  };

  const handleBackToModal = () => {
    setShowPaymentModal(false);
    // Re-show the appropriate service modal based on source
    switch (paymentData.source) {
      case "airtime":
        setShowAirtimePaymentModal(true);
        break;
      case "data":
        setShowDataModal(true);
        break;
      case "electricity":
        setShowElectricityModal(true);
        break;
      case "cable":
        setShowCableModal(true);
        break;
    }
  };

  const handleClosePaymentModal = () => {
    setShowPaymentModal(false);
    // Reset modal states when fully closing the payment modal
    setAirtimeState({ selectedNetwork: "", phoneNumber: "", amount: "", billPlan: "", paymentOption: "USDT" });
    setDataState({
      selectedNetwork: "",
      phoneNumber: "",
      amount: "",
      paymentOption: "USDT",
      billPlan: "",
    });
    setElectricityState({
      provider: "",
      accountNumber: "",
      billPlan: "",
      amount: "",
      paymentOption: "USDT",
    });
    setCableState({
      provider: "",
      accountNumber: "",
      billItem: "",
      amount: "",
      paymentOption: "USDT",
    });
    setPaymentData({
      provider: "",
      billPlan: "",
      subscriberId: "",
      amountInNaira: "",
      token: "",
      source: "airtime",
    });
  };

  const handleCloseAirtimeModal = () => {
    setShowAirtimePaymentModal(false);
    setAirtimeState({ selectedNetwork: "", phoneNumber: "", amount: "", paymentOption: "USDT", billPlan: "" });
  };

  const handleCloseDataModal = () => {
    setShowDataModal(false);
    setDataState({
      selectedNetwork: "",
      phoneNumber: "",
      amount: "",
      paymentOption: "USDT",
      billPlan: "",
    });
  };

  const handleCloseElectricityModal = () => {
    setShowElectricityModal(false);
    setElectricityState({
      provider: "",
      accountNumber: "",
      billPlan: "",
      amount: "",
      paymentOption: "USDT",
    });
  };

  const handleCloseCableModal = () => {
    setShowCableModal(false);
    setCableState({
      provider: "",
      accountNumber: "",
      billItem: "",
      amount: "",
      paymentOption: "USDT",
    });
  };

  return (
    <div className="min-h-screen bg-[#111827] text-white p-4">
      <div className="max-w-3xl ml-6">
        <p className="text-sm mb-6">View all our services and pay your bill easily</p>

        <div className="bg-[#1e2837] rounded-xl p-6 shadow-lg">
          {/* Mobile Services Section */}
          <div className="mb-8 w-[201px] h-[150px]">
            <h2 className="text-lg pl-9 font-medium mb-4">Mobile Services</h2>
            <div className="flex flex-row justify-center pl-9">
              <ServiceItem
                icon={<Smartphone className="h-8 w-8" />}
                label="Mobile Recharge"
                onSelect={() => handleServiceSelect("Mobile Recharge")}
              />
              <ServiceItem
                icon={<Globe className="h-8 w-8" />}
                label="Internet"
                onSelect={() => handleServiceSelect("Internet")}
              />
            </div>
          </div>

          {/* Bill Payment Section */}
          <div>
            <h2 className="text-lg pl-10 font-medium mb-4">Bill Payment</h2>
            <div className="flex flex-wrap pl-9">
              <ServiceItem
                icon={<Lightbulb className="h-8 w-8" />}
                label="Electricity"
                onSelect={() => handleServiceSelect("Electricity")}
              />
              <ServiceItem
                icon={<Tv className="h-8 w-8" />}
                label="Cable TV"
                onSelect={() => handleServiceSelect("Cable TV")}
              />
              <ServiceItem
                icon={<Droplet className="h-8 w-8" />}
                label="Water bill"
                onSelect={() => handleServiceSelect("Water bill")}
              />
              <ServiceItem
                icon={<Flame className="h-8 w-8" />}
                label="Gas bill"
                onSelect={() => handleServiceSelect("Gas bill")}
              />

              {/* Force new row */}
              <div className="basis-full" />

              <ServiceItem
                icon={<Book className="h-8 w-8" />}
                label="Educational"
                onSelect={() => handleServiceSelect("Educational")}
              />
              <ServiceItem
                icon={<FileText className="h-8 w-8" />}
                label="Waste bill"
                onSelect={() => handleServiceSelect("Waste bill")}
              />
              <ServiceItem
                icon={<Video className="h-8 w-8" />}
                label="Streaming service"
                onSelect={() => handleServiceSelect("Streaming service")}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      {showAirtimePaymentModal && (
        <AirtimePaymentModal
          onClose={handleCloseAirtimeModal}
          onShowPayment={handleShowPayment}
          state={airtimeState}
          onStateChange={setAirtimeState}
        />
      )}
      {showDataModal && (
        <DataModal
          onClose={handleCloseDataModal}
          onShowPayment={handleShowPayment}
          state={dataState}
          onStateChange={setDataState}
        />
      )}
      {showElectricityModal && (
        <ElectricityModal
          onClose={handleCloseElectricityModal}
          onShowPayment={handleShowPayment}
          state={electricityState}
          onStateChange={setElectricityState}
        />
      )}
      {showCableModal && (
        <CableModal
          onClose={handleCloseCableModal}
          onShowPayment={handleShowPayment}
          state={cableState}
          onStateChange={setCableState}
        />
      )}
      {showPaymentModal && (
        <PaymentModal
          onClose={handleClosePaymentModal}
          onBack={handleBackToModal}
          provider={paymentData.provider}
          billPlan={paymentData.billPlan}
          subscriberId={paymentData.subscriberId}
          amountInNaira={paymentData.amountInNaira}
          token={paymentData.token}
          source={paymentData.source}
        />
      )}
    </div>
  );
};

export default DashboardServices;