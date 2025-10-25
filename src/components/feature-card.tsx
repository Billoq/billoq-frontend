"use client";

import Image from "next/image";
import { useState, useEffect } from "react";

interface FeatureCardProps {
  iconSrc: string;
  title: string;
  description: string;
  className?: string;
  isActive?: boolean;
  index?: number;
}

export function FeatureCard({ 
  iconSrc, 
  title, 
  description, 
  className = "",
  isActive = false,
}: FeatureCardProps) {
  return (
    <div 
      className={`
        bg-[#1A2A44] 
        rounded-lg 
        p-4 sm:p-5 md:p-6 
        flex flex-col 
        items-start 
        gap-3 sm:gap-4 
        w-full 
        border 
        transition-all 
        duration-500
        ${isActive ? 'border-[#1B89A4] shadow-lg shadow-[#1B89A4]/20' : 'border-[#396294]'}
        ${className}
      `}
    >
      {/* Icon Container - Adjusted for mobile */}
      <div className={`
        p-2 sm:p-3 
        rounded-lg 
        mb-6 sm:mb-8 md:mb-12
        transition-colors
        duration-500
        ${isActive ? 'bg-[#3B5998]' : 'bg-[#2A3B5A]'}
      `}>
        <Image 
          src={iconSrc} 
          alt={title} 
          width={30} 
          height={30}
          className="w-6 h-6 sm:w-8 sm:h-8 md:w-9 md:h-9"
        />
      </div>
      
      {/* Text Content */}
      <div className="w-full">
        <h3 className={`
          text-base sm:text-lg md:text-[18px] 
          font-semibold 
          mb-2 sm:mb-3 md:mb-4 
          leading-tight
          transition-colors
          duration-500
          ${isActive ? 'text-[#1B89A4]' : 'text-white'}
        `}>
          {title}
        </h3>
        <p className="text-gray-400 text-xs sm:text-sm md:text-[14px] leading-relaxed">
          {description}
        </p>
      </div>
    </div>
  );
}

// Auto-highlighting controller component
interface Feature {
  iconSrc: string;
  title: string;
  description: string;
}

export function AutoHighlightFeatureCards({ features }: { features: Feature[] }) {
  const [activeIndex, setActiveIndex] = useState(0);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((current) => (current + 1) % features.length);
    }, 2000); // Change highlight every 2 seconds
    
    return () => clearInterval(interval);
  }, [features.length]);
  
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8 px-2 sm:px-0 cursor-pointer">
      {features.map((feature: { iconSrc: string; title: string; description: string; }, index: number) => (
        <FeatureCard
          key={index}
          iconSrc={feature.iconSrc}
          title={feature.title}
          description={feature.description}
          isActive={index === activeIndex}
          index={index}
        />
      ))}
    </div>
  );
}