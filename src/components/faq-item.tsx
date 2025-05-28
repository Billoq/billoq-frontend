import { ChevronUp } from "lucide-react";
import Image from "next/image";

interface FAQItemProps {
  question: string;
  answer: string;
  isOpen: boolean;
  onClick: () => void;
}

export function FAQItem({ question, answer, isOpen, onClick }: FAQItemProps) {
  return (
    <div className="border-b border-[#1B89A4] py-4">
      <button
        className="flex justify-between items-center w-full text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1B89A4] cursor-pointer"
        onClick={onClick}
        aria-controls={`faq-answer-${question.replace(/\s+/g, "-").toLowerCase()}`}
        id={`faq-question-${question.replace(/\s+/g, "-").toLowerCase()}`}
      >
        <h4 className="text-[20px] font-normal py-5 text-white">{question}</h4>
        {isOpen ? (
          <ChevronUp className="text-[#1B89A4] w-5 h-5" />
        ) : (
          <Image
            src="/plus.svg"
            alt="Expand"
            width={18}
            height={18}
            className="w-4 h-4"
          />
        )}
      </button>

      <div
        id={`faq-answer-${question.replace(/\s+/g, "-").toLowerCase()}`}
        role="region"
        aria-labelledby={`faq-question-${question.replace(/\s+/g, "-").toLowerCase()}`}
        className={`mt-3 text-gray-400 overflow-hidden transition-all duration-500 ease-in-out
          translate-y-0.5 max-h-0 ${
          isOpen ? "max-h-96 opacity-100 translate-y-0" : "max-h-0 opacity-0"
        }`}
      >
        <p className="pt-4">{answer}</p>
      </div>
    </div>
  );
}
