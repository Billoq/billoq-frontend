'use client'

import Link from "next/link"
import { Button } from "./ui/button"
import Image from "next/image"
import { useState, useRef, useEffect } from "react"
import { useAppKit } from "@reown/appkit/react"
import { useAccount, useDisconnect, useChainId } from "wagmi"
import { Menu, X, ChevronDown, ExternalLink, Copy, Settings, LogOut } from "lucide-react"

interface NavItem {
  label: string
  href: string
}

const navItems: NavItem[] = [
  { label: "Home", href: "/" },
  { label: "Services", href: "/services" },
  { label: "Features", href: "/features" },
  { label: "About Us", href: "/about-us" },
  { label: "FAQs", href: "/faqs" },
]

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isWalletDropdownOpen, setIsWalletDropdownOpen] = useState(false)
  const [isCopied, setIsCopied] = useState(false)
  const appKit = useAppKit()
  const { address, isConnected } = useAccount()
  const { disconnect } = useDisconnect()
  const chainId = useChainId()
  const dropdownRef = useRef<HTMLDivElement>(null)

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const toggleWalletDropdown = () => {
    setIsWalletDropdownOpen(!isWalletDropdownOpen)
  }

  // Updated connect handler using AppKit
  const handleConnect = () => {
    if (!isConnected) {
      appKit.open()
    } else {
      toggleWalletDropdown()
    }
  }

  // Updated disconnect handler using wagmi's disconnect
  const handleDisconnect = () => {
    disconnect()
    setIsWalletDropdownOpen(false)
  }

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  }

  const copyToClipboard = () => {
    if (address) {
      navigator.clipboard.writeText(address)
      setIsCopied(true)
      setTimeout(() => setIsCopied(false), 2000)
    }
  }

  const getEtherscanUrl = () => {
    // Define etherscan URLs for different networks
    const etherscanBaseUrls: Record<number, string> = {
      1: "https://etherscan.io", // Mainnet
      5: "https://goerli.etherscan.io", // Goerli
      11155111: "https://sepolia.etherscan.io", // Sepolia
      42161: "https://arbiscan.io", // Arbitrum
      // Add Lisk networks
      3000: "https://liskscan.com", // Lisk Mainnet (example URL)
      3001: "https://sepolia.liskscan.com", // Lisk Sepolia (example URL)
    }

    const baseUrl = etherscanBaseUrls[chainId] || "https://etherscan.io"
    return `${baseUrl}/address/${address}`
  }

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsWalletDropdownOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  // Monitor connection status and update UI
  useEffect(() => {
    if (!isConnected) {
      setIsWalletDropdownOpen(false)
    }
  }, [isConnected])

  return (
    <nav className="flex items-center justify-between pt-4 px-4 md:px-12 w-full">
      <div className="flex items-center">
        <Link href="/" className="flex items-center">
          <div className="text-blue-500 font-bold text-2xl flex gap-2 items-center">
            <Image
              src="/logo.png"
              alt="Billoq Logo"
              width={40}
              height={40}
              className="w-10 h-10"
            />
            Billoq
          </div>
        </Link>
      </div>

      {/* Desktop Navigation */}
      <div className="hidden md:flex items-center space-x-8">
        {navItems.map((item) => (
          <Link
            key={item.label}
            href={item.href}
            className="text-gray-200 hover:text-white transition-colors"
          >
            {item.label}
          </Link>
        ))}
      </div>

      {/* Connect Wallet Button - Desktop */}
      <div className="hidden md:block relative" ref={dropdownRef}>
        <Button 
          onClick={handleConnect}
          className="bg-blue-600 hover:bg-blue-700 text-white py-3 cursor-pointer px-10 flex items-center gap-2"
        >
          {isConnected ? (
            <>
              {formatAddress(address!)}
              <ChevronDown size={16} className={isWalletDropdownOpen ? "rotate-180 transition-transform" : "transition-transform"} />
            </>
          ) : (
            "Connect Wallet"
          )}
        </Button>

        {/* Wallet Dropdown Menu */}
        {isConnected && isWalletDropdownOpen && (
          <div className="absolute right-0 mt-2 w-72 bg-gray-800 rounded-md shadow-lg py-1 z-50">
            <div className="px-4 py-3 text-sm text-gray-300 border-b border-gray-700">
              <p className="font-medium mb-2">Connected Wallet</p>
              <div className="flex items-center justify-between bg-gray-700 p-2 rounded-md">
                <p className="text-xs break-all truncate mr-2">{address}</p>
                <button 
                  onClick={copyToClipboard} 
                  className="text-gray-400 hover:text-white transition-colors"
                  title="Copy address"
                >
                  {isCopied ? "Copied!" : <Copy size={16} />}
                </button>
              </div>
            </div>
            
            <div className="py-1">
              <a
                href={getEtherscanUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 cursor-pointer transition-colors"
              >
                <ExternalLink size={16} className="mr-2" />
                View on Explorer
              </a>
              
              <Link
                href="/settings"
                className="flex items-center px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 cursor-pointer transition-colors"
              >
                <Settings size={16} className="mr-2" />
                Settings
              </Link>
              
              <button
                type="button"
                className="w-full flex items-center px-4 py-2 text-sm text-red-400 hover:bg-gray-700 cursor-pointer transition-colors"
                onClick={handleDisconnect}
              >
                <LogOut size={16} className="mr-2" />
                Disconnect Wallet
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Mobile Menu Button */}
      <div className="flex md:hidden items-center gap-4">
        <div className="relative" ref={dropdownRef}>
          <Button 
            onClick={handleConnect}
            className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 text-sm flex items-center gap-1 cursor-pointer"
          >
            {isConnected ? (
              <>
                {formatAddress(address!)}
                <ChevronDown size={14} className={isWalletDropdownOpen ? "rotate-180 transition-transform" : "transition-transform"} />
              </>
            ) : (
              "Connect"
            )}
          </Button>

          {/* Mobile Wallet Dropdown */}
          {isConnected && isWalletDropdownOpen && (
            <div className="absolute right-0 mt-2 w-64 bg-gray-800 rounded-md shadow-lg py-1 z-50">
              <div className="px-4 py-3 text-sm text-gray-300 border-b border-gray-700">
                <p className="font-medium mb-2">Connected Wallet</p>
                <div className="flex items-center justify-between bg-gray-700 p-2 rounded-md">
                  <p className="text-xs break-all truncate mr-2">{address}</p>
                  <button 
                    onClick={copyToClipboard} 
                    className="text-gray-400 hover:text-white transition-colors"
                    title="Copy address"
                  >
                    {isCopied ? "Copied!" : <Copy size={16} />}
                  </button>
                </div>
              </div>
              
              <div className="py-1">
                <a
                  href={getEtherscanUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 cursor-pointer transition-colors"
                >
                  <ExternalLink size={16} className="mr-2" />
                  View on Explorer
                </a>
                
                <Link
                  href="/settings"
                  className="flex items-center px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 cursor-pointer transition-colors"
                >
                  <Settings size={16} className="mr-2" />
                  Settings
                </Link>
                
                <button
                  type="button"
                  className="w-full flex items-center px-4 py-2 text-sm text-red-400 hover:bg-gray-700 cursor-pointer transition-colors"
                  onClick={handleDisconnect}
                >
                  <LogOut size={16} className="mr-2" />
                  Disconnect Wallet
                </button>
              </div>
            </div>
          )}
        </div>
        
        <button
          onClick={toggleMenu}
          className="text-gray-200 hover:text-white focus:outline-none"
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-20 left-0 right-0 bg-gray-900 p-4 z-40">
          <div className="flex flex-col space-y-4">
            {navItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="text-gray-200 hover:text-white transition-colors block py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  )
}