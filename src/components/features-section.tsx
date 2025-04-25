import { FeatureCard } from "./feature-card";

export function FeaturesSection() {
  const features = [
    {
      iconSrc: "/digital-wallet.svg", // Replace with actual icon paths
      title: "BLOCKCHAIN-BASED PAYMENTS",
      description:
        "Support for stablecoins (USDC) and native token with transparent payment processing",
    },
    {
      iconSrc: "/security.svg",
      title: "SMART CONTRACT SECURITY",
      description:
        "Secure contract handling for payment actions with built-in verification",
    },
    {
      iconSrc: "/carbon_security.svg",
      title: "BACKEND PAYMENT PROCESSOR",
      description:
        "Backend contract handling for payment actions with built-in verification",
    },
    {
      iconSrc: "/notification.svg",
      title: "NOTIFICATION SYSTEM",
      description:
        "Secure contract handling for payment actions with built-in verification",
    },
    {
      iconSrc: "/automatic.svg",
      title: "AUTOMATIC RECURRING PAYMENT",
      description: "Setup recurring payment for regular bills handled by smart contracts",
    },
    {
      iconSrc: "instant.svg",
      title: "INSTANT CONFIRMATION",
      description: "Real-time transaction confirmation and payment verification",
    },
  ];

  return (
    <section className="relative py-16">
      {/* Background Glow Circle */}
      <div
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[1200px] h-[950px] rounded-full filter blur-lg opacity-40"
        style={{ backgroundColor: "#60A5FA" }}
      ></div>

      {/* Content with Background */}
      <div className="relative z-10 bg-[#161E28] py-16 mb-5 mx-auto px-6 max-w-7xl">
        <div className="container mx-auto px-6">
          <div className="text-left mb-12">
            <span className="text-[#60A5FA] text-[18px] leading-[100%] font-semibold uppercase tracking-wide px-2 py-1.5 rounded-l-full rounded-r-full bg-[#1D4ED840]" >
              KEY FEATURES
            </span>
            <h2 className="text-4xl md:text-5xl font-bold text-white mt-10">
              POWERFUL FEATURES FOR{" "}
              <span className="text-[#1D4ED8]">WEB3</span> 
              <br />
              <span>BILL PAYMENTS</span>
           
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-6 gap-x-12">
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