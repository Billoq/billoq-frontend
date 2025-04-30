"use client";

import { Navbar } from "../navbar";
import Image from "next/image";
import { motion, useAnimation } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { useEffect, useCallback } from 'react';
import { ReactNode } from 'react';

interface AnimatedSectionProps {
  children: ReactNode;
  delay?: number;
  direction?: 'up' | 'down' | 'left' | 'right';
  className?: string;
  distance?: number;
}

const AnimatedSection = ({ 
  children, 
  delay = 0.2,
  direction = 'up',
  className = '',
  distance = 100 // More pronounced movement
}: AnimatedSectionProps) => {
  const controls = useAnimation();
  const [ref, inView] = useInView({
    triggerOnce: false, // Changed to false so animations can repeat when scrolling
    threshold: 0.1
  });

  // Store animation states in refs or state to avoid dependency issues
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

  // Solution 1: Using ESLint comment to disable the warning
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (inView) {
      controls.start(getAnimateState());
    } else {
      controls.start(getInitialState());
    }
  }, [controls, inView, getAnimateState, getInitialState]);

  /* 
  // Solution 2: Alternative approach - move functions inside useEffect
  useEffect(() => {
    const applyAnimations = () => {
      if (inView) {
        controls.start(getAnimateState());
      } else {
        controls.start(getInitialState());
      }
    };
    
    applyAnimations();
  }, [controls, inView, getAnimateState, getInitialState]);
  */

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

export function FeatureSection() {
  // For background blobs animation
  const blobVariants = {
    animate: {
      scale: [1, 1.1, 1],
      opacity: [0.2, 0.3, 0.2],
      transition: {
        duration: 8,
        repeat: Infinity,
        repeatType: "reverse" as const
      }
    }
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      <div className="absolute inset-0 z-0 bg-[url('/features-bg.svg')] bg-cover bg-center">
        {/* Dark overlay to make text more readable */}
        <div className="absolute inset-0 bg-black/30 backdrop-blur-lg"></div>
      </div>
      {/* Background effects with animation */}
      <div className="absolute inset-0 z-10">
        <motion.div 
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/30 rounded-full filter blur-3xl"
          variants={blobVariants}
          animate="animate"
        ></motion.div>
        <motion.div 
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/20 rounded-full filter blur-3xl"
          variants={blobVariants}
          animate="animate"
          initial={{ scale: 1.1 }}
        ></motion.div>
      </div>

      {/* Content */}
      <div className="relative z-20 max-w-7xl mx-auto">
        <Navbar />

        <div className="container mx-auto px-6 pt-16 md:pt-24 pb-20 text-center">
          <AnimatedSection direction="down" delay={0.3}>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white max-w-4xl mx-auto leading-tight">
              Powerful <span className="text-blue-500">Features{" "}</span>For Web3 Bill {" "}<span className="text-blue-500">Payments.</span>
            </h1>
          </AnimatedSection>

          <AnimatedSection direction="up" delay={0.5}>
            <p className="mt-6 text-gray-300 max-w-2xl mx-auto text-lg">
              Billoq combines blockchain technology with user-friendly interfaces to revolutionize how you pay your bills.
            </p>
          </AnimatedSection>

          <div className="mt-16 px-6 grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
            <AnimatedSection direction="right" delay={0.7}>
              <div className="flex items-center gap-4 hover:scale-105 transition-transform duration-300 cursor-pointer">
                <div className="flex-shrink-0 bg-[#42556CCC] p-2 rounded-full">
                  <Image 
                    src="/fast.png"
                    alt="Fast & secured"
                    width={27}
                    height={27}
                    className="w-7 h-7"
                  />
                </div>
                <div>
                  <h3 className="text-lg font-medium text-white">Fast & secured</h3>
                  <p className="text-gray-400">Blockchain-powered</p>
                </div>
              </div>
            </AnimatedSection>
            
            <AnimatedSection direction="left" delay={0.9}>
              <div className="flex items-center gap-4 hover:scale-105 transition-transform duration-300 cursor-pointer">
                <div className="flex-shrink-0 bg-[#42556CCC] p-2 rounded-full">
                  <Image 
                    src="/fully.png"
                    alt="Fully Protected"
                    width={27}
                    height={27}
                    className="w-7 h-7"
                  />
                </div>
                <div>
                  <h3 className="text-lg font-medium text-white">Fully Protected</h3>
                  <p className="text-gray-400">Smart contracts</p>
                </div>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </div>
    </div>
  );
}