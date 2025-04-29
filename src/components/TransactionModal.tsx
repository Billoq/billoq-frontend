
"use client"

import { useState } from "react"
import { Check, Copy, ExternalLink, Clock, X } from "lucide-react"

interface TransactionStatusCardProps {
  isOpen: boolean
  onClose: () => void
  transaction: {
    id: string
    serviceCategory: string
    amountInNaira: number
    amountInUSDT: number
    paymentMethod: string
    status: "Successful" | "Failed" | "Pending"
    date: string
    hash: string
    gasFee: string
    explorerUrl: string
  }
}

export function TransactionStatusCard({ isOpen, onClose, transaction }: TransactionStatusCardProps) {
  const [copied, setCopied] = useState(false)

  // Copy transaction hash to clipboard
  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error("Failed to copy:", err)
    }
  }

  // Handle receipt download
  const downloadReceipt = () => {
    // Download receipt logic would go here
    alert("Receipt downloaded")
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-[#0f172a] text-white rounded-md shadow-lg max-w-md w-full mx-4 relative">
        {/* Close button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white"
        >
          <X size={20} />
        </button>

        <div className="p-6">
          {/* Status Icon */}
          <div className="flex flex-col items-center justify-center mb-6">
            {transaction.status === "Successful" && (
              <div className="w-20 h-20 rounded-full bg-green-500 flex items-center justify-center mb-4">
                <Check className="w-12 h-12 text-white" />
              </div>
            )}
            {transaction.status === "Failed" && (
              <div className="w-20 h-20 rounded-full bg-red-500 flex items-center justify-center mb-4">
                <X className="w-12 h-12 text-white" />
              </div>
            )}
            {transaction.status === "Pending" && (
              <div className="w-20 h-20 rounded-full bg-yellow-500 flex items-center justify-center mb-4">
                <Clock className="w-12 h-12 text-white" />
              </div>
            )}

            {/* Status Message */}
            <h2 className="text-xl font-medium text-center">
              {transaction.status === "Successful" && "This payment has been processed Successfully"}
              {transaction.status === "Failed" && "This payment has Failed"}
              {transaction.status === "Pending" && "This payment is Pending"}
            </h2>
          </div>

          {/* Transaction Details */}
          <div className="space-y-4 mb-6">
            <h3 className="text-lg font-semibold">Transaction Details</h3>
            
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-400">Transaction ID</span>
                <span>{transaction.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Service category</span>
                <span>{transaction.serviceCategory}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Amount in Naira</span>
                <span>₦{transaction.amountInNaira.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Amount Paid In USDT</span>
                <span>${transaction.amountInUSDT.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Payment method</span>
                <span>{transaction.paymentMethod}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Status</span>
                <span className={`flex items-center ${
                  transaction.status === "Successful" ? "text-green-500" : 
                  transaction.status === "Failed" ? "text-red-500" : "text-yellow-500"
                }`}>
                  {transaction.status === "Successful" && <Check className="w-4 h-4 mr-1" />}
                  {transaction.status === "Failed" && <X className="w-4 h-4 mr-1" />}
                  {transaction.status === "Pending" && <Clock className="w-4 h-4 mr-1" />}
                  {transaction.status}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Transaction Date</span>
                <span>{transaction.date}</span>
              </div>
            </div>
          </div>

          {/* Blockchain Info */}
          <div className="border-t border-gray-700 pt-4 mb-6">
            <h3 className="text-lg font-semibold mb-4">Blockchain Information</h3>
            
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Transaction Hash</span>
                <div className="flex items-center">
                  <span className="mr-2 text-sm truncate max-w-[150px]">{transaction.hash}</span>
                  <button 
                    onClick={() => copyToClipboard(transaction.hash)}
                    className="p-1 rounded-full hover:bg-gray-700"
                  >
                    {copied ? <Check size={16} /> : <Copy size={16} />}
                  </button>
                </div>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Gas Fee</span>
                <span>{transaction.gasFee}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">View Transaction</span>
                <a
                  href={transaction.explorerUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:text-blue-400 flex items-center"
                >
                  View on explorer <ExternalLink className="ml-1 h-4 w-4" />
                </a>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button 
              onClick={downloadReceipt}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md"
            >
              Download Receipt
            </button>
            <button 
              onClick={onClose}
              className="flex-1 border border-gray-600 text-white hover:bg-gray-800 py-2 px-4 rounded-md"
            >
              Return to Dashboard
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}