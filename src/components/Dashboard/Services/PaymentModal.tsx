"use client"

import { ChevronLeft, Info, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useState } from "react"

interface PaymentModalProps {
  onClose: () => void;
  onBack: () => void;
  provider: string;
  billPlan: string;
  subscriberId: string;
  amountInNaira: string;
  token: string;
}

const PaymentModal: React.FC<PaymentModalProps> = ({ 
  onClose, 
  onBack,
  provider,
  billPlan,
  subscriberId, 
  amountInNaira, 
  token
}) => {
  const [showConfirmation, setShowConfirmation] = useState(false)

  // Simulated conversion (replace with real conversion logic if needed)
  const convertedAmount = (parseFloat(amountInNaira || "0") / 1155).toFixed(2)

  const handleBackClick = () => {
    onBack();
  };

  const handleCloseAttempt = () => {
    setShowConfirmation(true)
  }

  const handleConfirmClose = () => {
    setShowConfirmation(false)
    onClose()
  }

  const handleCancelClose = () => {
    setShowConfirmation(false)
  }

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      handleCloseAttempt()
    }
  }

  // Enhanced bill type detection
  const getBillType = () => {
    if (provider.includes("DSTV") || provider.includes("GOTV") || provider.includes("STARTIMES")) {
      return "Cable TV";
    }
    if (provider.includes("MTN") || provider.includes("AIRTEL") || provider.includes("GLO") || provider.includes("9MOBILE")) {
      if (provider.includes("DATA")) return "Mobile Data";
      return "Airtime";
    }
    return "Electricity";
  };

  return (
    <>
      <div 
        className="fixed inset-0 flex items-center justify-center bg-slate-800/80 p-4 z-50"
        onClick={handleOverlayClick}
      >
        <Card className="w-full max-w-md mx-auto overflow-hidden bg-transparent border-0 text-blue-400">
          <Card className="bg-gray-900 border-0 shadow-xl">
            <div className="flex items-center justify-between p-4 border-b border-gray-800">
              <Button 
                variant="ghost" 
                size="icon" 
                className="text-gray-400 hover:text-white hover:bg-gray-800"
                onClick={handleBackClick}
              >
                <ChevronLeft className="h-5 w-5" />
              </Button>
              <h2 className="text-white text-lg font-medium">Payment Details</h2>
              <Button
                variant="ghost"
                size="icon"
                className="text-gray-400 hover:text-white hover:bg-gray-800"
                onClick={handleCloseAttempt}
              >
                <X className="h-5 w-5" />
              </Button>
            </div>

            <CardContent className="p-6 space-y-6">
              <div className="grid grid-cols-2 gap-y-4">
                <div className="text-gray-400">Bill Type</div>
                <div className="text-white text-right">{getBillType()}</div>

                <div className="text-gray-400">Provider</div>
                <div className="text-white text-right">{provider}</div>

                <div className="text-gray-400">Bill Plan</div>
                <div className="text-white text-right">{billPlan}</div>

                <div className="text-gray-400">Subscriber ID</div>
                <div className="text-white text-right">{subscriberId}</div>

                <div className="text-gray-400">Amount in Naira</div>
                <div className="text-white text-right">₦{amountInNaira}</div>

                <div className="text-gray-400">Amount in USD</div>
                <div className="text-white text-right">${convertedAmount}</div>

                <div className="text-gray-400">Payment Token</div>
                <div className="text-white text-right">
                  <p>{token}</p>
                </div>
              </div>

              <div className="flex items-start gap-2 text-xs text-gray-400 bg-gray-800/50 p-3 rounded">
                <Info className="h-4 w-4 flex-shrink-0 mt-0.5" />
                <p>All payments are routed through secure smart contracts, and will be recorded onchain.</p>
              </div>

              <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-5">Confirm Payment</Button>

              <div className="text-center text-sm">
                <span className="text-gray-400">Need help?</span>{" "}
                <a href="#" className="text-blue-400 hover:underline">
                  Chat with Support
                </a>
              </div>
            </CardContent>
          </Card>
        </Card>
      </div>

      {/* Confirmation Dialog */}
      {showConfirmation && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/70 z-50">
          <Card className="w-full max-w-sm bg-gray-900 border-gray-800">
            <CardContent className="p-6 space-y-6">
              <div className="space-y-2">
                <h3 className="text-lg font-medium text-white">Are you sure you want to quit?</h3>
                <p className="text-gray-400">Your payment details will not be saved.</p>
              </div>
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  className="flex-1 bg-transparent text-white hover:bg-gray-800 hover:text-white"
                  onClick={handleCancelClose}
                >
                  No, Continue
                </Button>
                <Button
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white"
                  onClick={handleConfirmClose}
                >
                  Yes, Quit
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  )
}

export default PaymentModal