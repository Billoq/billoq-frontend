"use client"

import { useState } from "react"
import NextImage from "next/image"
import { Check, Copy, ExternalLink, Download, FileText, Loader2, Clock, XCircle, AlertCircle } from "lucide-react"

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
    status: "completed" | "pending" | "failed"
  }
  onDownload?: () => void
  onReturn?: () => void
}

// Function to get status configuration
const getStatusConfig = (status: "completed" | "pending" | "failed") => {
  switch (status) {
    case "completed":
      return {
        icon: Check,
        color: "text-green-500",
        bgColor: "bg-green-500",
        title: "Payment Processed Successfully",
        statusText: "Successful"
      }
    case "pending":
      return {
        icon: Clock,
        color: "text-yellow-500",
        bgColor: "bg-yellow-500",
        title: "Payment Being Processed",
        statusText: "Pending"
      }
    case "failed":
      return {
        icon: XCircle,
        color: "text-red-500",
        bgColor: "bg-red-500",
        title: "Payment Failed",
        statusText: "Failed"
      }
    default:
      return {
        icon: AlertCircle,
        color: "text-gray-500",
        bgColor: "bg-gray-500",
        title: "Transaction Status Unknown",
        statusText: "Unknown"
      }
  }
}

// Function to draw a rounded rectangle
const drawRoundedRect = (ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number, radius: number) => {
  ctx.beginPath()
  ctx.moveTo(x + radius, y)
  ctx.lineTo(x + width - radius, y)
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius)
  ctx.lineTo(x + width, y + height - radius)
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height)
  ctx.lineTo(x + radius, y + height)
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius)
  ctx.lineTo(x, y + radius)
  ctx.quadraticCurveTo(x, y, x + radius, y)
  ctx.closePath()
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
    status: "completed",
    explorerUrl: "https://etherscan.io/tx/0x98a7f3c2BE98d4b9"
  },
  onDownload = () => console.log("Download receipt"),
  onReturn = () => console.log("Return to dashboard"),
}: TransactionSuccessCardProps) {
  const [copied, setCopied] = useState<string | null>(null)
  const [isDownloadingPNG, setIsDownloadingPNG] = useState(false)
  const [isDownloadingPDF, setIsDownloadingPDF] = useState(false)

  const statusConfig = getStatusConfig(transaction.status)
  const StatusIcon = statusConfig.icon
  
  const explorerUrl = transaction.explorerUrl || `https://etherscan.io/tx/${transaction.hash}`

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
    setIsDownloadingPNG(true)
    try {
      const canvas = document.createElement("canvas")
      const ctx = canvas.getContext("2d")

      if (!ctx) {
        throw new Error("Could not get canvas context")
      }

      // Set canvas size - made more compact
      canvas.width = 450
      canvas.height = 600

      // Load the actual logo
      const logo = new Image()
      logo.crossOrigin = "anonymous"

      const createPNGReceipt = () => {
        try {
          // Create gradient background
          const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height)
          gradient.addColorStop(0, "#0f172a")
          gradient.addColorStop(1, "#1e293b")
          ctx.fillStyle = gradient
          ctx.fillRect(0, 0, canvas.width, canvas.height)

          // Draw main card background with rounded corners
          ctx.fillStyle = "#1a2234"
          drawRoundedRect(ctx, 15, 15, canvas.width - 30, canvas.height - 30, 12)
          ctx.fill()

          // Add subtle border
          ctx.strokeStyle = "#374151"
          ctx.lineWidth = 1
          drawRoundedRect(ctx, 15, 15, canvas.width - 30, canvas.height - 30, 12)
          ctx.stroke()

          let y = 50

          // Header section with logo and text properly positioned
          const logoSize = 24
          const logoX = (canvas.width / 2) - 45
          const logoY = y - 18

          // Draw logo if loaded, otherwise draw placeholder
          if (logo.complete && logo.naturalHeight !== 0) {
            try {
              ctx.drawImage(logo, logoX, logoY, logoSize, logoSize)
            } catch {
              // Draw placeholder if logo fails
              ctx.fillStyle = "#1B89A4"
              ctx.beginPath()
              ctx.arc(logoX + logoSize/2, logoY + logoSize/2, logoSize/2, 0, 2 * Math.PI)
              ctx.fill()
              
              ctx.fillStyle = "#ffffff"
              ctx.font = "bold 16px Arial, sans-serif"
              ctx.textAlign = "center"
              ctx.fillText("B", logoX + logoSize/2, logoY + logoSize/2 + 5)
            }
          } else {
            // Draw placeholder
            ctx.fillStyle = "#1B89A4"
            ctx.beginPath()
            ctx.arc(logoX + logoSize/2, logoY + logoSize/2, logoSize/2, 0, 2 * Math.PI)
            ctx.fill()
            
            ctx.fillStyle = "#ffffff"
            ctx.font = "bold 16px Arial, sans-serif"
            ctx.textAlign = "center"
            ctx.fillText("B", logoX + logoSize/2, logoY + logoSize/2 + 5)
          }

          // Company name next to logo
          ctx.fillStyle = "#1B89A4"
          ctx.font = "bold 20px Arial, sans-serif"
          ctx.textAlign = "left"
          ctx.fillText("Billoq", logoX + logoSize + 8, y)
          
          // Beta badge positioned after text
          ctx.fillStyle = "#1B89A4"
          const badgeWidth = 35
          const badgeHeight = 16
          const badgeX = logoX + logoSize + 75
          const badgeY = y - 16
          drawRoundedRect(ctx, badgeX, badgeY, badgeWidth, badgeHeight, 8)
          ctx.fill()
          
          ctx.fillStyle = "#ffffff"
          ctx.font = "bold 8px Arial, sans-serif"
          ctx.textAlign = "center"
          ctx.fillText("BETA", badgeX + badgeWidth/2, badgeY + 11)

          y += 20

          // Subtitle - centered
          ctx.fillStyle = "#94a3b8"
          ctx.font = "12px Arial, sans-serif"
          ctx.textAlign = "center"
          ctx.fillText("Transaction Receipt", canvas.width / 2, y)
          y += 30

          // Status section - centered
          ctx.fillStyle = "#ffffff"
          ctx.font = "14px Arial, sans-serif"
          ctx.textAlign = "center"
          ctx.fillText(statusConfig.title, canvas.width / 2, y)
          y += 25

          // Draw status circle - centered
          const statusGradient = ctx.createRadialGradient(canvas.width / 2, y, 0, canvas.width / 2, y, 18)
          switch (transaction.status) {
            case "completed":
              statusGradient.addColorStop(0, "#34d399")
              statusGradient.addColorStop(1, "#10b981")
              break
            case "pending":
              statusGradient.addColorStop(0, "#fbbf24")
              statusGradient.addColorStop(1, "#f59e0b")
              break
            case "failed":
              statusGradient.addColorStop(0, "#f87171")
              statusGradient.addColorStop(1, "#ef4444")
              break
            default:
              statusGradient.addColorStop(0, "#9ca3af")
              statusGradient.addColorStop(1, "#6b7280")
          }
          
          ctx.fillStyle = statusGradient
          ctx.beginPath()
          ctx.arc(canvas.width / 2, y, 18, 0, 2 * Math.PI)
          ctx.fill()

          // Status icon - centered
          ctx.fillStyle = "#ffffff"
          ctx.font = "16px Arial, sans-serif"
          ctx.textAlign = "center"
          const statusIcon = transaction.status === "completed" ? "✓" : 
                            transaction.status === "pending" ? "⏱" : 
                            transaction.status === "failed" ? "✗" : "?"
          ctx.fillText(statusIcon, canvas.width / 2, y + 5)

          y += 40

          // Transaction Details Section - more compact
          ctx.fillStyle = "#0f172a"
          drawRoundedRect(ctx, 25, y - 10, canvas.width - 50, 160, 8)
          ctx.fill()

          y += 5

          ctx.fillStyle = "#1B89A4"
          ctx.font = "bold 14px Arial, sans-serif"
          ctx.textAlign = "left"
          ctx.fillText("Transaction Details", 35, y)
          y += 20

          ctx.font = "11px Arial, sans-serif"

          // Helper function to draw a row - more compact
          const drawRow = (label: string, value: string) => {
            ctx.fillStyle = "#94a3b8"
            ctx.fillText(label, 35, y)
            ctx.fillStyle = "#ffffff"
            ctx.textAlign = "right"
            ctx.fillText(value, canvas.width - 35, y)
            ctx.textAlign = "left"
            y += 18
          }

          drawRow("ID:", truncateId(transaction.id))
          drawRow("Type:", transaction.billType)
          drawRow("Amount (NGN):", `₦${transaction.amountInNaira.toLocaleString()}`)
          drawRow("Amount (USDT):", `${transaction.amountInUSDT.toFixed(2)}`)
          drawRow("Method:", transaction.paymentMethod)
          drawRow("Status:", statusConfig.statusText)
          drawRow("Date:", transaction.date)

          y += 15

          // Blockchain Information Section - more compact
          ctx.fillStyle = "#0f172a"
          drawRoundedRect(ctx, 25, y - 10, canvas.width - 50, 80, 8)
          ctx.fill()

          y += 5

          ctx.fillStyle = "#1B89A4"
          ctx.font = "bold 14px Arial, sans-serif"
          ctx.fillText("Blockchain Info", 35, y)
          y += 20

          ctx.font = "11px Arial, sans-serif"
          drawRow("Hash:", truncateId(transaction.hash))
          drawRow("Gas Fee:", transaction.gasFee)

          y += 20

          // Footer with branding - updated text
          ctx.fillStyle = "#64748b"
          ctx.font = "9px Arial, sans-serif"
          ctx.textAlign = "center"
          ctx.fillText(`Generated ${new Date().toLocaleDateString()}`, canvas.width / 2, y)
          y += 12
          ctx.fillStyle = "#1B89A4"
          ctx.font = "bold 10px Arial, sans-serif"
          ctx.fillText("Your bills paid in a single block", canvas.width / 2, y)

          // Convert canvas to blob and download
          canvas.toBlob((blob) => {
            if (blob) {
              try {
                const url = URL.createObjectURL(blob)
                const link = document.createElement("a")
                link.href = url
                link.download = `billoq-receipt-${transaction.id}.png`
                document.body.appendChild(link)
                link.click()
                document.body.removeChild(link)
                URL.revokeObjectURL(url)
                onDownload()
              } catch (downloadError) {
                console.warn("Download completed but with warning:", downloadError)
                // Still call onDownload since download likely succeeded
                onDownload()
              }
            } else {
              throw new Error("Failed to create image blob")
            }
          }, "image/png")

        } catch (error) {
          console.error("Error creating PNG:", error)
          throw error
        }
      }

      // Try to load the actual logo
      logo.onload = () => {
        createPNGReceipt()
      }
      
      logo.onerror = () => {
        console.warn("Could not load logo, using placeholder")
        createPNGReceipt()
      }

      // Set logo source to the actual navbar logo
      logo.src = "/logo.svg"

      // Fallback timeout
      setTimeout(() => {
        if (!logo.complete) {
          createPNGReceipt()
        }
      }, 1000)

    } catch (error) {
      console.error("PNG creation failed:", error)
      alert("Failed to create PNG receipt. Please try again.")
    } finally {
      setIsDownloadingPNG(false)
    }
  }

  const downloadAsPDF = async () => {
    setIsDownloadingPDF(true)
    try {
      // Import jsPDF
      const jsPDFModule = await import('jspdf')
      const jsPDF = jsPDFModule.jsPDF

      if (!jsPDF) {
        throw new Error("jsPDF not available")
      }

      const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      })

      // Colors
      const brandColor = [27, 137, 164]
      const darkBg = [15, 23, 42]
      const cardBg = [26, 34, 52]
      const textColor = [255, 255, 255]
      const grayColor = [148, 163, 184]
      
      let statusColor = [107, 114, 128]
      if (transaction.status === "completed") statusColor = [16, 185, 129]
      if (transaction.status === "pending") statusColor = [245, 158, 11]
      if (transaction.status === "failed") statusColor = [239, 68, 68]

      // Background
      doc.setFillColor(darkBg[0], darkBg[1], darkBg[2])
      doc.rect(0, 0, 210, 297, 'F')

      // Card background
      doc.setFillColor(cardBg[0], cardBg[1], cardBg[2])
      doc.roundedRect(20, 20, 170, 200, 5, 5, 'F')

      // Card border
      doc.setDrawColor(55, 65, 81)
      doc.setLineWidth(0.3)
      doc.roundedRect(20, 20, 170, 200, 5, 5, 'S')

      // Function to generate PDF content
      const generatePDFContent = (logoDataUrl?: string) => {
        let y = 40

        // Header section with logo
        if (logoDataUrl) {
          try {
            doc.addImage(logoDataUrl, 'PNG', 92, y - 8, 8, 8)
          } catch {
            console.warn("Could not add logo to PDF, using placeholder")
            // Draw placeholder logo
            doc.setFillColor(brandColor[0], brandColor[1], brandColor[2])
            doc.circle(96, y - 3, 4, 'F')
            doc.setTextColor(textColor[0], textColor[1], textColor[2])
            doc.setFontSize(8)
            doc.setFont('helvetica', 'bold')
            doc.text('B', 96, y - 1, { align: 'center' })
          }
        } else {
          // Draw placeholder logo
          doc.setFillColor(brandColor[0], brandColor[1], brandColor[2])
          doc.circle(96, y - 3, 4, 'F')
          doc.setTextColor(textColor[0], textColor[1], textColor[2])
          doc.setFontSize(8)
          doc.setFont('helvetica', 'bold')
          doc.text('B', 96, y - 1, { align: 'center' })
        }

        // Company name next to logo
        doc.setTextColor(brandColor[0], brandColor[1], brandColor[2])
        doc.setFontSize(24)
        doc.setFont('helvetica', 'bold')
        doc.text('Billoq', 103, y, { align: 'left' })

        // Beta badge positioned after text
        doc.setFillColor(brandColor[0], brandColor[1], brandColor[2])
        doc.roundedRect(130, y - 6, 12, 4, 1, 1, 'F')
        doc.setTextColor(textColor[0], textColor[1], textColor[2])
        doc.setFontSize(6)
        doc.text('BETA', 136, y - 3, { align: 'center' })

        y += 10

        // Subtitle
        doc.setTextColor(grayColor[0], grayColor[1], grayColor[2])
        doc.setFontSize(12)
        doc.setFont('helvetica', 'normal')
        doc.text('Transaction Receipt', 105, y, { align: 'center' })

        y += 15

        // Status message
        doc.setTextColor(textColor[0], textColor[1], textColor[2])
        doc.setFontSize(12)
        doc.setFont('helvetica', 'normal')
        doc.text(statusConfig.title, 105, y, { align: 'center' })

        y += 12

        // Status circle
        doc.setFillColor(statusColor[0], statusColor[1], statusColor[2])
        doc.circle(105, y, 6, 'F')
        
        // Status icon
        doc.setTextColor(textColor[0], textColor[1], textColor[2])
        doc.setFontSize(12)
        doc.setFont('helvetica', 'bold')
        
        const statusIconText = transaction.status === "completed" ? "✓" : 
                             transaction.status === "pending" ? "⏱" : 
                             transaction.status === "failed" ? "✗" : "?"
        doc.text(statusIconText, 105, y + 1.5, { align: 'center' })

        y += 20

        // Transaction Details
        doc.setFillColor(darkBg[0], darkBg[1], darkBg[2])
        doc.roundedRect(30, y - 5, 150, 60, 3, 3, 'F')

        y += 5

        doc.setTextColor(brandColor[0], brandColor[1], brandColor[2])
        doc.setFontSize(14)
        doc.setFont('helvetica', 'bold')
        doc.text('Transaction Details', 35, y)
        y += 10

        doc.setFontSize(9)
        doc.setFont('helvetica', 'normal')

        const addRow = (label: string, value: string) => {
          doc.setTextColor(grayColor[0], grayColor[1], grayColor[2])
          doc.text(label, 35, y)
          doc.setTextColor(textColor[0], textColor[1], textColor[2])
          doc.text(value, 175, y, { align: 'right' })
          y += 6
        }

        addRow('ID:', truncateId(transaction.id))
        addRow('Type:', transaction.billType)
        // Fix Naira symbol - use Unicode character
        addRow('Amount (NGN):', `N${transaction.amountInNaira.toLocaleString()}`)
        addRow('Amount (USDT):', `${transaction.amountInUSDT.toFixed(2)}`)
        addRow('Method:', transaction.paymentMethod)
        addRow('Status:', statusConfig.statusText)
        addRow('Date:', transaction.date)

        y += 10

        // Blockchain Information
        doc.setFillColor(darkBg[0], darkBg[1], darkBg[2])
        doc.roundedRect(30, y - 5, 150, 25, 3, 3, 'F')

        y += 5

        doc.setTextColor(brandColor[0], brandColor[1], brandColor[2])
        doc.setFontSize(14)
        doc.setFont('helvetica', 'bold')
        doc.text('Blockchain Information', 35, y)
        y += 10

        doc.setFontSize(9)
        doc.setFont('helvetica', 'normal')

        addRow('Hash:', truncateId(transaction.hash))
        addRow('Gas Fee:', transaction.gasFee)

        y += 15

        // Footer
        doc.setTextColor(grayColor[0], grayColor[1], grayColor[2])
        doc.setFontSize(8)
        doc.text(`Generated on ${new Date().toLocaleDateString()}`, 105, y, { align: 'center' })
        y += 6
        doc.setTextColor(brandColor[0], brandColor[1], brandColor[2])
        doc.setFontSize(9)
        doc.setFont('helvetica', 'bold')
        doc.text('Your bills paid in a single block', 105, y, { align: 'center' })

        // Save
        try {
          doc.save(`billoq-receipt-${transaction.id}.pdf`)
          onDownload()
        } catch (saveError) {
          console.warn("PDF download completed but with warning:", saveError)
          // Still call onDownload since PDF was likely generated
          onDownload()
        }
      }

      // Try to load logo for PDF
      const logoImg = new Image()
      logoImg.crossOrigin = "anonymous"
      
      logoImg.onload = () => {
        try {
          const tempCanvas = document.createElement('canvas')
          const tempCtx = tempCanvas.getContext('2d')
          if (tempCtx) {
            tempCanvas.width = 100
            tempCanvas.height = 100
            tempCtx.drawImage(logoImg, 0, 0, 100, 100)
            const logoDataUrl = tempCanvas.toDataURL('image/png')
            generatePDFContent(logoDataUrl)
          } else {
            generatePDFContent()
          }
        } catch (error) {
          console.warn("Logo conversion failed:", error)
          generatePDFContent()
        }
      }

      logoImg.onerror = () => {
        console.warn("Could not load logo for PDF")
        generatePDFContent()
      }
      
      logoImg.src = "/logo.svg"

      // Fallback timeout
      setTimeout(() => {
        if (!logoImg.complete) {
          generatePDFContent()
        }
      }, 2000)

    } catch (error) {
      console.error("PDF creation failed:", error)
      alert("Failed to create PDF receipt. Please try downloading as PNG instead.")
    } finally {
      setIsDownloadingPDF(false)
    }
  }

  return (
    <div
      id="transaction-receipt"
      className="w-full max-w-sm mx-auto bg-gradient-to-b from-[#0f172a] to-[#1e293b] text-white rounded-lg overflow-hidden shadow-2xl border border-gray-700"
    >
      {/* Header with branding - more compact */}
      <div className="bg-[#1a2234] border-b border-gray-700 px-4 py-2">
        <div className="flex items-center justify-center gap-2">
          <NextImage 
            src="/logo.svg" 
            alt="Billoq Logo" 
            width={20} 
            height={20} 
            className="w-5 h-5" 
            onError={(e) => {
              // If logo fails to load, replace with placeholder
              e.currentTarget.style.display = 'none'
              const placeholder = e.currentTarget.nextElementSibling as HTMLElement
              placeholder?.classList.remove('hidden')
            }} 
          />
          <div className="w-5 h-5 bg-[#1B89A4] rounded-full flex items-center justify-center hidden">
            <span className="text-white text-xs font-bold">B</span>
          </div>
          <div className="text-[#1B89A4] font-bold text-lg">Billoq</div>
          <span className="px-1.5 py-0.5 text-xs font-semibold bg-[#1B89A4]/20 text-[#1B89A4] rounded-full border border-[#1B89A4]/30">
            BETA
          </span>
        </div>
        <p className="text-center text-gray-400 text-xs mt-1">Transaction Receipt</p>
      </div>

      {/* Status Icon and Title - more compact */}
      <div className="flex flex-col items-center justify-center pt-4 pb-3">
        <div className={`w-12 h-12 rounded-full ${statusConfig.bgColor} flex items-center justify-center mb-2 shadow-lg border border-white/20`}>
          <StatusIcon className="w-7 h-7 text-white" />
        </div>
        <h2 className="text-base font-medium text-center px-4">{statusConfig.title}</h2>
      </div>

      {/* Transaction Details - more compact */}
      <div className="px-4 pb-4">
        <div className="bg-[#0f172a] rounded-lg p-3 mb-3 border border-gray-700">
          <h3 className="text-sm font-semibold mb-2 text-[#1B89A4]">Transaction Details</h3>
          <div className="space-y-2 text-xs">
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Transaction ID</span>
              <div className="flex items-center">
                <span className="text-right font-mono text-xs">{truncateId(transaction.id)}</span>
                <button
                  onClick={() => copyToClipboard(transaction.id, "id")}
                  className="p-1 rounded hover:bg-gray-700 ml-1 transition-colors"
                  aria-label="Copy transaction ID"
                >
                  {copied === "id" ? <Check className="h-2.5 w-2.5 text-green-500" /> : <Copy className="h-2.5 w-2.5" />}
                </button>
              </div>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Bill Type</span>
              <span className="text-right font-medium">{transaction.billType}</span>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <span className="text-gray-400 block text-xs">Amount (NGN)</span>
                <span className="font-semibold text-sm">₦{transaction.amountInNaira.toLocaleString()}</span>
              </div>
              <div className="text-right">
                <span className="text-gray-400 block text-xs">Amount (USDT)</span>
                <span className="font-semibold text-sm">${transaction.amountInUSDT.toFixed(2)}</span>
              </div>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Payment method</span>
              <span className="text-right font-medium">{transaction.paymentMethod}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Status</span>
              <span className={`flex items-center font-medium ${statusConfig.color}`}>
                <StatusIcon className="w-2.5 h-2.5 mr-1" />
                {statusConfig.statusText}
              </span>
            </div>
          </div>
        </div>

        {/* Blockchain Information - more compact */}
        <div className="bg-[#0f172a] rounded-lg p-3 mb-3 border border-gray-700">
          <h3 className="text-sm font-semibold mb-2 text-[#1B89A4]">Blockchain Information</h3>
          <div className="space-y-2 text-xs">
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Transaction Hash</span>
              <div className="flex items-center">
                <span className="font-mono text-xs">{truncateId(transaction.hash)}</span>
                <button
                  onClick={() => copyToClipboard(transaction.hash, "hash")}
                  className="p-1 rounded hover:bg-gray-700 ml-1 transition-colors"
                  aria-label="Copy transaction hash"
                >
                  {copied === "hash" ? <Check className="h-2.5 w-2.5 text-green-500" /> : <Copy className="h-2.5 w-2.5" />}
                </button>
              </div>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Gas Fee</span>
              <span className="font-medium">{transaction.gasFee}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400">View</span>
              <a
                href={explorerUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#1B89A4] hover:text-[#1B89A4]/80 flex items-center text-xs font-medium transition-colors"
              >
                Explorer <ExternalLink className="ml-1 h-2.5 w-2.5" />
              </a>
            </div>
          </div>
        </div>

        {/* Action Buttons - more compact */}
        <div className="space-y-2">
          <div className="flex gap-2">
            <button
              onClick={downloadAsPNG}
              className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white py-2 rounded-lg transition-all duration-200 text-xs flex items-center justify-center gap-1 font-medium shadow-lg"
              disabled={isDownloadingPNG || isDownloadingPDF}
            >
              {isDownloadingPNG ? (
                <>
                  <Loader2 className="h-3 w-3 animate-spin" />
                  PNG...
                </>
              ) : (
                <>
                  <Download className="h-3 w-3" />
                  PNG
                </>
              )}
            </button>
            <button
              onClick={downloadAsPDF}
              className="flex-1 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white py-2 rounded-lg transition-all duration-200 text-xs flex items-center justify-center gap-1 font-medium shadow-lg"
              disabled={isDownloadingPNG || isDownloadingPDF}
            >
              {isDownloadingPDF ? (
                <>
                  <Loader2 className="h-3 w-3 animate-spin" />
                  PDF...
                </>
              ) : (
                <>
                  <FileText className="h-3 w-3" />
                  PDF
                </>
              )}
            </button>
          </div>
          
          <button
            onClick={onReturn}
            className="w-full border border-gray-600 text-white py-2 rounded-lg hover:bg-gray-800 transition-colors text-xs font-medium"
          >
            Return to Dashboard
          </button>
        </div>

        {/* Footer branding - updated text */}
        <div className="text-center mt-3 pt-2 border-t border-gray-700">
          <p className="text-xs text-gray-500">
            <span className="text-[#1B89A4] font-medium">Your bills paid in a single block</span>
          </p>
        </div>
      </div>
    </div>
  )
}

export default TransactionSuccessCard