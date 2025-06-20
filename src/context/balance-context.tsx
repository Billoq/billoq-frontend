"use client";

import { useState, useEffect, createContext, useContext, useCallback } from "react";
import { useAccount, useDisconnect, useChainId } from "wagmi";
import { sepolia, liskSepolia, arbitrumSepolia, bscTestnet } from "wagmi/chains";
import { fetchTokenBalance } from "@/lib/tokens";

// Type definitions for API responses
interface CoinGeckoResponse {
  "usd-coin"?: { ngn?: number };
  "tether"?: { ngn?: number };
}

interface ExchangeRateApiResponse {
  rates?: { NGN?: number };
}

interface FawazCurrencyApiResponse {
  ngn?: number;
}

interface CurrencyApiResponse {
  data?: {
    NGN?: {
      value?: number;
    };
  };
}

interface BalanceContextType {
  usdcBalance: string | null;
  usdtBalance: string | null;
  totalBalanceNGN: number | null;
  currentChain: string;
  hideBalances: boolean;
  refreshBalances: () => Promise<void>;
  disconnectWallet: () => void;
  toggleBalanceVisibility: () => void;
  exchangeRate: number | null;
  exchangeRateLoading: boolean;
  exchangeRateError: string | null;
  testAllApis: () => Promise<void>;
  debugInfo: () => void;
}

const BalanceContext = createContext<BalanceContextType | undefined>(undefined);

