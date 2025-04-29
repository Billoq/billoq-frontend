"use client"

import { useState } from "react"
import services from "./ServicesArray"
import ServiceCard from "./ServiceCard"
import { motion } from "framer-motion"
import { Search, Filter } from "lucide-react"

export default function ServicesGrid() {
  const [searchTerm, setSearchTerm] = useState("")
  const [showComingSoon, setShowComingSoon] = useState(true)

  const filteredServices = services.filter((service) => {
    const matchesSearch = service.title.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = showComingSoon ? true : !service.comingSoon
    return matchesSearch && matchesFilter
  })

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0b1221] to-[#111827] text-white px-4 sm:px-6 md:px-8 py-12">
      <div className="max-w-7xl mx-auto">
        {/* Services section */}
        <motion.div
          className="mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
            <div>
              <motion.div
                className="uppercase text-sm font-medium text-blue-400 bg-blue-900/30 px-4 py-1.5 rounded-md inline-block mb-4 tracking-wider"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                OUR SERVICES
              </motion.div>
              <motion.h2
                className="text-3xl sm:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-blue-400"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                Browse through Our <span className="text-blue-500">Services</span>
              </motion.h2>
            </div>
            <motion.p
              className="text-gray-400 mt-3 md:mt-0 md:max-w-md"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              Pay your bills instantly and securely with our streamlined payment services
            </motion.p>
          </div>

          {/* Search and filter */}
          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search services..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-blue-900/20 border border-blue-800/50 text-white placeholder-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
              />
            </div>
            <div className="flex items-center gap-2 bg-blue-900/20 border border-blue-800/50 rounded-lg px-4 py-2.5">
              <Filter className="text-blue-400 h-5 w-5" />
              <label className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={showComingSoon}
                  onChange={() => setShowComingSoon(!showComingSoon)}
                  className="sr-only"
                />
                <div
                  className={`relative w-10 h-5 rounded-full transition-colors ${showComingSoon ? "bg-blue-500" : "bg-gray-600"}`}
                >
                  <div
                    className={`absolute left-0.5 top-0.5 w-4 h-4 rounded-full bg-white transition-transform ${showComingSoon ? "translate-x-5" : "translate-x-0"}`}
                  ></div>
                </div>
                <span className="ml-2 text-sm text-blue-200">Show Coming Soon</span>
              </label>
            </div>
          </div>

          {/* Services grid */}
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 sm:gap-6"
            variants={{
              hidden: { opacity: 0 },
              show: {
                opacity: 1,
                transition: {
                  staggerChildren: 0.1,
                },
              },
            }}
            initial="hidden"
            animate="show"
          >
            {filteredServices.length > 0 ? (
              filteredServices.map((service, index) => <ServiceCard key={index} {...service} />)
            ) : (
              <div className="col-span-full text-center py-12">
                <p className="text-blue-300 text-lg">No services found matching your criteria.</p>
                <button
                  onClick={() => {
                    setSearchTerm("")
                    setShowComingSoon(true)
                  }}
                  className="mt-4 px-4 py-2 bg-blue-600 rounded-lg text-white hover:bg-blue-700 transition-colors"
                >
                  Reset Filters
                </button>
              </div>
            )}
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}
