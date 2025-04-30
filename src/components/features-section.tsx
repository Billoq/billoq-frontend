"use client";

import { motion, useAnimation } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { useEffect, ReactNode, useCallback } from 'react';
import { AutoHighlightFeatureCards } from "./feature-card";

// AnimatedSection component (same as before)
interface AnimatedSectionProps {
  children: ReactNode;
  delay?: number;
  direction?: 'up' | 'down' | 'left' | 'right';
  className?: string;
  distance?: number;
}

export const AnimatedSection = ({ 
  children, 
  delay = 0.2,
  direction = 'up',
  className = '',
  distance = 100 
}: AnimatedSectionProps) => {
  const controls = useAnimation();
  const [ref, inView] = useInView({
    triggerOnce: false,
    threshold: 0.1
  });

  const getInitialState = useCallback(() => {
    switch (direction) {
      case 'up': return { y: distance, opacity: 0 };
      case 'down': return { y: -distance, opacity: 0 };
      case 'left': return { x: distance, opacity: 0 };
      case 'right': return { x: -distance, opacity: 0 };
      default: return { y: distance, opacity: 0 };
    }
  }, [direction, distance]);

  const getAnimateState = useCallback(() => {
    switch (direction) {
      case 'up':
      case 'down':
        return { y: 0, opacity: 1 };
      case 'left':
      case 'right':
        return { x: 0, opacity: 1 };
      default:
        return { y: 0, opacity: 1 };
    }
  }, [direction]);

  useEffect(() => {
    if (inView) {
      controls.start(getAnimateState());
    } else {
      controls.start(getInitialState());
    }
  }, [controls, inView, getAnimateState, getInitialState]);

  return (
    <motion.div
      ref={ref}
      initial={getInitialState()}
      animate={controls}
      transition={{ 
        duration: 0.8, 
        delay,
        type: "spring", 
        stiffness: 50 
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

export function FeaturesSection() {
  const features = [
    {
      iconSrc: "/digital-wallet.svg",
      title: "BLOCKCHAIN-BASED PAYMENTS",
      description: "Support for stablecoins (USDC) and native token with transparent payment processing",
    },
    {
      iconSrc: "/security.svg",
      title: "SMART CONTRACT SECURITY",
      description: "Secure contract handling for payment actions with built-in verification",
    },
    {
      iconSrc: "/carbon_security.svg",
      title: "BACKEND PAYMENT PROCESSOR",
      description: "Backend contract handling for payment actions with built-in verification",
    },
    {
      iconSrc: "/notification.svg",
      title: "NOTIFICATION SYSTEM",
      description: "Secure contract handling for payment actions with built-in verification",
    },
    {
      iconSrc: "/automatic.svg",
      title: "AUTOMATIC RECURRING PAYMENT",
      description: "Setup recurring payment for regular bills handled by smart contracts",
    },
    {
      iconSrc: "/instant.svg",
      title: "INSTANT CONFIRMATION",
      description: "Real-time transaction confirmation and payment verification",
    },
  ];

  return (
    <section className="relative py-8 md:py-16 overflow-hidden">
      {/* Background Glow Circle - Reduced on mobile */}
      <div
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] md:w-[1200px] md:h-[950px] rounded-full filter blur-lg opacity-20 md:opacity-40"
        style={{ backgroundColor: "#60A5FA" }}
      ></div>

      {/* Content Container */}
      <div className="relative z-10 bg-[#161E28] py-8 md:py-16 mx-auto px-4 sm:px-6 max-w-7xl">
        <div className="container mx-auto">
          {/* Header Section */}
          <div className="text-center md:text-left mb-8 md:mb-12 px-2">
            <AnimatedSection direction="down" delay={0.2}>
              <span className="inline-block text-[#60A5FA] text-sm md:text-[18px] font-semibold uppercase tracking-wide px-3 py-1 rounded-full bg-[#1D4ED840]">
                KEY FEATURES
              </span>
            </AnimatedSection>
            
            <AnimatedSection direction="up" delay={0.3}>
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mt-6 md:mt-10 leading-snug">
                POWERFUL FEATURES FOR{" "}
                <span className="text-[#1D4ED8]">WEB3</span> BILL PAYMENTS
              </h2>
            </AnimatedSection>
          </div>

          {/* Features Grid with Auto-Highlighting Cards */}
          <AnimatedSection direction="up" delay={0.4}>
            <AutoHighlightFeatureCards features={features} />
          </AnimatedSection>
        </div>
      </div>
    </section>
  );
}