
import { Button } from "./ui/button";
import  GlassATMCard  from "./GlassATMCard"; // Import the component

export function CommunitySection() {
  return (
    <section className="bg-[#0F172A] relative">
      {/* Background image with overlay */}
      <div className="absolute inset-0 z-0">
        <div 
          className="w-full h-full bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: "url('/community.svg')",
          }}
        >
          {/* Dark overlay to make text more readable */}
          <div className="absolute inset-0 backdrop-blur-xl bg-black/30"></div>
        </div>
      </div>

      {/* Content */}
      <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-12 md:py-20 relative z-10">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-8 lg:gap-12">
          {/* Left column - Text content */}
          <div className="text-left w-full md:w-1/2">
             <span className="inline-block text-[#1B89A4] text-sm md:text-[18px] font-semibold uppercase tracking-wide px-3 py-1 rounded-full bg-[#0E99BC26]">
            JOIN COMMUNITY
          </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mt-3 mb-6">
              Ready to  <span className="text-[#1B89A4]">Transform</span> Your Bill Payment Experience?
            </h2>
            <p className="text-gray-400 text-lg mb-10">
              Join thousands of users who are already enjoying the benefits of blockchain- {" "} <br/> <span>powered bill payments.</span>
            </p>
            <Button className="bg-[#1B89A4] hover:bg-[#38C3D8]/30 text-white px-6 sm:px-12 md:px-16 py-4 md:py-6 text-base md:text-lg cursor-pointer">
              Get Started
            </Button>
          </div>
          
          {/* Right column - ATM Card */}
          <div className="w-full md:w-1/2 flex justify-center md:justify-end items-center mt-8 md:mt-0">
            <div className="w-full max-w-sm lg:max-w-md cursor-pointer">
              <GlassATMCard />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}