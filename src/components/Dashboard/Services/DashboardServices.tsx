"use client"

import type React from "react"
import { useState } from "react"
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
  Zap,
  Search,
  TrendingUp,
  Clock,
  Trophy,
} from "lucide-react"
import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import AirtimePaymentModal from "./AirtimePaymentModal"
import DataModal from "./DataModal"
import ElectricityModal from "./ElectricityModal"
import CableModal from "./CableModal"
import PaymentModal from "./PaymentModal"

interface PaymentData {
  provider: string;
  billPlan: string;
  subscriberId: string;
  amountInNaira: string;
  token: string;
  source: "airtime" | "data" | "electricity" | "cable";
  quoteId: string;
}

interface ServiceItemProps {
  icon: React.ReactNode
  label: string
  description?: string
  onSelect: () => void
  popular?: boolean
  comingSoon?: boolean
}

const ServiceItem: React.FC<ServiceItemProps> = ({
  icon,
  label,
  description,
  onSelect,
  popular = false,
  comingSoon = false,
}) => {
  return (
    <motion.div
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.98 }}
      className={`relative group cursor-pointer`}
      onClick={comingSoon ? undefined : onSelect}
    >
      <Card
        className={`w-full h-full border-[#1e293b] bg-[#0f172a] hover:border-[#1B89A4] transition-all duration-300 overflow-hidden ${comingSoon ? "opacity-70 cursor-not-allowed" : ""}`}
      >
        <CardContent className="p-5 flex flex-col items-center text-center">
          <div className="absolute top-0 right-0 w-24 h-24 bg-[#1B89A4]/5 rounded-full blur-xl transform translate-x-8 -translate-y-8 group-hover:bg-[#2563eb]/10 transition-all duration-700"></div>

          <div className="relative z-10 mb-3 h-14 w-14 rounded-xl bg-[#1e293b] flex items-center justify-center group-hover:bg-[#2563eb]/20 transition-all duration-300">
            <div className="text-[#1B89A4]">{icon}</div>
          </div>

          <h3 className="text-white font-medium mb-1 group-hover:text-[#1B89A4] transition-colors">{label}</h3>

          {description && <p className="text-xs text-slate-400 mt-1">{description}</p>}

          {popular && (
            <Badge className="absolute top-2 right-2 bg-[#1B89A4]/20 text-[#1B89A4] border border-[#1B89A4]/30">
              Popular
            </Badge>
          )}

          {comingSoon && (
            <Badge className="absolute top-2 right-2 bg-[#1e293b] text-slate-300 border border-slate-700">
              Coming Soon
            </Badge>
          )}
        </CardContent>
      </Card>
    </motion.div>
  )
}

const ServiceCategory: React.FC<{
  title: string
  icon: React.ReactNode
  children: React.ReactNode
}> = ({ title, icon, children }) => {
  return (
    <div className="mb-10">
      <div className="flex items-center mb-6">
        <div className="h-8 w-8 rounded-lg bg-[#1e293b] flex items-center justify-center mr-3">
          <div className="text-[#1B89A4]">{icon}</div>
        </div>
        <h2 className="text-xl font-semibold text-white">{title}</h2>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">{children}</div>
    </div>
  )

}

