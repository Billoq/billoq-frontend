"use client";

import Image from "next/image";
import { useEffect } from "react";
import { motion, useAnimation } from "framer-motion";
import { useInView } from "react-intersection-observer";

export function HowItWorks() {
  const controls = useAnimation();
  const [ref, inView] = useInView({
    triggerOnce: false,
    threshold: 0.2,
  });

  // Animation to repeat every 5 seconds
  useEffect(() => {
    let interval: string | number | NodeJS.Timeout | undefined;
    
    if (inView) {
      // Start the animation cycle when section is in view
      interval = setInterval(() => {
        animateCards();
      }, 5000);
      
      // Initial animation
      animateCards();
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [inView]);
  
  const animateCards = async () => {
    // Reset all cards
    await controls.start(() => ({
      scale: 1,
      transition: { duration: 0.3 }
    }));
    
    // Animate each card sequentially
    for (let i = 0; i < 4; i++) {
      await controls.start(index => ({
        scale: index === i ? 1.1 : 1,
        transition: { 
          duration: 0.5,
          type: "spring",
          stiffness: 300
        }
      }));
      
      // Hold for a moment
      await new Promise(resolve => setTimeout(resolve, 600));
      
      // Return to normal
      await controls.start(() => ({
        scale: 1,
        transition: { 
          duration: 0.3,
          type: "spring",
          stiffness: 300
        }
      }));
      
      // Small pause between cards
      await new Promise(resolve => setTimeout(resolve, 200));
    }
  };

  const cardItems = [
    {
      image: "./cw.svg",
      alt: "Connect Wallet",
      title: "Connect Wallet",
      description: "To interact with our decentralized platform, you'll securely connect your Web3 wallet (e.g. MetaMask, Trust Wallet, WalletConnect, compatible wallets)."
    },
    {
      image: "./explore.svg",
      alt: "Explore Available Services",
      title: "Explore Available Services",
      description: "Once your wallet is connected, you can browse a diverse range of digital services available on our platform. Each listing provides clear information about its service."
    },
    {
      image: "./approve.svg",
      alt: "Approve The Token Transaction",
      title: "Approve The Token Transaction",
      description: "Carefully review the transaction details in your wallet and click \"Approve.\" Transaction gas network fee (gwei) may apply, as a standard for blockchain transactions."
    },
    {
      image: "./sub.svg",
      alt: "Subscription Confirmed",
      title: "Subscription Confirmed",
      description: "Once your transaction is confirmed on the blockchain, your subscription is activated. You'll receive an on-chain confirmation within our DApp, along with a transaction ID."
    }
  ];

  return (
    <div ref={ref} className="bg-[#121520] flex flex-col items-center py-16 px-4">
      <div className="text-center mb-12">
        <div className="inline-block bg-[#243880] text-blue-300 text-sm font-medium px-4 py-1 rounded-full mb-4">
          KEY STEPS
        </div>
        <h1 className="text-4xl font-bold text-white">
          How It <span className="text-[#1D4ED8]">Works</span>
        </h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl w-full">
        {cardItems.map((card, index) => (
          <motion.div
            key={index}
            custom={index}
            animate={controls}
            initial={{ scale: 1 }}
            whileHover={{ scale: 1.05 }}
            className="bg-[#1e2130] rounded-lg p-6 flex flex-col items-center text-center cursor-pointer transition-shadow duration-300 hover:shadow-lg hover:shadow-blue-500/20"
          >
            <div className="mb-4">
              <Image 
                src={card.image} 
                alt={card.alt} 
                width={64} 
                height={64}
              />
            </div>
            <h3 className="text-white text-xl font-semibold mb-2">{card.title}</h3>
            <p className="text-gray-400 text-sm">
              {card.description}
            </p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}