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
  featured = false,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{
        scale: 1.03,
        boxShadow: "0 10px 25px -5px rgba(59, 130, 246, 0.3)",
      }}
      className={`rounded-xl p-6 h-[320px] flex flex-col cursor-pointer relative overflow-hidden border ${
        featured ? "border-blue-500/60" : "border-blue-900/40"
      }`}
      style={{
        backgroundImage: `
          linear-gradient(145deg, 
          ${
            featured
              ? "rgba(29, 78, 216, 0.95) 0%, rgba(37, 99, 235, 0.8) 50%, rgba(29, 78, 216, 0.95) 100%"
              : "rgba(14, 71, 141, 0.95) 0%, rgba(23, 92, 179, 0.8) 50%, rgba(14, 71, 141, 0.95) 100%"
          })
        `,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* {featured && !comingSoon && (
        <div className="absolute -left-[4.5rem] top-3 bg-gradient-to-r from-amber-500 to-amber-400 text-amber-50 text-xs font-bold py-1 px-12 transform -rotate-45 shadow-lg backdrop-blur-sm border-t border-amber-400/30">
          FEATURED
        </div>
      )} */}

      {comingSoon && (
        <motion.div
          className="absolute -right-[4.5rem] top-7 bg-gradient-to-r from-blue-700 to-blue-500 text-blue-50 text-xs font-bold py-1 px-12 transform rotate-45 shadow-lg backdrop-blur-sm border-t border-blue-400/30"
          animate={{ opacity: [0.8, 1, 0.8] }}
          transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
        >
          COMING SOON
        </motion.div>
      )}

      <div
        className={`p-3 rounded-full w-14 h-14 flex items-center justify-center mb-4 ${
          featured ? "bg-blue-500/40" : "bg-blue-600/30"
        }`}
      >
        <Icon className="w-7 h-7 text-blue-100" />
      </div>

      <h3 className="font-semibold mb-1 text-white text-lg leading-tight">{title}</h3>
      <div className={`w-12 h-1 ${featured ? "bg-blue-300" : "bg-blue-400"} rounded-full mb-3`}></div>
      <p className="text-sm mb-4 text-blue-100 opacity-80">{description}</p>

      <div className="mb-4 mt-1">
        <p className="text-xs uppercase tracking-wider font-medium text-blue-300 mb-2">Popular providers</p>
        <ul className="text-xs text-blue-100 space-y-1.5">
          {providers.map((provider, index) => (
            <li key={index} className="flex items-center gap-2 leading-tight">
              <div className="w-1.5 h-1.5 rounded-full bg-blue-400"></div>
              {provider}
            </li>
          ))}
        </ul>
      </div>

      <button
        className={`mt-auto py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
          comingSoon
            ? "bg-blue-800/50 text-blue-200 cursor-not-allowed border border-blue-700/30 hover:bg-blue-800/60"
            : `${
                featured ? "bg-blue-500 hover:bg-blue-600" : "bg-blue-600 hover:bg-blue-700"
              } text-white hover:shadow-lg hover:shadow-blue-600/20 border border-blue-500/30`
        }`}
        disabled={comingSoon}
      >
        {comingSoon ? "Coming Soon" : "Pay Now"}
      </button>
    </motion.div>
  )
}

export default ServiceCard
