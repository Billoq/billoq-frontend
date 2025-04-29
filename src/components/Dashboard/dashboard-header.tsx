"use client";

import { useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { SearchInput } from "./search-input";
import { NotificationBell } from "./notification-bell";
import { Skeleton } from "@/components/ui/skeleton";
import { useAppKitAccount, useAppKit } from "@reown/appkit/react";
import { useDisconnect } from "@reown/appkit/react";
import { useWalletInfo } from "@reown/appkit/react";
import { useAccount, useDisconnect as useWagmiDisconnect } from "wagmi";
import { ChevronDown, ExternalLink, LogOut, Settings, Wallet } from "lucide-react";
import { useRouter } from "next/navigation";

interface DashboardHeaderProps {
  username?: string;
  avatarUrl?: string;
  onSearch?: (query: string) => void;
  notificationCount?: number;
}

export function DashboardHeader({
  onSearch,
  notificationCount = 0,
}: DashboardHeaderProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [error] = useState<Error | null>(null);
  const pathname = usePathname();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  // AppKit hooks
  const { address: appkitAddress, isConnected: appkitIsConnected } = useAppKitAccount();
  const {  close } = useAppKit();
  const { walletInfo } = useWalletInfo();
  const { disconnect: appkitDisconnect } = useDisconnect();
  
  // Wagmi hooks
  const { address: wagmiAddress, isConnected: wagmiIsConnected, connector } = useAccount();
  const { disconnect: wagmiDisconnect } = useWagmiDisconnect();
  
  const address = appkitAddress || wagmiAddress;
  const isConnected = appkitIsConnected || wagmiIsConnected;

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

  const handleDisconnect = () => {
    setIsDropdownOpen(false);
    
    try {
      if (appkitIsConnected) {
        appkitDisconnect();
      }
      if (wagmiIsConnected) {
        wagmiDisconnect();
      }
      close();
      router.push('/');
    } catch (error) {
      console.error("Disconnect error:", error);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const getPageTitle = () => {
    if (pathname === "/dashboard") return "Dashboard";

    const path = pathname.split("/dashboard/").filter(Boolean);
    if (path.length === 0) return "Dashboard";

    const title = path[path.length - 1];
    return title.charAt(0).toUpperCase() + title.slice(1);
  };

  const handleSearch = (query: string) => {
    if (onSearch) {
      onSearch(query);
    }
  };

  if (error) {
    return (
      <div className="flex h-16 items-center justify-between bg-red-900/20 px-4 md:px-6">
        <h1 className="text-2xl font-bold">Error</h1>
        <p className="text-red-400">Failed to load header: {error.message}</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex h-16 items-center justify-between bg-[#0f172a] px-4 md:px-6">
        <Skeleton className="h-8 w-32" />
        <div className="flex items-center gap-4">
          <Skeleton className="h-10 w-64 rounded-full" />
          <Skeleton className="h-8 w-8 rounded-full" />
          <Skeleton className="h-8 w-24" />
        </div>
      </div>
    );
  }

  return (
    <header className="flex h-16 items-center justify-between bg-[#0f172a] px-4 md:px-6">
      <h1 className="text-2xl font-bold text-white">{getPageTitle()}</h1>

      <div className="flex items-center gap-4">
        <div className="lg:flex hidden md:block">
          <SearchInput onSearch={handleSearch} />
        </div>

        {isConnected ? (
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center gap-2 bg-[#2A3B5A] rounded-full px-4 py-2 hover:bg-[#374d6e] transition-colors"
            >
              <span className="text-white font-medium">{truncateAddress(address)}</span>
              {getWalletIcon()}
              <ChevronDown className="w-4 h-4 text-white" />
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
            onClick={() => router.push('/')}
            className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md transition-colors"
          >
            Connect Wallet
          </button>
        )}

        <NotificationBell count={notificationCount} />
      </div>
    </header>
  );
}