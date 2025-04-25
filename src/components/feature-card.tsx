import Image from "next/image";

interface FeatureCardProps {
  iconSrc: string;
  title: string;
  description: string;
  className?: string;
}

export function FeatureCard({ iconSrc, title, description, className = "" }: FeatureCardProps) {
  return (
    <div className={`bg-[#1A2A44] rounded-lg p-4 sm:p-5 md:p-6 flex flex-col items-start gap-3 sm:gap-4 w-full border border-[#396294] hover:border-blue-500 transition-all duration-300 ${className}`}>
      {/* Icon Container - Adjusted for mobile */}
      <div className="bg-[#2A3B5A] p-2 sm:p-3 rounded-lg mb-6 sm:mb-8 md:mb-12">
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
        <h3 className="text-white text-base sm:text-lg md:text-[18px] font-semibold mb-2 sm:mb-3 md:mb-4 leading-tight">
          {title}
        </h3>
        <p className="text-gray-400 text-xs sm:text-sm md:text-[14px] leading-relaxed">
          {description}
        </p>
      </div>
    </div>
  );
}