"use client";

import Link from "next/link";
import Image from "next/image";
import { ExternalLink, LogOut, Menu, Settings, Wallet, X } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
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
import {
  defaultChain,
  supportedChains,
} from "@/lib/thirdwebChains";

interface NavItem {
  label: string;
  href: string;
}

const navItems: NavItem[] = [
  { label: "Home", href: "/" },
  { label: "Services", href: "/services" },
  { label: "Features", href: "/features" },
  { label: "About Us", href: "/about" },
  { label: "V2 Waitlist", href: "/#waitlist" },
  { label: "FAQs", href: "/faqs" },
];

export function Navbar() {
  const [mounted, setMounted] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const router = useRouter();

  const account = useActiveAccount();
  const wallet = useActiveWallet();
  const activeChain = useActiveWalletChain();
  const { connect, isConnecting } = useConnectModal();
  const { disconnect } = useDisconnect();

  const address = account?.address;
  const isConnected = Boolean(address);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (isConnected && pathname !== "/dashboard") {
      router.push("/dashboard");
    }
  }, [isConnected, pathname, router]);

  useEffect(() => {
    if (!isConnected && pathname.startsWith("/dashboard")) {
      router.push("/");
    }
  }, [isConnected, pathname, router]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
      if (
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(event.target as Node) &&
        !(event.target as Element).closest("[data-menu-toggle]")
      ) {
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  const truncateAddress = (addr?: string) =>
    addr ? `${addr.slice(0, 6)}...${addr.slice(-4)}` : "";

  const explorerUrl = useMemo(() => {
    if (!address) return undefined;
    const explorer = activeChain?.blockExplorers?.[0]?.url;
    if (explorer) {
      return `${explorer.replace(/\/$/, "")}/address/${address}`;
    }
    return `https://etherscan.io/address/${address}`;
  }, [activeChain, address]);

  const handleConnect = async () => {
    try {
      await connect({
        client: thirdwebClient,
        chain: activeChain ?? defaultChain,
        chains: supportedChains,
      });
    } catch (error) {
      console.error("Connection error:", error);
    }
  };

  const handleDisconnect = async () => {
    if (!wallet) return;
    setIsDropdownOpen(false);
    try {
      disconnect(wallet);
      router.push("/");
    } catch (error) {
      console.error("Disconnect error:", error);
    }
  };

  const isActive = (href: string) => pathname === href;

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

  return (
    <nav className="flex items-center justify-between pt-[16px] px-6 md:px-12 w-full relative">
      <div className="flex items-center">
        <Link href="/" className="flex items-center">
          <div className="text-[#1B89A4] font-bold text-2xl flex gap-2 items-center">
            <Image src="/logo.svg" alt="Billoq Logo" width={40} height={40} className="w-10 h-10" />
            Billoq
            <span className="px-2 py-0.5 text-xs font-semibold bg-[#1B89A4]/20 text-[#1B89A4] rounded-full border border-[#1B89A4]/30">
              BETA
            </span>
          </div>
        </Link>
      </div>

      <div className="hidden md:flex items-center space-x-8">
        {navItems.map((item) => (
          <Link
            key={item.label}
            href={item.href}
            className={`transition-colors ${isActive(item.href) ? "text-[#1B89A4] font-medium" : "text-gray-200 hover:text-[#1B89A4]/60"
              }`}
          >
            {item.label}
          </Link>
        ))}
      </div>

      {isMobileMenuOpen && (
        <div
          ref={mobileMenuRef}
          className="absolute top-full left-0 right-0 bg-[#1a2234] mt-2 py-4 px-6 rounded-lg shadow-lg z-40 md:hidden flex flex-col space-y-4"
        >
          {navItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className={`transition-colors ${isActive(item.href) ? "text-[#1B89A4] font-medium" : "text-gray-200 hover:text-[#1B89A4]/60"
                }`}
            >
              {item.label}
            </Link>
          ))}
        </div>
      )}

      <div className="flex items-center gap-2">
        {!mounted ? (
          <button className="bg-[#1B89A4] text-white py-2 px-4 md:py-3 md:px-10 rounded-md text-sm md:text-base cursor-pointer">
            Sign In
          </button>
        ) : isConnected ? (
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setIsDropdownOpen((prev) => !prev)}
              className="flex items-center gap-2 bg-[#2A3B5A] rounded-full px-2 py-1 md:px-4 md:py-2 hover:bg-[#374d6e] transition-colors text-sm md:text-base"
            >
              <span className="text-white font-medium hidden sm:inline">
                {truncateAddress(address)}
              </span>
              <span className="text-white font-medium sm:hidden">
                {address ? `${address.slice(0, 4)}...` : ""}
              </span>
              {renderWalletIcon("sm")}
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
                      <p className="text-sm text-gray-400">{truncateAddress(address)}</p>
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
            className="bg-[#1B89A4] hover:bg-[#1B89A4]/80 disabled:opacity-60 disabled:cursor-not-allowed text-white py-2 px-4 md:py-3 md:px-10 rounded-md transition-colors text-sm md:text-base cursor-pointer"
          >
            {isConnecting ? "Connecting..." : "Sign In"}
          </button>
        )}

        <button
          className="md:hidden text-white"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          data-menu-toggle
        >
          {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>
    </nav>
  );
}

