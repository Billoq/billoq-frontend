"use client"

import type React from "react"

import { motion } from "framer-motion"
import type { ServiceType } from "./ServicesArray"

const ServiceCard: React.FC<ServiceType> = ({
  title,
  description,
  icon: Icon,
  providers,
  comingSoon = false,
  featured = true,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{
        scale: 1.03,
        boxShadow: "0 10px 25px -5px rgba(27, 137, 164, 0.3)",
      }}
      className={`rounded-xl p-6 h-[320px] flex flex-col cursor-pointer relative overflow-hidden border border-neutral-900`}
      style={{
        backgroundColor: "#00000066",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {comingSoon && (
        <motion.div
          className="absolute -right-[4.5rem] top-7 bg-gradient-to-r from-[#1B89A4] to-[#1B89A4] text-white text-xs font-bold py-1 px-12 transform rotate-45 shadow-lg backdrop-blur-sm border-t border-[#1B89A4]/30"
          animate={{ opacity: [0.8, 1, 0.8] }}
          transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
        >
          COMING SOON
        </motion.div>
      )}

      <div
        className={`p-3 rounded-full w-14 h-14 flex items-center justify-center mb-4 ${
          featured ? "bg-[#00000066]" : "bg-[#00000066]/30"
        }`}
      >
        <Icon className="w-7 h-7 text-white" />
      </div>

      <h3 className="font-semibold mb-1 text-[#1B89A4] text-lg leading-tight">{title}</h3>
      <div className={`w-12 h-1 bg-[#1B89A4] rounded-full mb-3`}></div>
      <p className="text-sm mb-4 text-neutral-200 opacity-80">{description}</p>

      <div className="mb-4 mt-1">
        <p className="text-xs uppercase tracking-wider font-medium text-[#1B89A4] mb-2">Popular providers</p>
        <ul className="text-xs text-white space-y-1.5">
          {providers.map((provider, index) => (
            <li key={index} className="flex items-center gap-2 leading-tight">
              <div className="w-1.5 h-1.5 rounded-full bg-[#1B89A4]"></div>
              {provider}
            </li>
          ))}
        </ul>
      </div>

      <button
        className={`mt-auto py-2.5 rounded-lg text-sm font-medium transition-all duration-200 mb-6 ${
          comingSoon
            ? "bg-[#1B89A4]/50 text-white cursor-not-allowed border border-[#1B89A4]/30 hover:bg-[#1B89A4]/60"
            : "bg-[#1B89A4] hover:bg-[#15738A] text-white hover:shadow-lg hover:shadow-[#1B89A4]/20 border border-[#1B89A4]/30"
        }`}
        disabled={comingSoon}
      >
        {comingSoon ? "Coming Soon" : "Pay Now"}
      </button>
    </motion.div>
  )
}

export default ServiceCard
