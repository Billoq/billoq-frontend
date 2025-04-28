import React from "react";

const ServiceCard: React.FC<{
  title: string;
  icon: React.ElementType;
  providers: string[];
}> = ({ title, icon: Icon, providers }) => {
  return (
    <div
      className="rounded-lg p-5 h-[320px] max-w-6xl flex flex-col cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-blue-500/20 transform"
      style={{
        backgroundImage: `
          linear-gradient(160.79deg, #0E478D 30%, rgba(96, 165, 250, 0.5) 50%, #0E478D 70%),
          linear-gradient(80deg, #0E478D 0%, rgba(96, 165, 250, 0.1) 25%, rgba(0, 0, 0, 0.1) 180%, rgba(255, 255, 255, 0) 100%)
        `,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className="mb-2">
        <Icon className="w-[28px] h-[40px] text-[#FFFFFF]" />
      </div>
      <h3 className="font-medium mb-1 text-[#60A5FA] leading-[22px]">{title}</h3>
      <p className="text-sm mb-4 text-[#60A5FA]">Pay your electricity bills instantly</p>

      <div className="mb-4 h-[94px] mt-[20px]">
        <p className="text-xs text-[#60A5FA]">Popular providers</p>
        <ul className="text-xs text-gray-300 space-y-0.5">
          {providers.map((provider, index) => (
            <li key={index} className="flex items-center gap-1 leading-[22px]">
              <span className="text-xs">•</span> {provider}
            </li>
          ))}
        </ul>
      </div>

      <button className="mt-auto bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md text-sm font-medium transition-colors cursor-pointer">
        Pay Now
      </button>
    </div>
  );
};

export default ServiceCard;