export const BalanceProvider = ({ children }: { children: React.ReactNode }) => {
  const { address, isConnected } = useAccount();
  const chainId = useChainId();
  const { disconnect } = useDisconnect();

  const [usdcBalance, setUsdcBalance] = useState<string | null>(null);
  const [usdtBalance, setUsdtBalance] = useState<string | null>(null);
  const [totalBalanceNGN, setTotalBalanceNGN] = useState<number | null>(null);
  const [hideBalances, setHideBalances] = useState(false);
  const [exchangeRate, setExchangeRate] = useState<number | null>(null);
  const [exchangeRateLoading, setExchangeRateLoading] = useState(false);
  const [exchangeRateError, setExchangeRateError] = useState<string | null>(null);

  // Function to fetch current USD to NGN exchange rate with multiple backup APIs
  const fetchExchangeRate = useCallback(async () => {
    setExchangeRateLoading(true);
    setExchangeRateError(null);
    
    // Array of API functions to try in order
    const apiAttempts = [
      // API 1: CoinGecko (for USDC/USDT rates)
      async () => {
        const response = await fetch(
          "https://api.coingecko.com/api/v3/simple/price?ids=usd-coin,tether&vs_currencies=ngn"
        );
        
        if (!response.ok) {
          throw new Error(`CoinGecko API error: ${response.status}`);
        }
        
        const data: CoinGeckoResponse = await response.json();
        const usdcRate = data["usd-coin"]?.ngn;
        const usdtRate = data["tether"]?.ngn;
        
        if (usdcRate && usdtRate) {
          return (usdcRate + usdtRate) / 2;
        } else if (usdcRate) {
          return usdcRate;
        } else if (usdtRate) {
          return usdtRate;
        } else {
          throw new Error("No stablecoin rate data from CoinGecko");
        }
      },

      // API 2: ExchangeRate-API.com (free, no key required)
      async () => {
        const response = await fetch(
          "https://api.exchangerate-api.com/v4/latest/USD"
        );
        
        if (!response.ok) {
          throw new Error(`ExchangeRate-API error: ${response.status}`);
        }
        
        const data: ExchangeRateApiResponse = await response.json();
        const ngnRate = data.rates?.NGN;
        
        if (!ngnRate) {
          throw new Error("No NGN rate data from ExchangeRate-API");
        }
        
        return ngnRate;
      },

      // API 3: Fawaz Ahmed's Currency API (free, no key required)
      async () => {
        const response = await fetch(
          "https://cdn.jsdelivr.net/gh/fawazahmed0/currency-api@1/latest/currencies/usd/ngn.json"
        );
        
        if (!response.ok) {
          throw new Error(`Fawaz Currency API error: ${response.status}`);
        }
        
        const data: FawazCurrencyApiResponse = await response.json();
        const ngnRate = data.ngn;
        
        if (!ngnRate) {
          throw new Error("No NGN rate data from Fawaz Currency API");
        }
        
        return ngnRate;
      },

      // API 4: Currency-API.com (free tier, no key required)
      async () => {
        const response = await fetch(
          "https://api.currency-api.com/v3/latest?base=USD&symbols=NGN"
        );
        
        if (!response.ok) {
          throw new Error(`Currency-API error: ${response.status}`);
        }
        
        const data: CurrencyApiResponse = await response.json();
        const ngnRate = data.data?.NGN?.value;
        
        if (!ngnRate) {
          throw new Error("No NGN rate data from Currency-API");
        }
        
        return ngnRate;
      }
    ];

    // Try each API in sequence until one succeeds
    for (let i = 0; i < apiAttempts.length; i++) {
      try {
        console.log(`Attempting API ${i + 1}...`);
        const rate = await apiAttempts[i]();
        
        console.log(`✅ API ${i + 1} successful - Exchange rate: ${rate} NGN per USD`);
        setExchangeRate(rate);
        setExchangeRateLoading(false);
        return; // Success! Exit the function
        
      } catch (error) {
        console.warn(`❌ API ${i + 1} failed:`, error);
        
        // If this is the last attempt, set the error
        if (i === apiAttempts.length - 1) {
          setExchangeRateError(`All APIs failed. Last error: ${error}`);
          // Fallback to a reasonable estimate if all APIs fail
          console.log("🔄 Using fallback rate of 1500 NGN per USD");
          setExchangeRate(1500);
        }
      }
    }
    
    setExchangeRateLoading(false);
  }, []);

  // Function to test all APIs and show their responses
  const testAllApis = useCallback(async () => {
    console.log("🧪 Testing all exchange rate APIs...");
    
    const apiTests = [
      {
        name: "CoinGecko",
        url: "https://api.coingecko.com/api/v3/simple/price?ids=usd-coin,tether&vs_currencies=ngn",
        extract: (data: CoinGeckoResponse) => {
          const usdcRate = data["usd-coin"]?.ngn;
          const usdtRate = data["tether"]?.ngn;
          return usdcRate && usdtRate ? (usdcRate + usdtRate) / 2 : usdcRate || usdtRate;
        }
      },
      {
        name: "ExchangeRate-API",
        url: "https://api.exchangerate-api.com/v4/latest/USD",
        extract: (data: ExchangeRateApiResponse) => data.rates?.NGN
      },
      {
        name: "Fawaz Currency API",
        url: "https://cdn.jsdelivr.net/gh/fawazahmed0/currency-api@1/latest/currencies/usd/ngn.json",
        extract: (data: FawazCurrencyApiResponse) => data.ngn
      },
      {
        name: "Currency-API",
        url: "https://api.currency-api.com/v3/latest?base=USD&symbols=NGN",
        extract: (data: CurrencyApiResponse) => data.data?.NGN?.value
      }
    ];

    for (const api of apiTests) {
      try {
        const response = await fetch(api.url);
        if (response.ok) {
          const data = await response.json();
          const rate = api.extract(data);
          console.log(`✅ ${api.name}: ${rate} NGN per USD`);
        } else {
          console.log(`❌ ${api.name}: HTTP ${response.status}`);
        }
      } catch (error) {
        console.log(`❌ ${api.name}: ${error}`);
      }
    }
  }, []);

  const getChainName = () => {
    switch (chainId) {
      case sepolia.id:
        return "Sepolia";
      case liskSepolia.id:
        return "Lisk Sepolia";
      case arbitrumSepolia.id:
        return "Arbitrum Sepolia";
      case bscTestnet.id:
        return "BSC Testnet";
      default:
        return `Chain ID ${chainId}`;
    }
  };

  const updateTotalBalance = useCallback((usdc: string, usdt: string) => {
    if (!exchangeRate) return;
    
    const usdcAmount = parseFloat(usdc) || 0;
    const usdtAmount = parseFloat(usdt) || 0;
    setTotalBalanceNGN((usdcAmount + usdtAmount) * exchangeRate);
  }, [exchangeRate]);

  const fetchBalances = useCallback(async () => {
    if (!address || !isConnected) {
      console.log("❌ Cannot fetch balances - No address or not connected");
      setUsdcBalance(null);
      setUsdtBalance(null);
      setTotalBalanceNGN(null);
      return;
    }

    console.log(`🔄 Fetching balances for ${address} on ${getChainName()}...`);
    
    try {
      // First ensure we have the latest exchange rate
      if (!exchangeRate) {
        console.log("⏳ No exchange rate found, fetching...");
        await fetchExchangeRate();
      }

      const [usdc, usdt] = await Promise.all([
        fetchTokenBalance("USDC", chainId, address),
        fetchTokenBalance("USDT", chainId, address),
      ]);

      console.log(`💰 Balances fetched - USDC: ${usdc}, USDT: ${usdt}`);
      console.log(`💱 Exchange rate: ₦${exchangeRate} per USD`);
      
      setUsdcBalance(usdc);
      setUsdtBalance(usdt);
      updateTotalBalance(usdc, usdt);
      
      const totalUSD = (parseFloat(usdc) || 0) + (parseFloat(usdt) || 0);
      const totalNGN = totalUSD * (exchangeRate || 0);
      console.log(`📊 Total: ${totalUSD} USD = ₦${totalNGN.toLocaleString()}`);
      
    } catch (error) {
      console.error("❌ Error fetching balances:", error);
      setUsdcBalance(null);
      setUsdtBalance(null);
      setTotalBalanceNGN(null);
    }
  }, [address, isConnected, chainId, updateTotalBalance, exchangeRate, fetchExchangeRate, getChainName]);

  const toggleBalanceVisibility = () => {
    setHideBalances((prev) => !prev);
  };

  const disconnectWallet = () => {
    disconnect();
  };

  // Debug function to check what's working
  const debugInfo = useCallback(() => {
    console.log("🔍 === BALANCE PROVIDER DEBUG INFO ===");
    console.log("📱 Wallet Status:");
    console.log(`   - Connected: ${isConnected}`);
    console.log(`   - Address: ${address || 'Not connected'}`);
    console.log(`   - Chain: ${getChainName()} (ID: ${chainId})`);
    console.log("");
    console.log("💱 Exchange Rate:");
    console.log(`   - Current Rate: ₦${exchangeRate || 'Not loaded'} per USD`);
    console.log(`   - Loading: ${exchangeRateLoading}`);
    console.log(`   - Error: ${exchangeRateError || 'None'}`);
    console.log("");
    console.log("💰 Token Balances:");
    console.log(`   - USDC: ${usdcBalance || 'Not loaded'}`);
    console.log(`   - USDT: ${usdtBalance || 'Not loaded'}`);
    console.log(`   - Total NGN: ₦${totalBalanceNGN?.toLocaleString() || 'Not calculated'}`);
    console.log("=====================================");
    
    // Test if fetchTokenBalance function exists
    if (typeof fetchTokenBalance !== 'function') {
      console.error("❌ fetchTokenBalance function not found! Check your @/lib/tokens import");
    } else {
      console.log("✅ fetchTokenBalance function is available");
    }
  }, [isConnected, address, chainId, exchangeRate, exchangeRateLoading, exchangeRateError, usdcBalance, usdtBalance, totalBalanceNGN, getChainName]);

  const refreshBalances = async () => {
    console.log("🔄 Manual refresh triggered...");
    await fetchExchangeRate();
    await fetchBalances();
  };

  useEffect(() => {
    // Initial exchange rate fetch
    fetchExchangeRate();
    
    // Refresh exchange rate every 5 minutes (300000ms) - rates change frequently!
    const exchangeRateInterval = setInterval(fetchExchangeRate, 300000);
    
    return () => clearInterval(exchangeRateInterval);
  }, [fetchExchangeRate]);

  useEffect(() => {
    if (isConnected) {
      console.log(`🔗 Wallet connected! Starting balance monitoring...`);
      fetchBalances();
      // Update balances every 10 seconds for real-time updates
      const balanceInterval = setInterval(() => {
        console.log("⏰ Auto-refreshing balances...");
        fetchBalances();
      }, 10000);
      return () => {
        console.log("🔌 Wallet disconnected, stopping balance monitoring");
        clearInterval(balanceInterval);
      };
    } else {
      console.log("❌ Wallet not connected, clearing balances");
      setUsdcBalance(null);
      setUsdtBalance(null);
      setTotalBalanceNGN(null);
    }
  }, [isConnected, fetchBalances]);

  const contextValue = {
    usdcBalance,
    usdtBalance,
    totalBalanceNGN,
    currentChain: getChainName(),
    hideBalances,
    refreshBalances,
    disconnectWallet,
    toggleBalanceVisibility,
    exchangeRate,
    exchangeRateLoading,
    exchangeRateError,
    testAllApis,
    debugInfo,
  };

  return (
    <BalanceContext.Provider value={contextValue}>
      {children}
    </BalanceContext.Provider>
  );
};

export const useBalance = () => {
  const context = useContext(BalanceContext);
  if (!context) throw new Error("useBalance must be used within BalanceProvider");
  return context;
};