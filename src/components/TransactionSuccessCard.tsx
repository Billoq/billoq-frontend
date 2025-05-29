// "use client"

// import { useState } from "react"
// import { Check, Copy, ExternalLink } from "lucide-react"

// interface TransactionSuccessCardProps {
//   transaction?: {
//     id: string
//     billType: string
//     amountInNaira: number
//     amountInUSDT: number
//     paymentMethod: string
//     date: string
//     hash: string
//     gasFee: string
//     explorerUrl: string
//   }
//   onDownload?: () => void
//   onReturn?: () => void
// }

// export function TransactionSuccessCard({
//   transaction = {
//     id: "0x98a....d4b9",
//     billType: "Electricity",
//     amountInNaira: 5000.0,
//     amountInUSDT: 4.32,
//     paymentMethod: "USDC/USDT",
//     date: "25/04/2025",
//     hash: "0x98a7f3c2BE98d4b9",
//     gasFee: "2999Gwei",
//     explorerUrl: "https://etherscan.io/tx/0x98a7f3c2BE98d4b9",
//   },
//   onDownload = () => console.log("Download receipt"),
//   onReturn = () => console.log("Return to dashboard"),
// }: TransactionSuccessCardProps) {
//   const [copied, setCopied] = useState(false)

//   const copyToClipboard = async (text: string) => {
//     try {
//       await navigator.clipboard.writeText(text)
//       setCopied(true)
//       setTimeout(() => setCopied(false), 2000)
//     } catch (err) {
//       console.error("Failed to copy:", err)
//     }
//   }

//   return (
//     <div className="w-full max-w-sm mx-auto bg-[#0f172a] text-white rounded-lg overflow-hidden shadow-xl">
//       {/* Success Icon and Title */}
//       <div className="flex flex-col items-center justify-center pt-4 pb-3">
//         <div className="w-16 h-16 rounded-full bg-green-500 flex items-center justify-center mb-3">
//           <Check className="w-10 h-10 text-white" />
//         </div>
//         <h2 className="text-lg font-medium text-center px-4">This payment has been processed Successfully</h2>
//       </div>

//       {/* Transaction Details */}
//       <div className="px-4 pb-4">
//         <h3 className="text-md font-semibold mb-2">Transaction Details</h3>
//         <div className="space-y-2 text-sm">
//           <div className="flex justify-between">
//             <span className="text-gray-400">Transaction ID</span>
//             <span className="text-right">{transaction.id}</span>
//           </div>
//           <div className="flex justify-between">
//             <span className="text-gray-400">Bill Type</span>
//             <span className="text-right">{transaction.billType}</span>
//           </div>
//           <div className="grid grid-cols-2 gap-2">
//             <div className="col-span-1">
//               <span className="text-gray-400 block">Amount (NGN)</span>
//               <span>₦{transaction.amountInNaira.toFixed(2)}</span>
//             </div>
//             <div className="col-span-1 text-right">
//               <span className="text-gray-400 block">Amount (USDT)</span>
//               <span>${transaction.amountInUSDT.toFixed(2)}</span>
//             </div>
//           </div>
//           <div className="flex justify-between">
//             <span className="text-gray-400">Payment method</span>
//             <span className="text-right">{transaction.paymentMethod}</span>
//           </div>
//           <div className="flex justify-between">
//             <span className="text-gray-400">Status</span>
//             <span className="flex items-center text-green-500">
//               <Check className="w-3 h-3 mr-1" />
//               Successful
//             </span>
//           </div>
//           <div className="flex justify-between">
//             <span className="text-gray-400">Date</span>
//             <span className="text-right">{transaction.date}</span>
//           </div>
//         </div>

//         {/* Separator */}
//         <div className="h-px bg-gray-700 my-3"></div>

