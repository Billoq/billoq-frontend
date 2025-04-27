import { useState } from "react";
import { ChevronUp } from "lucide-react";
import Image from "next/image";

interface FAQItemProps {
  question: string;
  answer: string;
}

export function FAQItem({ question, answer }: FAQItemProps) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleOpen = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="border-b border-[#0E478D] py-4">
      <div 
        className="flex justify-between items-center w-full text-left cursor-pointer"
        onClick={toggleOpen}
      >
        <h4 className="text-[20px] font-normal py-5 text-white">{question}</h4>
        {isOpen ? (
          <ChevronUp className="text-blue-500 w-5 h-5" />
        ) : (
          <Image
            src="/plus.png"
            alt="Expand Question"
            width={18}
            height={18}
            className="w-4 h-4"
          />
        )}
      </div>
      {isOpen && (
        <div className="mt-3 text-gray-400">
          <p>{answer}</p>
        </div>
      )}
    </div>
  );
}