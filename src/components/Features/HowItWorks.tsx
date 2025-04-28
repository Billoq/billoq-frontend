// app/how-it-works/page.jsx
import Image from "next/image";

export function HowItWorks() {
  return (
    <div className="bg-[#121520] min-h-screen flex flex-col items-center py-16 px-4">
      <div className="text-center mb-12">
        <div className="inline-block bg-[#243880] text-blue-300 text-sm font-medium px-4 py-1 rounded-full mb-4">
          KEY STEPS
        </div>
        <h1 className="text-4xl font-bold text-white">
          How It <span className="text-[#1D4ED8]">Works</span>
        </h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl w-full">
        {/* Card 1 */}
        <div className="bg-[#1e2130] rounded-lg p-6 flex flex-col items-center text-center">
          <div className="mb-4">
            <Image 
              src="./cw.svg" 
              alt="Connect Wallet" 
              width={64} 
              height={64}
              className="text-blue-400" 
            />
          </div>
          <h3 className="text-white text-xl font-semibold mb-2">Connect Wallet</h3>
          <p className="text-gray-400 text-sm">
            To interact with our decentralized platform, you'll securely connect your Web3 wallet (e.g. MetaMask, Trust Wallet, WalletConnect, compatible wallets).
          </p>
        </div>

        {/* Card 2 */}
        <div className="bg-[#1e2130] rounded-lg p-6 flex flex-col items-center text-center">
          <div className="mb-4">
            <Image 
              src="./explore.svg" 
              alt="Explore Available Services" 
              width={64} 
              height={64} 
            />
          </div>
          <h3 className="text-white text-xl font-semibold mb-2">Explore Available Services</h3>
          <p className="text-gray-400 text-sm">
            Once your wallet is connected, you can browse a diverse range of digital services available on our platform. Each listing provides clear information about its service.
          </p>
        </div>

        {/* Card 3 */}
        <div className="bg-[#1e2130] rounded-lg p-6 flex flex-col items-center text-center">
          <div className="mb-4">
            <Image 
              src="./approve.svg" 
              alt="Approve The Token Transaction" 
              width={64} 
              height={64} 
            />
          </div>
          <h3 className="text-white text-xl font-semibold mb-2">Approve The Token Transaction</h3>
          <p className="text-gray-400 text-sm">
            Carefully review the transaction details in your wallet and click "Approve." Transaction gas network fee (gwei) may apply, as a standard for blockchain transactions.
          </p>
        </div>

        {/* Card 4 */}
        <div className="bg-[#1e2130] rounded-lg p-6 flex flex-col items-center text-center">
          <div className="mb-4">
            <Image 
              src="./sub.svg" 
              alt="Subscription Confirmed" 
              width={64} 
              height={64} 
            />
          </div>
          <h3 className="text-white text-xl font-semibold mb-2">Subscription Confirmed</h3>
          <p className="text-gray-400 text-sm">
            Once your transaction is confirmed on the blockchain, your subscription is activated. You'll receive an on-chain confirmation within our DApp, along with a transaction ID.
          </p>
        </div>
      </div>
    </div>
  );
}