"use client";
import { useState, useEffect } from 'react';
import { CreditCard, Wallet } from 'lucide-react';

export default function GlassATMCard() {
  const [isFlipped, setIsFlipped] = useState(false);
  
  // Auto rotation effect
  useEffect(() => {
    const interval = setInterval(() => {
      setIsFlipped(prev => !prev);
    }, 5000);
    
    return () => clearInterval(interval);
  }, []);

  const frontSide = (
    <div className="relative w-full h-full flex flex-col justify-between p-6 rounded-xl bg-gradient-to-br from-blue-400/30 to-purple-500/30 backdrop-blur-sm border border-white/20 shadow-lg text-white">
      <div className="flex justify-between items-start">
        <div>
          <div className="text-xs opacity-80">CRYPTO CARD</div>
          <div className="font-bold text-lg mt-1">BILLOQ Payment</div>
        </div>
        <div className="w-12 h-12 rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 flex items-center justify-center">
          <Wallet size={24} />
        </div>
      </div>
      
      <div className="space-y-1 mt-8">
        <div className="flex justify-between">
          <span className="text-xs opacity-70">BALANCE</span>
          <span className="text-xs opacity-70">CRYPTO</span>
        </div>
        <div className="flex justify-between items-baseline">
          <span className="text-2xl font-bold">5,230.42 USDT</span>
          <span className="text-sm">≈ 2,976,339.40 NGN</span>
        </div>
      </div>
      
      <div className="space-y-4">
        <div className="text-xs opacity-80 italic text-center">Pay for bills in crypto with ease</div>
        <div className="flex justify-between items-center">
          <div className="space-y-1">
            <div className="text-xs opacity-70">VALID THRU</div>
            <div>Start-Now</div>
          </div>
          <div className="text-sm">Connect your wallet</div>
        </div>
      </div>
    </div>
  );
  
  const backSide = (
    <div className="relative w-full h-full flex flex-col justify-between p-6 rounded-xl bg-gradient-to-br from-purple-500/30 to-blue-400/30 backdrop-blur-sm border border-white/20 shadow-lg text-white">
      <div className="w-full h-10 bg-black/40 my-4"></div>
      
      <div className="space-y-4 mt-4">
        <div className="bg-white/10 p-3 rounded">
          <div className="text-xs opacity-70 mb-1">CVV</div>
          <div className="text-right mr-4">***</div>
        </div>
        
        <div className="text-xs opacity-80 text-right">
          For customer service: +1 800 555 0123
        </div>
      </div>
      
      <div className="flex justify-between items-center">
        <div className="text-xs opacity-70">
          This card is property of BILLOQ Bank Inc.<br />
          Use subject to cardholder agreement
        </div>
        <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-500/70 to-blue-500/70 flex items-center justify-center">
          <CreditCard size={20} />
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex items-center justify-center w-full h-full min-h-64 ">
      <div className="perspective-1000 w-full max-w-md h-64">
        <div 
          className={`relative w-full h-full transition-transform duration-1000 transform-style-preserve-3d ${isFlipped ? 'rotate-y-180' : ''}`}
          style={{ 
            transformStyle: 'preserve-3d', 
            transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)'
          }}
        >
          {/* Front side */}
          <div 
            className="absolute w-full h-full backface-hidden" 
            style={{ backfaceVisibility: 'hidden' }}
          >
            {frontSide}
          </div>
          
          {/* Back side */}
          <div 
            className="absolute w-full h-full backface-hidden" 
            style={{ 
              backfaceVisibility: 'hidden',
              transform: 'rotateY(180deg)'
            }}
          >
            {backSide}
          </div>
        </div>
      </div>
    </div>
  );
}