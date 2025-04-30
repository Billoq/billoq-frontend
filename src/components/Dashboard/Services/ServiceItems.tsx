import React from 'react'

interface ServiceItemProps {
    icon: React.ReactNode
    label: string
    onSelect?: () => void;
}

const ServiceItems = ({ icon, label, onSelect }: ServiceItemProps) => {
    return (
      <button type="button"
        onClick={onSelect}
        className="flex flex-col items-center w-[92px] h-[99px] border border-[#3A414A] rounded m-2 cursor-pointer 
                   transition-all duration-200 hover:bg-[#2A2F36] active:scale-95"
      >
        <div className="p-3 rounded-md mb-2 w-14 h-14 flex items-center justify-center">
          {icon}
        </div>
        <span className="text-xs text-center w-[72px] h-[32px]">{label}</span>
      </button>
    );
  };
  

export default ServiceItems
