// import { Button } from "./ui/button";

// export function CommunitySection() {
//   return (
//     <section className="bg-[#0F172A] relative">
//       {/* Background image with overlay */}
//       <div className="absolute inset-0 z-0">
//         <div 
//           className="w-full h-full bg-[url('/community.png')] bg-cover bg-center bg-no-repeat"
//           style={{
//             backgroundImage: "url('/community.png')",
//           }}
//         >
//           {/* Dark overlay to make text more readable */}
//           <div className="absolute inset-0 bg-black/30"></div>
//         </div>
//       </div>

//       {/* Content */}
//       <div className="container max-w-7xl mx-auto px-12 py-20 relative z-10">
//         <div className="text-left ">
//           <span className="text-blue-500 text-sm font-semibold uppercase tracking-wider">
//             JOIN COMMUNITY
//           </span>
//           <h2 className="text-4xl md:text-5xl font-bold text-white mt-3 mb-6">
//             Ready to Transform Your Bill Payment Experience?
//           </h2>
//           <p className="text-gray-400 text-lg mb-10">
//             Join thousands of users who are already enjoying the benefits of blockchain- {" "} <br/> <span>powered bill payments.</span>
//           </p>
//           <Button className="bg-blue-600 hover:bg-blue-700 text-white px-16 py-6 text-lg">
//             Get Started
//           </Button>
//         </div>
//       </div>

//     </section>
//   );
// }


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
            backgroundImage: "url('/community.png')",
          }}
        >
          {/* Dark overlay to make text more readable */}
          <div className="absolute inset-0 bg-black/30"></div>
        </div>
      </div>

      {/* Content */}
      <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-12 md:py-20 relative z-10">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-8 lg:gap-12">
          {/* Left column - Text content */}
          <div className="text-left w-full md:w-1/2">
            <span className="text-blue-500 text-sm font-semibold uppercase tracking-wider">
              JOIN COMMUNITY
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mt-3 mb-6">
              Ready to Transform Your Bill Payment Experience?
            </h2>
            <p className="text-gray-400 text-lg mb-10">
              Join thousands of users who are already enjoying the benefits of blockchain- {" "} <br/> <span>powered bill payments.</span>
            </p>
            <Button className="bg-blue-600 hover:bg-blue-700 text-white px-6 sm:px-12 md:px-16 py-4 md:py-6 text-base md:text-lg">
              Get Started
            </Button>
          </div>
          
          {/* Right column - ATM Card */}
          <div className="w-full md:w-1/2 flex justify-center md:justify-end items-center mt-8 md:mt-0">
            <div className="w-full max-w-sm lg:max-w-md">
              <GlassATMCard />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}