//         {/* Blockchain Information */}
//         <h3 className="text-md font-semibold mb-2">Blockchain Information</h3>
//         <div className="space-y-2 text-sm">
//           <div className="flex justify-between items-center">
//             <span className="text-gray-400">Transaction Hash</span>
//             <div className="flex items-center">
//               <span className="mr-1 truncate max-w-[100px]">{transaction.hash}</span>
//               <button
//                 onClick={() => copyToClipboard(transaction.hash)}
//                 className="p-1 rounded hover:bg-gray-700"
//                 aria-label="Copy transaction hash"
//               >
//                 {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
//               </button>
//             </div>
//           </div>
//           <div className="flex justify-between">
//             <span className="text-gray-400">Gas Fee</span>
//             <span>{transaction.gasFee}</span>
//           </div>
//           <div className="flex justify-between items-center">
//             <span className="text-gray-400">View</span>
//             <a
//               href={transaction.explorerUrl}
//               target="_blank"
//               rel="noopener noreferrer"
//               className="text-blue-500 hover:text-blue-400 flex items-center text-sm"
//             >
//               Explorer <ExternalLink className="ml-1 h-3 w-3" />
//             </a>
//           </div>
//         </div>

//         {/* Action Buttons */}
//         <div className="flex gap-2 mt-4">
//           <button
//             onClick={onDownload}
//             className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md transition-colors cursor-pointer text-sm"
//           >
//             Download Receipt
//           </button>
//           <button
//             onClick={onReturn}
//             className="flex-1 border border-gray-600 text-white py-2 rounded-md hover:bg-gray-800 transition-colors cursor-pointer text-sm"
//           >
//             Return to Dashboard
//           </button>
//         </div>
//       </div>
//     </div>
//   )
// }


// "use client"

// import { useState } from "react"
// import { Check, Copy, ExternalLink } from "lucide-react"

// interface TransactionSuccessCardProps {
//   transaction?: {
//     id: string
//     billType: string
//     amountInNaira: number
//     amountInUSDT: number
//     paymentMethod: string
//     date: string
//     hash: string
//     gasFee: string
//     explorerUrl: string
//   }
//   onDownload?: () => void
//   onReturn?: () => void
// }

// export function TransactionSuccessCard({
//   transaction = {
//     id: "0x98a....d4b9",
//     billType: "Electricity",
//     amountInNaira: 5000.0,
//     amountInUSDT: 4.32,
//     paymentMethod: "USDC/USDT",
//     date: "25/04/2025",
//     hash: "0x98a7f3c2BE98d4b9",
//     gasFee: "2999Gwei",
//     explorerUrl: "https://etherscan.io/tx/0x98a7f3c2BE98d4b9",
//   },
//   onDownload = () => console.log("Download receipt"),
//   onReturn = () => console.log("Return to dashboard"),
// }: TransactionSuccessCardProps) {
//   const [copied, setCopied] = useState<string | null>(null)

//   // Helper function to truncate transaction IDs
//   const truncateId = (id: string): string => {
//     if (!id || id.length <= 12) return id
//     return `${id.slice(0, 10)}...`
//   }

//   const copyToClipboard = async (text: string, field: string) => {
//     try {
//       await navigator.clipboard.writeText(text)
//       setCopied(field)
//       setTimeout(() => setCopied(null), 2000)
//     } catch (err) {
//       console.error("Failed to copy:", err)
//     }
//   }

//   return (
//     <div className="w-full max-w-sm mx-auto bg-[#0f172a] text-white rounded-lg overflow-hidden shadow-xl">
//       {/* Success Icon and Title */}
//       <div className="flex flex-col items-center justify-center pt-4 pb-3">
//         <div className="w-16 h-16 rounded-full bg-green-500 flex items-center justify-center mb-3">
//           <Check className="w-10 h-10 text-white" />
//         </div>
//         <h2 className="text-lg font-medium text-center px-4">This payment has been processed Successfully</h2>
//       </div>

