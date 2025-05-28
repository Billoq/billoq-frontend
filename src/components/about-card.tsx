

"use client";
import { useState, useEffect, useRef } from "react";
import Image from "next/image";

interface AboutCardProps {
  iconSrc: string;
  title: string;
  description: string;
  className?: string;
  index?: number;
}

export function AboutCard({ iconSrc, title, description, className = "", index = 0 }: AboutCardProps) {
  // Manual hover state
  const [isHovered, setIsHovered] = useState(false);
  // Auto hover state
  const [isAutoHovered, setIsAutoHovered] = useState(false);
  // Ref to the card element
  const cardRef = useRef<HTMLDivElement>(null);
  
  // Auto-hover animation logic
  useEffect(() => {
    // Set up the timing for the auto-hover effect
    const startDelay = index * 2000; // Cards will start their animation with a staggered delay
    const hoverDuration = 2000; // How long the card stays highlighted
    const resetDuration = 3000; // How long the card stays in normal state
    const totalCycleDuration = hoverDuration + resetDuration;
    
    let intervalId: NodeJS.Timeout;
    
    // Small delay before starting the auto-hover
    const initTimeout = setTimeout(() => {
      intervalId = setInterval(() => {
        const currentTime = Date.now();
        const cyclePoint = (currentTime + startDelay) % totalCycleDuration;
        
        // Set auto-hover state based on where we are in the cycle
        if (cyclePoint < hoverDuration) {
          setIsAutoHovered(true);
        } else {
          setIsAutoHovered(false);
        }
      }, 100);
    }, 1000);
    
    return () => {
      clearTimeout(initTimeout);
      clearInterval(intervalId);
    };
  }, [index]);

  // User hover takes precedence over auto hover
  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  // Final hover state is determined by either manual hover or auto hover
  const finalHoverState = isHovered || isAutoHovered;

  return (
    <div
      ref={cardRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`bg-[#00185D33] backdrop-blur-md rounded-lg p-5 sm:p-6 flex flex-col items-start gap-3 sm:gap-4 w-full border transition-all duration-300 ${finalHoverState ? 'border-[#38C3D8] shadow-md shadow-[#38C3D8]/30 transform scale-[1.02]' : 'border-[#2A3B5A66]'} ${className}`}
    >
      {/* Icon Container */}
      <div className={`mt-2 sm:mt-3 md:mt-5 mb-3 sm:mb-4 md:mb-5 p-2 rounded-full transition-colors duration-300 ${finalHoverState ? 'bg-[#38C3D8]/30' : 'bg-[#1D4ED820]'}`}>
        <Image 
          src={iconSrc} 
          alt={title} 
          width={24} 
          height={24}
          className={`w-5 h-5 sm:w-6 sm:h-6 transition-all duration-300 ${finalHoverState ? 'transform scale-110' : ''}`}
        />
      </div>
      
      {/* Content */}
      <div className="w-full">
        <h3 className={`text-white text-base sm:text-lg font-semibold uppercase tracking-wide transition-colors duration-300 ${finalHoverState ? 'text-[#38C3D8]' : ''}`}>
          {title}
        </h3>
        <p className="text-gray-400 text-xs sm:text-sm mt-2 sm:mt-3 md:mt-4 leading-relaxed">
          {description}
        </p>
      </div>
    </div>
  );
}