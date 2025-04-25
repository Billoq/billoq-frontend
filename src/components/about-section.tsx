import Image from "next/image";
import { AboutCard } from "./about-card";

export function AboutSection() {
  const aboutCards = [
    {
      iconSrc: "/mission.png",
      title: "OUR MISSION",
      description:
        "To create a decentralized payment ecosystem that empowers both service providers and users with transparent, efficient, and secure bill payment management.",
    },
    {
      iconSrc: "/technology.png",
      title: "THE TECHNOLOGY",
      description:
        "Built on blockchain technology, Billoq utilizes smart contracts to automate payment processes, eliminating intermediaries and reducing costs while increasing security.",
    },
    {
      iconSrc: "/team.png",
      title: "OUR TEAM",
      description:
        "Our diverse team of blockchain experts, developers, and UX specialists is dedicated to creating the most user-friendly decentralized bill payment platform available.",
    },
  ];

  return (
    <section className="relative bg-[#010028] py-16 overflow-hidden">
      <div className="container max-w-7xl mx-auto px-12">
        <span className="text-[#60A5FA] text-[18px] leading-[100%] font-semibold uppercase tracking-wide px-2 py-1.5 rounded-l-full rounded-r-full bg-[#1D4ED840] ">
          ABOUT BILLOQ
        </span>
        
        <div className="flex flex-col lg:flex-row items-center gap-12 mt-6">
          {/* Left Side: Text and Cards */}
          <div className="flex-1 z-10">
            <h2 className="text-[44px] md:text-5xl font-semibold text-white mt-2">
              Revolutionizing Bills Payment With {" "}
              <span className="text-blue-500">Blockchain</span>
            </h2>
            <p className="text-gray-400 mt-6 max-w-lg">
              Billoq was created to solve the challenges of traditional bill payment systems by leveraging blockchain technology to provide transparency, security, and user control.
            </p>
          </div>

          {/* Right Side: Blockchain Cube Image - positioned absolutely */}
          <div className="flex-1 relative">
            <div className="absolute -top-20 -right-20 w-full h-full z-0">
              <Image
                src="/blockchain-cube.png"
                alt="Blockchain Cube"
                width={630}
                height={420}
                className="object-contain"
              />
            </div>
          </div>
        </div>
        
        {/* About Cards - positioned relative with higher z-index */}
        <div className="relative grid grid-cols-1 md:grid-cols-3 gap-6 mt-[120px] z-20">
          {aboutCards.map((card, index) => (
            <AboutCard
              key={index}
              iconSrc={card.iconSrc}
              title={card.title}
              description={card.description}
            />
          ))}
        </div>
      </div>
    </section>
  );
}