//       {/* Transaction Details */}
//       <div className="px-4 pb-4">
//         <h3 className="text-md font-semibold mb-2">Transaction Details</h3>
//         <div className="space-y-2 text-sm">
//           <div className="flex justify-between items-center">
//             <span className="text-gray-400">Transaction ID</span>
//             <div className="flex items-center">
//               <span className="text-right font-mono">{truncateId(transaction.id)}</span>
//               <button
//                 onClick={() => copyToClipboard(transaction.id, "id")}
//                 className="p-1 rounded hover:bg-gray-700 ml-1"
//                 aria-label="Copy transaction ID"
//               >
//                 {copied === "id" ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
//               </button>
//             </div>
//           </div>
//           <div className="flex justify-between">
//             <span className="text-gray-400">Bill Type</span>
//             <span className="text-right">{transaction.billType}</span>
//           </div>
//           <div className="grid grid-cols-2 gap-2">
//             <div className="col-span-1">
//               <span className="text-gray-400 block">Amount (NGN)</span>
//               <span>₦{transaction.amountInNaira.toFixed(2)}</span>
//             </div>
//             <div className="col-span-1 text-right">
//               <span className="text-gray-400 block">Amount (USDT)</span>
//               <span>${transaction.amountInUSDT.toFixed(2)}</span>
//             </div>
//           </div>
//           <div className="flex justify-between">
//             <span className="text-gray-400">Payment method</span>
//             <span className="text-right">{transaction.paymentMethod}</span>
//           </div>
//           <div className="flex justify-between">
//             <span className="text-gray-400">Status</span>
//             <span className="flex items-center text-green-500">
//               <Check className="w-3 h-3 mr-1" />
//               Successful
//             </span>
//           </div>
//           <div className="flex justify-between">
//             <span className="text-gray-400">Date</span>
//             <span className="text-right">{transaction.date}</span>
//           </div>
//         </div>

//         {/* Separator */}
//         <div className="h-px bg-gray-700 my-3"></div>

//         {/* Blockchain Information */}
//         <h3 className="text-md font-semibold mb-2">Blockchain Information</h3>
//         <div className="space-y-2 text-sm">
//           <div className="flex justify-between items-center">
//             <span className="text-gray-400">Transaction Hash</span>
//             <div className="flex items-center">
//               <span className="font-mono">{truncateId(transaction.hash)}</span>
//               <button
//                 onClick={() => copyToClipboard(transaction.hash, "hash")}
//                 className="p-1 rounded hover:bg-gray-700 ml-1"
//                 aria-label="Copy transaction hash"
//               >
//                 {copied === "hash" ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
//               </button>
//             </div>
//           </div>
//           <div className="flex justify-between">
//             <span className="text-gray-400">Gas Fee</span>
//             <span>{transaction.gasFee}</span>
//           </div>
//           <div className="flex justify-between items-center">
//             <span className="text-gray-400">View</span>
//             <a
//               href={transaction.explorerUrl}
//               target="_blank"
//               rel="noopener noreferrer"
//               className="text-blue-500 hover:text-blue-400 flex items-center text-sm"
//             >
//               Explorer <ExternalLink className="ml-1 h-3 w-3" />
//             </a>
//           </div>
//         </div>

//         {/* Action Buttons */}
//         <div className="flex gap-2 mt-4">
//           <button
//             onClick={onDownload}
//             className="flex-1 bg-[#1B89A4] hover:bg-blue-[#1B89A4] text-white py-2 rounded-md transition-colors cursor-pointer text-sm"
//           >
//             Download Receipt
//           </button>
//           <button
//             onClick={onReturn}
//             className="flex-1 border border-gray-600 text-white py-2 rounded-md hover:bg-gray-800 transition-colors cursor-pointer text-sm"
//           >
//             Return to Dashboard
//           </button>
//         </div>
//       </div>
//     </div>
//   )
// }

// export default TransactionSuccessCard



"use client"

import { useState } from "react"
import { Check, Copy, ExternalLink, Download, Loader2 } from "lucide-react"

interface TransactionSuccessCardProps {
  transaction?: {
    id: string
    billType: string
    amountInNaira: number
    amountInUSDT: number
    paymentMethod: string
    date: string
    hash: string
    gasFee: string
    explorerUrl: string
  }
  onDownload?: () => void
  onReturn?: () => void
}

