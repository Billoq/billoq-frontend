import { FeatureCard } from "./feature-card";

export function FeaturesSection() {
  const features = [
    {
      iconSrc: "/digital-wallet.svg",
      title: "BLOCKCHAIN-BASED PAYMENTS",
      description: "Support for stablecoins (USDC) and native token with transparent payment processing",
    },
    {
      iconSrc: "/security.svg",
      title: "SMART CONTRACT SECURITY",
      description: "Secure contract handling for payment actions with built-in verification",
    },
    {
      iconSrc: "/carbon_security.svg",
      title: "BACKEND PAYMENT PROCESSOR",
      description: "Backend contract handling for payment actions with built-in verification",
    },
    {
      iconSrc: "/notification.svg",
      title: "NOTIFICATION SYSTEM",
      description: "Secure contract handling for payment actions with built-in verification",
    },
    {
      iconSrc: "/automatic.svg",
      title: "AUTOMATIC RECURRING PAYMENT",
      description: "Setup recurring payment for regular bills handled by smart contracts",
    },
    {
      iconSrc: "/instant.svg",
      title: "INSTANT CONFIRMATION",
      description: "Real-time transaction confirmation and payment verification",
    },
  ];

  return (
    <section className="relative py-8 md:py-16 overflow-hidden">
      {/* Background Glow Circle - Reduced on mobile */}
      <div
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] md:w-[1200px] md:h-[950px] rounded-full filter blur-lg opacity-20 md:opacity-40"
        style={{ backgroundColor: "#60A5FA" }}
      ></div>

      {/* Content Container */}
      <div className="relative z-10 bg-[#161E28] py-8 md:py-16 mx-auto px-4 sm:px-6 max-w-7xl">
        <div className="container mx-auto">
          {/* Header Section */}
          <div className="text-center md:text-left mb-8 md:mb-12 px-2">
            <span className="inline-block text-[#60A5FA] text-sm md:text-[18px] font-semibold uppercase tracking-wide px-3 py-1 rounded-full bg-[#1D4ED840]">
              KEY FEATURES
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mt-6 md:mt-10 leading-snug">
              POWERFUL FEATURES FOR{" "}
              <span className="text-[#1D4ED8]">WEB3</span> BILL PAYMENTS
            </h2>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8 px-2 sm:px-0">
            {features.map((feature, index) => (
              <FeatureCard
                key={index}
                iconSrc={feature.iconSrc}
                title={feature.title}
                description={feature.description}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}