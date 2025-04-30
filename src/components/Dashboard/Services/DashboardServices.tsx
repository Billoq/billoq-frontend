'use client'

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
import PaymentModal from "./PaymentModal";
import CableModal from "./CableModal"
import { subscribe } from "diagnostics_channel";

const DashboardServices = () => {
  const [showAirtimePaymentModal, setShowAirtimePaymentModal] = useState(false);
  const [showDataModal, setShowDataModal] = useState(false);
  const [showElectricityModal, setShowElectricityModal] = useState(false);
  const [showCableModal, setShowCableModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentData, setPaymentData] = useState({
    provider: "",
    billPlan: "",
    subscriberId: "",
    amountInNaira: "",
    token: "",
    source: "" as "airtime" | "data" | "electricity" | "cable"
  });

  const handleServiceSelect = (service: string) => {
    if (service === "Mobile Recharge") {
      setShowAirtimePaymentModal(true);
    }
    if (service === "Internet") {
      setShowDataModal(true);
    }
    if (service === "Electricity") {
      setShowElectricityModal(true);
    }
    if (service === "Cable TV") {
      setShowCableModal(true);
    }
  };

  const handleShowPayment = (data: {
    provider: string;
    billPlan: string;
    subscriberId: string;
    amountInNaira: string;
    token: string;
    source: "airtime" | "data" | "electricity" | "cable";
  }) => {
    setPaymentData(data);
    // Close all modals
    setShowAirtimePaymentModal(false);
    setShowDataModal(false);
    setShowElectricityModal(false);
    setShowCableModal(false);
    // Show payment modal
    setShowPaymentModal(true);
  };
  
  // Update handleBackToModal
  const handleBackToModal = () => {
    setShowPaymentModal(false);
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
      default:
        setShowElectricityModal(true); // fallback
    }
  };

  return (
    <div className="min-h-screen bg-[#111827] text-white p-4">
      <div className="max-w-3xl ml-6">
        <p className="text-sm mb-6">
          View all our services and pay your bill easily
        </p>

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
          onClose={() => setShowAirtimePaymentModal(false)} 
          onShowPayment={handleShowPayment} 
        />
      )}
      {showDataModal && (
        <DataModal 
          onClose={() => setShowDataModal(false)} 
          onShowPayment={handleShowPayment} 
        />
      )}
      {showElectricityModal && (
        <ElectricityModal 
          onClose={() => setShowElectricityModal(false)} 
          onShowPayment={handleShowPayment} 
        />
      )}
      {showCableModal && (
        <CableModal 
          onClose={() => setShowCableModal(false)} 
          onShowPayment={handleShowPayment} 
        />
      )}
      {showPaymentModal && (
        <PaymentModal
          onClose={() => setShowPaymentModal(false)}
          onBack={handleBackToModal}
          provider={paymentData.provider}
          billPlan={paymentData.billPlan}
          subscriberId={paymentData.subscriberId}
          amountInNaira={paymentData.amountInNaira}
          token={paymentData.token}
        />
      )}
    </div>
  );
};

export default DashboardServices;