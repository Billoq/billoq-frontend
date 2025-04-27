"use client"
import Image from "next/image";
import { ServiceCard } from "./service-card";
import { Button } from "./ui/button";
import { useState } from "react";

export function ServicesSection() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const services = [
    { iconSrc: "/icons/electricity.png", title: "ELECTRICITY" },
    { iconSrc: "/icons/cable-tv.png", title: "CABLE TV" },
    { iconSrc: "/icons/internet.png", title: "INTERNET" },
    { iconSrc: "/icons/airtime.png", title: "AIRTIME" },
    { iconSrc: "/icons/cable-tv.png", title: "CABLE TV" },
    { iconSrc: "/icons/more.png", title: "SEE MORE" },
  ];

  const handleGiftNow = () => {
    setIsLoading(true);
    setError(null);
    // Simulate an API call
    setTimeout(() => {
      setIsLoading(false);
      // Simulate an error
      // setError("Failed to process the request.");
    }, 2000);
  };

  return (
    <section className="bg-[#1A2A44] py-16">
      <div className="mx-auto w-full px-12 max-w-7xl ">
        <div className="  flex flex-col lg:flex-row items-center gap-12">
          {/* Left Side: Text and Services */}
          <div className="flex-1">
            <span className="text-[#60A5FA] text-[18px] leading-[100%] mb-8 font-semibold uppercase tracking-wide px-2 py-1.5 rounded-l-full rounded-r-full bg-[#1D4ED840]">
            OUR SERVICES
            </span>
            <h2 className="text-[44px] leading-14 md:text-5xl font-semibold text-white mt-6">
              PAY FOR ANY SERVICE WITH <span className="text-[#1D4ED8]">CRYPTO</span>
            </h2>
            <p className="text-gray-400 font-normal text-[20px] leading-8 mt-6 max-w-2xl">
              Choose from a wide range of services like electricity, internet, cable TV and lots more and pay your bills using cryptocurrency. Fast, secured, transparent payment. You can also gift your friends, family a subscription plan and enjoy lot more benefits.
            </p>
          
          </div>

          {/* Right Side: Phone Mockup */}
          <div className="flex-1 relative">
            {isLoading ? (
              <div className="flex items-center justify-center h-96">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            ) : error ? (
              <div className="flex items-center justify-center h-96">
                <div className="text-red-500 text-center">
                  <p>{error}</p>
                  <Button
                    onClick={handleGiftNow}
                    className="mt-4 bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    Retry
                  </Button>
                </div>
              </div>
            ) : (
              <>
                <Image
                  src="/Phone.png"
                  alt="Phone Mockup"
                  width={400}
                  height={600}
                  className="mx-auto"
                />
               
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}