const DashboardServices = () => {
  // Modal visibility states
  const [showAirtimePaymentModal, setShowAirtimePaymentModal] = useState(false)
  const [showDataModal, setShowDataModal] = useState(false)
  const [showElectricityModal, setShowElectricityModal] = useState(false)
  const [showCableModal, setShowCableModal] = useState(false)
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [recentServices, setRecentServices] = useState<string[]>([])

  // State preservation for each modal
  const [airtimeState, setAirtimeState] = useState({
    selectedNetwork: "",
    phoneNumber: "",
    amount: "",
    totalAmount: "",
    billPlan: "",
    paymentOption: "USDT" as "USDT" | "USDC",
  })

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
  })

  const [cableState, setCableState] = useState({
    provider: "",
    accountNumber: "",
    billItem: "",
    amount: "",
    paymentOption: "USDT" as "USDT" | "USDC",
  })

  const [paymentData, setPaymentData] = useState<PaymentData>({
    provider: "",
    billPlan: "",
    subscriberId: "",
    amountInNaira: "",
    token: "",
    source: "airtime",
    quoteId: "",
  });

  const updateRecentServices = (service: string) => {
    setRecentServices((prev) => {
      const updated = [service, ...prev.filter((s) => s !== service)];
      return updated.slice(0, 3); // Limit to the 3 most recent services
    });
  };

  const handleServiceSelect = (service: string) => {
    updateRecentServices(service);

    switch (service) {
      case "Mobile Recharge":
        setShowAirtimePaymentModal(true)
        break
      case "Internet":
        setShowDataModal(true)
        break
      case "Electricity":
        setShowElectricityModal(true)
        break
      case "Cable TV":
        setShowCableModal(true)
        break
      default:
        console.log(`Service ${service} not implemented`)
    }
  }

  const handleShowPayment = (data: PaymentData) => {
    setPaymentData(data)
    // Hide all service modals but keep them mounted
    setShowAirtimePaymentModal(false)
    setShowDataModal(false)
    setShowElectricityModal(false)
    setShowCableModal(false)
    // Show payment modal
    setShowPaymentModal(true)
  }

  const handleBackToModal = () => {
    setShowPaymentModal(false)
    // Re-show the appropriate service modal based on source
    switch (paymentData.source) {
      case "airtime":
        setShowAirtimePaymentModal(true)
        break
      case "data":
        setShowDataModal(true)
        break
      case "electricity":
        setShowElectricityModal(true)
        break
      case "cable":
        setShowCableModal(true)
        break
    }
  }

  const handleClosePaymentModal = () => {
    setShowPaymentModal(false)
    // Reset modal states when fully closing the payment modal
    setAirtimeState({ selectedNetwork: "", phoneNumber: "", amount: "", totalAmount: "", billPlan: "", paymentOption: "USDT" });
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
    })
    setCableState({
      provider: "",
      accountNumber: "",
      billItem: "",
      amount: "",
      paymentOption: "USDT",
    })
    setPaymentData({
      provider: "",
      billPlan: "",
      subscriberId: "",
      amountInNaira: "",
      token: "",
      source: "airtime",
      quoteId: "",
    });
  };

  const handleCloseAirtimeModal = () => {
    setShowAirtimePaymentModal(false);
    setAirtimeState({ selectedNetwork: "", phoneNumber: "", amount: "", totalAmount: "", paymentOption: "USDT", billPlan: "" });
  };

  const handleCloseDataModal = () => {
    setShowDataModal(false)
    setDataState({
      selectedNetwork: "",
      phoneNumber: "",
      amount: "",
      paymentOption: "USDT",
      billPlan: "",
    });
  };

  const handleCloseElectricityModal = () => {
    setShowElectricityModal(false)
    setElectricityState({
      provider: "",
      accountNumber: "",
      billPlan: "",
      amount: "",
      paymentOption: "USDT",
    })
  }

  const handleCloseCableModal = () => {
    setShowCableModal(false)
    setCableState({
      provider: "",
      accountNumber: "",
      billItem: "",
      amount: "",
      paymentOption: "USDT",
    })
  }

  // Filter services based on search query
  const filterServices = (label: string) => {
    if (!searchQuery) return true
    return label.toLowerCase().includes(searchQuery.toLowerCase())
  }

  return (
    <div className="min-h-screen bg-[#0f172a] text-white p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-[#1B89A4] to-[#1B89A4]">
            Services
          </h1>
          <p className="text-slate-300">Pay your bills easily with cryptocurrency</p>
        </div>

        {/* Search and Quick Actions */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-grow">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-slate-400" />
            </div>
            <input
              type="text"
              placeholder="Search for a service..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-[#1e293b] border border-[#2e3b52] rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#2563eb] focus:border-transparent transition-all"
            />
          </div>

          <div className="flex gap-2">
            <Button className="bg-[#1e293b] hover:bg-[#2e3b52] border border-[#2e3b52] text-white cursor-pointer">
              <TrendingUp className="h-5 w-5 mr-2" />
              Popular
            </Button>
            <Button className="bg-[#1e293b] hover:bg-[#2e3b52] border border-[#2e3b52] text-white cursor-pointer">
              <Clock className="h-5 w-5 mr-2" />
              Recent
            </Button>
          </div>
        </div>

        {/* Recent Services */}
        {recentServices.length > 0 && (
          <div className="mb-10">
            <div className="flex items-center mb-6">
              <div className="h-8 w-8 rounded-lg bg-[#1e293b] flex items-center justify-center mr-3">
                <Clock className="h-4 w-4 text-[#2563eb]" />
              </div>
              <h2 className="text-xl font-semibold text-white">Recent Services</h2>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {recentServices.map((service, index) => {
                let icon
                switch (service) {
                  case "Mobile Recharge":
                    icon = <Smartphone className="h-6 w-6" />
                    break
                  case "Internet":
                    icon = <Globe className="h-6 w-6" />
                    break
                  case "Electricity":
                    icon = <Lightbulb className="h-6 w-6" />
                    break
                  case "Cable TV":
                    icon = <Tv className="h-6 w-6" />
                    break
                  default:
                    icon = <Zap className="h-6 w-6" />
                }

                return (
                  <ServiceItem
                    key={`recent-${index}`}
                    icon={icon}
                    label={service}
                    onSelect={() => handleServiceSelect(service)}
                  />
                )
              })}
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className="bg-gradient-to-b from-[#111827] to-[#0f172a] rounded-2xl p-6 md:p-8 shadow-xl border border-[#1e293b]">
          {/* Mobile Services Section */}
          <ServiceCategory title="Mobile Services" icon={<Smartphone className="h-5 w-5 text-[#1B89A4]" />}>
            {filterServices("Mobile Recharge") && (
              <ServiceItem
                icon={<Smartphone className="h-6 w-6 text-[#1B89A4]" />}
                label="Mobile Recharge"
                description="Recharge your mobile balance"
                onSelect={() => handleServiceSelect("Mobile Recharge")}
                popular={true}
              />
            )}
            {filterServices("Internet") && (
              <ServiceItem
                icon={<Globe className="h-6 w-6 text-[#1B89A4]" />}
                label="Internet"
                description="Pay for data bundles"
                onSelect={() => handleServiceSelect("Internet")}
                popular={true}
              />
            )}
          </ServiceCategory>

          {/* Bill Payment Section */}
          <ServiceCategory title="Bill Payment" icon={<FileText className="h-5 w-5" />}>
            {filterServices("Electricity") && (
              <ServiceItem
                icon={<Lightbulb className="h-6 w-6 text-[#1B89A4]" />}
                label="Electricity"
                description="Pay your electricity bills"
                onSelect={() => handleServiceSelect("Electricity")}
                popular={true}
              />
            )}
            {filterServices("Cable TV") && (
              <ServiceItem
                icon={<Tv className="h-6 w-6 text-[#1B89A4]" />}
                label="Cable TV"
                description="Pay for TV subscriptions"
                onSelect={() => handleServiceSelect("Cable TV")}
              />
            )}
            {filterServices("Water bill") && (
              <ServiceItem
                icon={<Droplet className="h-6 w-6 text-[#1B89A4]" />}
                label="Water bill"
                description="Pay your water bills"
                onSelect={() => handleServiceSelect("Water bill")}
                comingSoon={true}
              />
            )}
            {filterServices("Gas bill") && (
              <ServiceItem
                icon={<Flame className="h-6 w-6 text-[#1B89A4]" />}
                label="Gas bill"
                description="Pay your gas bills"
                onSelect={() => handleServiceSelect("Gas bill")}
                comingSoon={true}
              />
            )}
            {filterServices("Educational") && (
              <ServiceItem
                icon={<Book className="h-6 w-6 text-[#1B89A4]" />}
                label="Educational"
                description="Pay school fees"
                onSelect={() => handleServiceSelect("Educational")}
                comingSoon={true}
              />
            )}
            {filterServices("Waste bill") && (
              <ServiceItem
                icon={<FileText className="h-6 w-6 text-[#1B89A4]" />}
                label="Waste bill"
                description="Pay waste management bills"
                onSelect={() => handleServiceSelect("Waste bill")}
                comingSoon={true}
              />
            )}
            {filterServices("Streaming service") && (
              <ServiceItem
                icon={<Video className="h-6 w-6 text-[#1B89A4]" />}
                label="Streaming service"
                description="Pay for streaming subscriptions"
                onSelect={() => handleServiceSelect("Streaming service")}
                comingSoon={true}
              />
            )}
             {filterServices("Betting") && (
              <ServiceItem
                icon={<Trophy  className="h-6 w-6 text-[#1B89A4]" />}
                label="Betting"
                description="Place your bets"
                onSelect={() => handleServiceSelect("Betting")}
                comingSoon={true}
              />
            )}
          </ServiceCategory>
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
          quoteId={paymentData.quoteId}
        />
      )}
    </div>
  )
}

export default DashboardServices
