import Image from "next/image";

interface AboutCardProps {
  iconSrc: string;
  title: string;
  description: string;
  className?: string;
}

export function AboutCard({ iconSrc, title, description, className = "" }: AboutCardProps) {
  return (
    <div className={`bg-[#00185D33] backdrop-blur-md rounded-lg p-5 sm:p-6 flex flex-col items-start gap-3 sm:gap-4 w-full border border-[#2A3B5A66] hover:border-blue-500 transition-colors duration-300 ${className}`}>
      {/* Icon Container */}
      <div className="mt-2 sm:mt-3 md:mt-5 mb-3 sm:mb-4 md:mb-5 p-2 rounded-full bg-[#1D4ED820]">
        <Image 
          src={iconSrc} 
          alt={title} 
          width={24} 
          height={24}
          className="w-5 h-5 sm:w-6 sm:h-6"
        />
      </div>
      
      {/* Content */}
      <div className="w-full">
        <h3 className="text-white text-base sm:text-lg font-semibold uppercase tracking-wide">
          {title}
        </h3>
        <p className="text-gray-400 text-xs sm:text-sm mt-2 sm:mt-3 md:mt-4 leading-relaxed">
          {description}
        </p>
      </div>
    </div>
  );
}