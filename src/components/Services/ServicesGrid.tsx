"use client"
import services from "./ServicesArray"
import ServiceCard from "./ServiceCard"

export default function ServicesGrid() {
  return (
    <div className="min-h-screen bg-[#111827] text-white px-3 sm:px-4 md:px-6 py-6">
      <div className="max-w-7xl mx-auto">
        {/* Services section */}
        <div className="mb-8">
          <div className="uppercase text-sm font-medium text-blue-500 bg-blue-900/30 px-4 py-1 rounded-md inline-block mb-4">
            OUR SERVICES
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8">
            Browse through Our available <span className="text-blue-500">Services</span>
          </h2>

          {/* Services grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
            {services.map((service, index) => (
              <ServiceCard key={index} {...service} />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