export function TransactionSuccessCard({
  transaction = {
    id: "0x98a....d4b9",
    billType: "Electricity",
    amountInNaira: 5000.0,
    amountInUSDT: 4.32,
    paymentMethod: "USDC/USDT",
    date: "25/04/2025",
    hash: "0x98a7f3c2BE98d4b9",
    gasFee: "2999Gwei",
    explorerUrl: "https://etherscan.io/tx/0x98a7f3c2BE98d4b9",
  },
  onDownload = () => console.log("Download receipt"),
  onReturn = () => console.log("Return to dashboard"),
}: TransactionSuccessCardProps) {
  const [copied, setCopied] = useState<string | null>(null)
  const [isDownloading, setIsDownloading] = useState(false)

  // Helper function to truncate transaction IDs
  const truncateId = (id: string): string => {
    if (!id || id.length <= 12) return id
    return `${id.slice(0, 10)}...`
  }

  const copyToClipboard = async (text: string, field: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(field)
      setTimeout(() => setCopied(null), 2000)
    } catch (err) {
      console.error("Failed to copy:", err)
    }
  }

  const downloadAsPNG = async () => {
    setIsDownloading(true)
    try {
      // Create a canvas element
      const canvas = document.createElement("canvas")
      const ctx = canvas.getContext("2d")

      if (!ctx) {
        throw new Error("Could not get canvas context")
      }

      // Set canvas size
      canvas.width = 400
      canvas.height = 600

      // Set background
      ctx.fillStyle = "#0f172a"
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Set text properties
      ctx.fillStyle = "#ffffff"
      ctx.font = "16px Arial, sans-serif"
      ctx.textAlign = "center"

      let y = 40

      // Title
      ctx.font = "bold 18px Arial, sans-serif"
      ctx.fillText("Transaction Receipt", canvas.width / 2, y)
      y += 40

      // Success message
      ctx.font = "14px Arial, sans-serif"
      ctx.fillText("Payment processed successfully", canvas.width / 2, y)
      y += 40

      // Draw success circle
      ctx.beginPath()
      ctx.arc(canvas.width / 2, y, 20, 0, 2 * Math.PI)
      ctx.fillStyle = "#10b981"
      ctx.fill()

      // Draw checkmark
      ctx.strokeStyle = "#ffffff"
      ctx.lineWidth = 3
      ctx.beginPath()
      ctx.moveTo(canvas.width / 2 - 8, y)
      ctx.lineTo(canvas.width / 2 - 2, y + 6)
      ctx.lineTo(canvas.width / 2 + 8, y - 6)
      ctx.stroke()

      y += 50

      // Transaction Details
      ctx.fillStyle = "#ffffff"
      ctx.font = "bold 16px Arial, sans-serif"
      ctx.textAlign = "left"
      ctx.fillText("Transaction Details", 30, y)
      y += 30

      ctx.font = "12px Arial, sans-serif"

      // Helper function to draw a row
      const drawRow = (label: string, value: string) => {
        ctx.fillStyle = "#9ca3af"
        ctx.fillText(label, 30, y)
        ctx.fillStyle = "#ffffff"
        ctx.textAlign = "right"
        ctx.fillText(value, canvas.width - 30, y)
        ctx.textAlign = "left"
        y += 25
      }

      drawRow("Transaction ID:", truncateId(transaction.id))
      drawRow("Bill Type:", transaction.billType)
      drawRow("Amount (NGN):", `₦${transaction.amountInNaira.toFixed(2)}`)
      drawRow("Amount (USDT):", `$${transaction.amountInUSDT.toFixed(2)}`)
      drawRow("Payment Method:", transaction.paymentMethod)
      drawRow("Status:", "Successful")
      drawRow("Date:", transaction.date)

      y += 20

      // Draw separator line
      ctx.strokeStyle = "#374151"
      ctx.lineWidth = 1
      ctx.beginPath()
      ctx.moveTo(30, y)
      ctx.lineTo(canvas.width - 30, y)
      ctx.stroke()

      y += 30

      // Blockchain Information
      ctx.fillStyle = "#ffffff"
      ctx.font = "bold 16px Arial, sans-serif"
      ctx.fillText("Blockchain Information", 30, y)
      y += 30

      ctx.font = "12px Arial, sans-serif"
      drawRow("Transaction Hash:", truncateId(transaction.hash))
      drawRow("Gas Fee:", transaction.gasFee)

      y += 20

      // Footer
      ctx.fillStyle = "#9ca3af"
      ctx.font = "10px Arial, sans-serif"
      ctx.textAlign = "center"
      ctx.fillText("Generated on " + new Date().toLocaleString(), canvas.width / 2, y)

      // Convert canvas to blob and download
      canvas.toBlob((blob) => {
        if (blob) {
          const url = URL.createObjectURL(blob)
          const link = document.createElement("a")
          link.href = url
          link.download = `transaction-receipt-${transaction.id}.png`
          document.body.appendChild(link)
          link.click()
          document.body.removeChild(link)
          URL.revokeObjectURL(url)
        }
      }, "image/png")
    } catch (error) {
      console.error("Failed to download receipt:", error)
      alert("Failed to download receipt. Please try again.")
    } finally {
      setIsDownloading(false)
    }
  }

  return (
    <div
      id="transaction-receipt"
      className="w-full max-w-sm mx-auto bg-[#0f172a] text-white rounded-lg overflow-hidden shadow-xl"
    >
      {/* Success Icon and Title */}
      <div className="flex flex-col items-center justify-center pt-4 pb-3">
        <div className="w-16 h-16 rounded-full bg-green-500 flex items-center justify-center mb-3">
          <Check className="w-10 h-10 text-white" />
        </div>
        <h2 className="text-lg font-medium text-center px-4">This payment has been processed Successfully</h2>
      </div>

      {/* Transaction Details */}
      <div className="px-4 pb-4">
        <h3 className="text-md font-semibold mb-2">Transaction Details</h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between items-center">
            <span className="text-gray-400">Transaction ID</span>
            <div className="flex items-center">
              <span className="text-right font-mono">{truncateId(transaction.id)}</span>
              <button
                onClick={() => copyToClipboard(transaction.id, "id")}
                className="p-1 rounded hover:bg-gray-700 ml-1"
                aria-label="Copy transaction ID"
              >
                {copied === "id" ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
              </button>
            </div>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Bill Type</span>
            <span className="text-right">{transaction.billType}</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div className="col-span-1">
              <span className="text-gray-400 block">Amount (NGN)</span>
              <span>₦{transaction.amountInNaira.toFixed(2)}</span>
            </div>
            <div className="col-span-1 text-right">
              <span className="text-gray-400 block">Amount (USDT)</span>
              <span>${transaction.amountInUSDT.toFixed(2)}</span>
            </div>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Payment method</span>
            <span className="text-right">{transaction.paymentMethod}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Status</span>
            <span className="flex items-center text-green-500">
              <Check className="w-3 h-3 mr-1" />
              Successful
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Date</span>
            <span className="text-right">{transaction.date}</span>
          </div>
        </div>

        {/* Separator */}
        <div className="h-px bg-gray-700 my-3"></div>

        {/* Blockchain Information */}
        <h3 className="text-md font-semibold mb-2">Blockchain Information</h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between items-center">
            <span className="text-gray-400">Transaction Hash</span>
            <div className="flex items-center">
              <span className="font-mono">{truncateId(transaction.hash)}</span>
              <button
                onClick={() => copyToClipboard(transaction.hash, "hash")}
                className="p-1 rounded hover:bg-gray-700 ml-1"
                aria-label="Copy transaction hash"
              >
                {copied === "hash" ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
              </button>
            </div>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Gas Fee</span>
            <span>{transaction.gasFee}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-400">View</span>
            <a
              href={transaction.explorerUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:text-blue-400 flex items-center text-sm"
            >
              Explorer <ExternalLink className="ml-1 h-3 w-3" />
            </a>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 mt-4">
          <button
            onClick={downloadAsPNG}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md transition-colors cursor-pointer text-sm flex items-center justify-center gap-2"
            disabled={isDownloading}
          >
            {isDownloading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Downloading...
              </>
            ) : (
              <>
                <Download className="h-4 w-4" />
                Download PNG
              </>
            )}
          </button>
          <button
            onClick={onReturn}
            className="flex-1 border border-gray-600 text-white py-2 rounded-md hover:bg-gray-800 transition-colors cursor-pointer text-sm"
          >
            Return to Dashboard
          </button>
        </div>
      </div>
    </div>
  )
}

export default TransactionSuccessCard




