// // src/context/balance-context.tsx
// "use client";

// import { useState, useEffect, createContext, useContext } from "react";
// import { useAccount, useDisconnect, useChainId } from "wagmi";
// import { sepolia, liskSepolia } from "wagmi/chains";
// import { fetchTokenBalance } from "@/lib/tokens";

// interface BalanceContextType {
//   usdcBalance: string | null;
//   usdtBalance: string | null;
//   totalBalanceNGN: number | null;
//   currentChain: string;
//   hideBalances: boolean;
//   refreshBalances: () => Promise<void>;
//   disconnectWallet: () => void;
//   toggleBalanceVisibility: () => void;
// }

// const BalanceContext = createContext<BalanceContextType | undefined>(undefined);

// export const BalanceProvider = ({ children }: { children: React.ReactNode }) => {
//   const { address, isConnected } = useAccount();
//   const chainId = useChainId();
//   const { disconnect } = useDisconnect();

//   const [usdcBalance, setUsdcBalance] = useState<string | null>(null);
//   const [usdtBalance, setUsdtBalance] = useState<string | null>(null);
//   const [totalBalanceNGN, setTotalBalanceNGN] = useState<number | null>(null);
//   const [hideBalances, setHideBalances] = useState(false);

//   const getChainName = () => {
//     switch (chainId) {
//       case sepolia.id:
//         return "Sepolia";
//       case liskSepolia.id:
//         return "Lisk Sepolia";
//       default:
//         return `Chain ID ${chainId}`;
//     }
//   };

//   const fetchBalances = async () => {
//     if (!address || !isConnected) {
//       setUsdcBalance(null);
//       setUsdtBalance(null);
//       setTotalBalanceNGN(null);
//       return;
//     }

//     try {
//       const [usdc, usdt] = await Promise.all([
//         fetchTokenBalance("USDC", chainId, address),
//         fetchTokenBalance("USDT", chainId, address),
//       ]);

//       setUsdcBalance(usdc);
//       setUsdtBalance(usdt);
//       updateTotalBalance(usdc, usdt);
//     } catch (error) {
//       console.error("Error fetching balances:", error);
//       setUsdcBalance(null);
//       setUsdtBalance(null);
//       setTotalBalanceNGN(null);
//     }
//   };

//   const updateTotalBalance = (usdc: string, usdt: string) => {
//     const usdcAmount = parseFloat(usdc) || 0;
//     const usdtAmount = parseFloat(usdt) || 0;
//     const exchangeRate = 1500; // Replace with actual API call
//     setTotalBalanceNGN((usdcAmount + usdtAmount) * exchangeRate);
//   };

//   const toggleBalanceVisibility = () => {
//     setHideBalances((prev) => !prev);
//   };

//   useEffect(() => {
//     if (isConnected) {
//       fetchBalances();
//       const interval = setInterval(fetchBalances, 30000);
//       return () => clearInterval(interval);
//     } else {
//       setUsdcBalance(null);
//       setUsdtBalance(null);
//       setTotalBalanceNGN(null);
//     }
//   }, [isConnected, address, chainId]);

//   return (
//     <BalanceContext.Provider
//       value={{
//         usdcBalance,
//         usdtBalance,
//         totalBalanceNGN,
//         currentChain: getChainName(),
//         hideBalances,
//         refreshBalances: fetchBalances,
//         disconnectWallet: disconnect,
//         toggleBalanceVisibility,
//       }}
//     >
//       {chainId !== sepolia.id && chainId !== liskSepolia.id && (
//         <div style={{ padding: "10px", background: "red", color: "white" }}>
//           Unsupported network ({getChainName()}). Please switch to Sepolia or Lisk Sepolia.
//         </div>
//       )}
//       {children}
//     </BalanceContext.Provider>
//   );
// };

// export const useBalance = () => {
//   const context = useContext(BalanceContext);
//   if (!context) throw new Error("useBalance must be used within BalanceProvider");
//   return context;
// };

"use client";

import { useState, useEffect, createContext, useContext, useCallback } from "react";
import { useAccount, useDisconnect, useChainId } from "wagmi";
import { sepolia, liskSepolia } from "wagmi/chains";
import { fetchTokenBalance } from "@/lib/tokens";

interface BalanceContextType {
  usdcBalance: string | null;
  usdtBalance: string | null;
  totalBalanceNGN: number | null;
  currentChain: string;
  hideBalances: boolean;
  refreshBalances: () => Promise<void>;
  disconnectWallet: () => void;
  toggleBalanceVisibility: () => void;
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

  const getChainName = () => {
    switch (chainId) {
      case sepolia.id:
        return "Sepolia";
      case liskSepolia.id:
        return "Lisk Sepolia";
      default:
        return `Chain ID ${chainId}`;
    }
  };

  const updateTotalBalance = useCallback((usdc: string, usdt: string) => {
    const usdcAmount = parseFloat(usdc) || 0;
    const usdtAmount = parseFloat(usdt) || 0;
    const exchangeRate = 1500; // Replace with actual API call
    setTotalBalanceNGN((usdcAmount + usdtAmount) * exchangeRate);
  }, []);

  const fetchBalances = useCallback(async () => {
    if (!address || !isConnected) {
      setUsdcBalance(null);
      setUsdtBalance(null);
      setTotalBalanceNGN(null);
      return;
    }

    try {
      const [usdc, usdt] = await Promise.all([
        fetchTokenBalance("USDC", chainId, address),
        fetchTokenBalance("USDT", chainId, address),
      ]);

      setUsdcBalance(usdc);
      setUsdtBalance(usdt);
      updateTotalBalance(usdc, usdt);
    } catch (error) {
      console.error("Error fetching balances:", error);
      setUsdcBalance(null);
      setUsdtBalance(null);
      setTotalBalanceNGN(null);
    }
  }, [address, isConnected, chainId, updateTotalBalance]);

  const toggleBalanceVisibility = () => {
    setHideBalances((prev) => !prev);
  };

  useEffect(() => {
    if (isConnected) {
      fetchBalances();
      const interval = setInterval(fetchBalances, 30000);
      return () => clearInterval(interval);
    } else {
      setUsdcBalance(null);
      setUsdtBalance(null);
      setTotalBalanceNGN(null);
    }
  }, [isConnected, fetchBalances]);

  return (
    <BalanceContext.Provider
      value={{
        usdcBalance,
        usdtBalance,
        totalBalanceNGN,
        currentChain: getChainName(),
        hideBalances,
        refreshBalances: fetchBalances,
        disconnectWallet: disconnect,
        toggleBalanceVisibility,
      }}
    >
      {chainId !== sepolia.id && chainId !== liskSepolia.id && (
        <div className="warning-banner">
          Unsupported network ({getChainName()}). Please switch to Sepolia or Lisk Sepolia.
        </div>
      )}
      {children}
    </BalanceContext.Provider>
  );
};

export const useBalance = () => {
  const context = useContext(BalanceContext);
  if (!context) throw new Error("useBalance must be used within BalanceProvider");
  return context;
};