"use client";
import { useState } from "react";
import { FAQItem } from "./faq-item";

export function FAQSection() {
  const faqs = [
    {
      question: "What types of bills can I pay with Billoq?",
      answer: "Billoq supports payments for electricity, cable TV, internet subscriptions, airtime, and many other utility services. We're constantly adding more bill types to our platform."
    },
    {
      question: "Which cryptocurrencies can I use for payments?",
      answer: "Currently we support USDC and our native token BLLQ. We plan to add more stablecoins and major cryptocurrencies in future updates."
    },
    {
      question: "How do I connect my wallet?",
      answer: "Simply click the 'Connect Wallet' button and select your preferred wallet provider (MetaMask, WalletConnect, etc.). Follow the prompts to securely connect your wallet to our platform."
    },
    {
      question: "How long do payments take to process?",
      answer: "Most payments are processed within 2-5 minutes. The exact time depends on network congestion and the specific service provider's processing time."
    },
    {
      question: "Can I set up recurring payments for my bills?",
      answer: "Yes! Billoq offers automatic recurring payments powered by smart contracts. You can set your preferred payment frequency and amount, and the system will handle the rest."
    },
    {
      question: "Is my payment information secure?",
      answer: "Absolutely. Billoq uses blockchain technology and smart contracts to ensure all transactions are secure. We never store your sensitive payment information on centralized servers."
    }
  ];

  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const handleToggle = (index: number) => {
    setOpenIndex(prevIndex => (prevIndex === index ? null : index));
  };

  return (
    <section className="py-20 bg-[#0F172A]">
      <div className="container mx-auto px-6 ">
        <div className="text-center mb-12">
          
        <span className="inline-block text-[#1B89A4] text-sm md:text-[18px] font-semibold uppercase tracking-wide px-3 py-1 rounded-full bg-[#0E99BC26]">
            FAQ
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-white mt-3 mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Find answers to common questions about Billoq and Web3 bill payments.
          </p>
        </div>

        <div className="max-w-3xl bg-[#0F1620] mx-auto px-9 pb-16 pt-6 rounded-lg shadow-lg cursor-pointer">
          {faqs.map((faq, index) => (
            <FAQItem
              key={index}
              question={faq.question}
              answer={faq.answer}
              isOpen={openIndex === index}
              onClick={() => handleToggle(index)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
