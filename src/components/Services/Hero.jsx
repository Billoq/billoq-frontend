import { Button } from "../ui/button";
import { Navbar } from "../navbar";
import Image from "next/image";

export function HeroSection() {
  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      <div className="absolute inset-0 z-0 bg-[url('/service-background-image.png')] bg-cover bg-center">
        {/* Dark overlay to make text more readable */}
        <div className="absolute backdrop-blur-md inset-0 bg-black/60"></div>
      </div>
      {/* Background effects */}
      <div className="absolute inset-0 z-10">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/30 rounded-full filter blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/20 rounded-full filter blur-3xl"></div>
      </div>

      {/* Content */}
      <div className="relative z-20 max-w-7xl mx-auto">
        <Navbar />

        <div className="container mx-auto px-6 pt-16 md:pt-24 pb-20 text-center">
          <h1 className="text-[56px] md:text-5xl lg:text-6xl font-bold text-white max-w-6xl mx-auto leading-tight">
            Pay For Any <span className="text-blue-500">Service</span> With Your{" "}
            <span className="text-blue-500">Crypto</span>.
          </h1>

          <p className="mt-6 text-gray-300 max-w-2xl mx-auto text-lg">
            Choose From A Wide Range Of Services And Pay Your Bills Using <br />
            Cryptocurrency Fast, Secure, Transparent And Convenient.
          </p>

          <div className="mt-60 px-6 grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl ">
            <div className="flex items-center  gap-4">
              <div className="flex-shrink-0 bg-[#42556CCC] p-2 rounded-full">
                <Image
                  src="/fast.png"
                  alt="Fast & secured"
                  width={27}
                  height={27}
                  className="w-7 h-7"
                />
              </div>
              <div>
                <h3 className="text-lg font-medium text-white">
                  Fast & secured
                </h3>
                <p className="text-gray-400">Blockchain-powered</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex-shrink-0 bg-[#42556CCC] p-2 rounded-full">
                <Image
                  src="/fully.png"
                  alt="Fully Protected"
                  width={27}
                  height={27}
                  className="w-7 h-7"
                />
              </div>
              <div>
                <h3 className="text-lg font-medium text-white">
                  Fully Protected
                </h3>
                <p className="text-gray-400">Smart contracts</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
