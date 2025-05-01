"use client"

import type React from "react"
import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface ServiceItemProps {
  icon: React.ReactNode
  label: string
  description?: string
  onSelect: () => void
  popular?: boolean
  comingSoon?: boolean
}

const ServiceItem: React.FC<ServiceItemProps> = ({
  icon,
  label,
  description,
  onSelect,
  popular = false,
  comingSoon = false,
}) => {
  return (
    <motion.div
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.98 }}
      className={`relative group cursor-pointer`}
      onClick={comingSoon ? undefined : onSelect}
    >
      <Card
        className={`w-full h-full border-[#1e293b] bg-[#0f172a] hover:border-[#2563eb]/50 transition-all duration-300 overflow-hidden ${comingSoon ? "opacity-70 cursor-not-allowed" : ""}`}
      >
        <CardContent className="p-5 flex flex-col items-center text-center">
          <div className="absolute top-0 right-0 w-24 h-24 bg-[#2563eb]/5 rounded-full blur-xl transform translate-x-8 -translate-y-8 group-hover:bg-[#2563eb]/10 transition-all duration-700"></div>

          <div className="relative z-10 mb-3 h-14 w-14 rounded-xl bg-[#1e293b] flex items-center justify-center group-hover:bg-[#2563eb]/20 transition-all duration-300">
            <div className="text-[#2563eb]">{icon}</div>
          </div>

          <h3 className="text-white font-medium mb-1 group-hover:text-[#2563eb] transition-colors">{label}</h3>

          {description && <p className="text-xs text-slate-400 mt-1">{description}</p>}

          {popular && (
            <Badge className="absolute top-2 right-2 bg-[#2563eb]/20 text-[#2563eb] border border-[#2563eb]/30">
              Popular
            </Badge>
          )}

          {comingSoon && (
            <Badge className="absolute top-2 right-2 bg-[#1e293b] text-slate-300 border border-slate-700">
              Coming Soon
            </Badge>
          )}
        </CardContent>
      </Card>
    </motion.div>
  )
}

export default ServiceItem
