"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import { ChevronDown, Copy, ExternalLink, LogOut, Settings, Wallet, Search } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { SearchInput } from "./search-input";
import { NotificationBell } from "./notification-bell";
import { Skeleton } from "@/components/ui/skeleton";
import {
  useActiveAccount,
  useActiveWallet,
  useActiveWalletChain,
  useConnectModal,
  useDisconnect,
  WalletIcon,
  WalletProvider,
} from "thirdweb/react";
import { thirdwebClient } from "@/lib/thirdwebClient";
import { defaultChain, supportedChains } from "@/lib/thirdwebChains";

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
  const pathname = usePathname();

  const account = useActiveAccount();
  const wallet = useActiveWallet();
  const activeChain = useActiveWalletChain();
  const { connect, isConnecting } = useConnectModal();
  const { disconnect } = useDisconnect();

  const [isLoading, setIsLoading] = useState(true);
  const [error] = useState<Error | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);

  const address = account?.address;
  const isConnected = Boolean(address);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 600);
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

  const explorerUrl = useMemo(() => {
    if (!address) return undefined;
    const explorer = activeChain?.blockExplorers?.[0]?.url;
    if (explorer) {
      return `${explorer.replace(/\/$/, "")}/address/${address}`;
    }
    return `https://etherscan.io/address/${address}`;
  }, [activeChain, address]);

  const truncateAddress = (addr?: string) =>
    addr ? `${addr.slice(0, 6)}...${addr.slice(-4)}` : "";

  const getPageTitle = () => {
    if (pathname === "/dashboard") return "Dashboard";
    const path = pathname.split("/dashboard/").filter(Boolean);
    if (path.length === 0) return "Dashboard";
    const title = path[path.length - 1];
    return title.charAt(0).toUpperCase() + title.slice(1);
  };

  const handleSearch = (query: string) => {
    onSearch?.(query);
    setIsMobileSearchOpen(false);
  };

  const handleConnect = async () => {
    try {
      await connect({
        client: thirdwebClient,
        chain: activeChain ?? defaultChain,
        chains: supportedChains,
      });
    } catch (err) {
      console.error("Connection error:", err);
    }
  };

  const handleDisconnect = () => {
    if (!wallet) return;
    setIsDropdownOpen(false);
    disconnect(wallet);
    router.push("/");
  };

  const handleCopyAddress = () => {
    if (!address) return;
    navigator.clipboard.writeText(address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const renderWalletIcon = (size: "sm" | "md" = "sm") => {
    const dimension = size === "sm" ? "w-5 h-5" : "w-6 h-6";

    if (!wallet?.id) {
      return <Wallet className={`${dimension} text-[#1B89A4]`} />;
    }

    return (
      <WalletProvider id={wallet.id}>
        <WalletIcon
          className={`${dimension} rounded-full object-cover`}
          loadingComponent={
            <div className={`${dimension} rounded-full bg-[#1B89A4]/30 animate-pulse`} />
          }
          fallbackComponent={<Wallet className={`${dimension} text-[#1B89A4]`} />}
        />
      </WalletProvider>
    );
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
      <h1 className="text-xl md:text-2xl font-bold text-white ml-12 md:ml-16 lg:ml-0">
        {getPageTitle()}
      </h1>

      <div className="flex items-center gap-2 md:gap-4">
        {pathname === "/dashboard" && (
          <div className="hidden lg:flex">
            <SearchInput onSearch={handleSearch} />
          </div>
        )}

        {pathname === "/dashboard" && (
          <div className="lg:hidden relative">
            {isMobileSearchOpen ? (
              <div className="fixed inset-x-0 top-16 z-50 mx-auto w-full max-w-md px-4 py-2 bg-[#0f172a] shadow-lg">
                <SearchInput
                  onSearch={handleSearch}
                  autoFocus
                  onBlur={() => setIsMobileSearchOpen(false)}
                />
              </div>
            ) : (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsMobileSearchOpen(true)}
                className="text-gray-400 hover:text-white"
              >
                <Search className="h-5 w-5" />
                <span className="sr-only">Search</span>
              </Button>
            )}
          </div>
        )}

        {isConnected ? (
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setIsDropdownOpen((prev) => !prev)}
              className="flex items-center gap-2 bg-[#2A3B5A] rounded-full px-2 py-2 md:px-4 hover:bg-[#374d6e] transition-colors"
            >
              <span className="hidden md:inline text-white font-medium">
                {truncateAddress(address)}
              </span>
              {renderWalletIcon("sm")}
              <ChevronDown className="w-4 h-4 text-white" />
            </button>

            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-64 bg-[#2A3B5A] rounded-lg shadow-lg z-50 border border-gray-700">
                <div className="p-4 border-b border-gray-700">
                  <div className="flex items-center gap-3">
                    {renderWalletIcon("md")}
                    <div>
                      <p className="font-medium text-white">
                        {activeChain?.name || "Connected Wallet"}
                      </p>
                      <div className="flex items-center gap-2">
                        <p className="text-sm text-gray-400">{truncateAddress(address)}</p>
                        <button
                          onClick={handleCopyAddress}
                          className={`flex items-center gap-1 transition-colors ${
                            copied ? "text-green-400" : "text-gray-400 hover:text-white"
                          }`}
                          title="Copy address"
                        >
                          <Copy className="w-4 h-4" />
                          <span className="text-xs">{copied ? "Copied" : "Copy"}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-2 space-y-1">
                  {explorerUrl && (
                    <a
                      href={explorerUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 px-3 py-2 text-gray-300 hover:bg-gray-700 rounded-md"
                    >
                      <ExternalLink className="w-5 h-5" />
                      View on Explorer
                    </a>
                  )}
                  <button
                    onClick={() => router.push("/dashboard/settings")}
                    className="w-full flex items-center gap-3 px-3 py-2 text-gray-300 hover:bg-gray-700 rounded-md cursor-pointer"
                  >
                    <Settings className="w-5 h-5" />
                    Settings
                  </button>
                  <button
                    onClick={handleDisconnect}
                    className="w-full flex items-center gap-3 px-3 py-2 text-red-400 hover:bg-gray-700 rounded-md cursor-pointer"
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
            disabled={isConnecting}
            className="bg-[#1B89A4] hover:bg-[#1B89A4]/80 disabled:opacity-60 disabled:cursor-not-allowed text-white py-2 px-4 rounded-md transition-colors"
          >
            {isConnecting ? "Connecting..." : "Connect Wallet"}
          </button>
        )}

        <NotificationBell count={notificationCount} />
      </div>
    </header>
  );
}

