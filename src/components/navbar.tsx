"use client";

import Link from "next/link";
import Image from "next/image";
import { useAppKitAccount, useAppKit } from "@reown/appkit/react";
import { useDisconnect } from "@reown/appkit/react";
import { useWalletInfo } from "@reown/appkit/react";
import { useAccount, useDisconnect as useWagmiDisconnect } from "wagmi";
import { ChevronDown, ExternalLink, LogOut, Menu, Settings, Wallet, X } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

interface NavItem {
  label: string;
  href: string;
}

const navItems: NavItem[] = [
  { label: "Home", href: "/" },
  { label: "Services", href: "/services" },
  { label: "Features", href: "/features" },
  { label: "About Us", href: "/about" },
  { label: "FAQs", href: "/faqs" },
];

export function Navbar() {
  const [mounted, setMounted] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  
  // AppKit hooks
  const { address: appkitAddress, isConnected: appkitIsConnected } = useAppKitAccount();
  const { open, close } = useAppKit();
  const { walletInfo } = useWalletInfo();
  const { disconnect: appkitDisconnect } = useDisconnect();
  
  // Wagmi hooks
  const { address: wagmiAddress, isConnected: wagmiIsConnected, connector } = useAccount();
  const { disconnect: wagmiDisconnect } = useWagmiDisconnect();
  
  const address = appkitAddress || wagmiAddress;
  const isConnected = appkitIsConnected || wagmiIsConnected;
  
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(() => setMounted(true), []);

  const truncateAddress = (addr: string | undefined) => 
    addr ? `${addr.slice(0, 6)}...${addr.slice(-4)}` : "";

  const getWalletIcon = () => {
    if (walletInfo?.icon) {
      return (
        <img
          src={walletInfo.icon}
          alt={walletInfo.name}
          className="w-6 h-6 rounded-full"
          onError={(e) => (e.currentTarget.style.display = "none")}
        />
      );
    }
    if (connector?.icon) {
      return (
        <img
          src={connector.icon}
          alt={connector.name}
          className="w-6 h-6 rounded-full"
          onError={(e) => (e.currentTarget.style.display = "none")}
        />
      );
    }
    return <Wallet className="w-6 h-6 text-blue-500" />;
  };

  const getWalletName = () => 
    walletInfo?.name || connector?.name || "Connected Wallet";

  const handleConnect = async () => {
    try {
      await open();
    } catch (error) {
      console.error("Connection error:", error);
    }
  };

  const handleDisconnect = () => {
    console.log("Disconnect initiated");
    setIsDropdownOpen(false);
    
    try {
      if (appkitIsConnected) {
        console.log("Disconnecting AppKit");
        appkitDisconnect();
      }
      if (wagmiIsConnected) {
        console.log("Disconnecting Wagmi");
        wagmiDisconnect();
      }
      close();
    } catch (error) {
      console.error("Disconnect error:", error);
    }
  };

  // Check if a navigation item is active
  const isActive = (href: string) => {
    return pathname === href;
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
      if (
        mobileMenuRef.current && 
        !mobileMenuRef.current.contains(event.target as Node) &&
        !(event.target as Element).closest('[data-menu-toggle]')
      ) {
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  return (
    <nav className="flex items-center justify-between pt-[16px] px-6 md:px-12 w-full relative">
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
            className={`transition-colors ${
              isActive(item.href)
                ? "text-blue-500 font-medium"
                : "text-gray-200 hover:text-blue-400"
            }`}
          >
            {item.label}
          </Link>
        ))}
      </div>

      {/* Mobile Navigation Menu */}
      {isMobileMenuOpen && (
        <div 
          ref={mobileMenuRef}
          className="absolute top-full left-0 right-0 bg-[#1a2234] mt-2 py-4 px-6 rounded-lg shadow-lg z-40 md:hidden flex flex-col space-y-4"
        >
          {navItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className={`transition-colors ${
                isActive(item.href)
                  ? "text-blue-500 font-medium"
                  : "text-gray-200 hover:text-blue-400"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </div>
      )}

      <div className="flex items-center gap-2">
        {!mounted ? (
          <button className="bg-blue-600 text-white py-2 px-4 md:py-3 md:px-10 rounded-md text-sm md:text-base">
            Connect Wallet
          </button>
        ) : isConnected ? (
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center gap-2 bg-[#2A3B5A] rounded-full px-2 py-1 md:px-4 md:py-2 hover:bg-[#374d6e] transition-colors text-sm md:text-base"
            >
              <span className="text-white font-medium hidden sm:inline">{truncateAddress(address)}</span>
              <span className="text-white font-medium sm:hidden">
                {address ? `${address.slice(0, 4)}...` : ""}
              </span>
              {getWalletIcon()}
              <ChevronDown className="w-4 h-4 md:w-5 md:h-5 text-white" />
            </button>

            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-64 bg-[#2A3B5A] rounded-lg shadow-lg z-50 border border-gray-700">
                <div className="p-4 border-b border-gray-700">
                  <div className="flex items-center gap-3">
                    {getWalletIcon()}
                    <div>
                      <p className="font-medium text-white">{getWalletName()}</p>
                      <p className="text-sm text-gray-400">{truncateAddress(address)}</p>
                    </div>
                  </div>
                </div>

                <div className="p-2">
                  <a
                    href={`https://etherscan.io/address/${address}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 px-3 py-2 text-gray-300 hover:bg-gray-700 rounded-md"
                  >
                    <ExternalLink className="w-5 h-5" />
                    View on Explorer
                  </a>
                  <button className="w-full flex items-center gap-3 px-3 py-2 text-gray-300 hover:bg-gray-700 rounded-md">
                    <Settings className="w-5 h-5" />
                    Settings
                  </button>
                  <button
                    onClick={handleDisconnect}
                    className="w-full flex items-center gap-3 px-3 py-2 text-red-400 hover:bg-gray-700 rounded-md"
                  >
                    <LogOut className="w-5 h-5" />
                    Disconnect
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <button
            onClick={handleConnect}
            className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 md:py-3 md:px-10 rounded-md transition-colors text-sm md:text-base"
          >
            Connect Wallet
          </button>
        )}

        {/* Mobile Menu Toggle Button - Now positioned after wallet button */}
        <button 
          className="md:hidden text-white"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          data-menu-toggle
        >
          {isMobileMenuOpen ? (
            <X className="w-6 h-6" />
          ) : (
            <Menu className="w-6 h-6" />
          )}
        </button>
      </div>
    </nav>
  );
}