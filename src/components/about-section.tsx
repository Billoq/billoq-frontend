"use client";
import { useEffect, useRef, useState } from 'react';
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

  const cubeRef = useRef<HTMLDivElement>(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    
    if (!isMounted) return;
    const cube = cubeRef.current;
    if (!cube) {
      console.error("Cube element not found!");
      return;
    }

    console.log("Starting animation...");
    let startTime: number | null = null;
    const duration = 3000; // 3 seconds for full up-down cycle
    const distance = 15; // 15px movement

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const progress = (elapsed % duration) / duration;
      
      // Smooth up-down motion using sine wave
      const yPos = Math.sin(progress * Math.PI * 2) * distance;
      
      cube.style.transform = `translateY(${yPos}px)`;
      
      requestAnimationFrame(animate);
    };

    const animationId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationId);
  }, [isMounted]);

  return (
    <section className="relative bg-[#010028] py-8 md:py-16 overflow-hidden">
      <div className="container max-w-7xl mx-auto px-4 sm:px-6 md:px-12">
        <span className="text-[#60A5FA] text-sm sm:text-[18px] leading-[100%] font-semibold uppercase tracking-wide px-2 py-1.5 rounded-l-full rounded-r-full bg-[#1D4ED840]">
          ABOUT BILLOQ
        </span>
        
        <div className="flex flex-col lg:flex-row items-center gap-6 md:gap-12 ">
          {/* Left Side: Text */}
          <div className="flex-1 z-10">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-semibold text-white mt-2 leading-tight">
              Revolutionizing Bills Payment With {" "}
              <span className="text-blue-500">Blockchain</span>
            </h2>
            <p className="text-gray-400 mt-4 md:mt-6 text-sm sm:text-base max-w-lg">
              Billoq was created to solve the challenges of traditional bill payment systems by leveraging blockchain technology to provide transparency, security, and user control.
            </p>
          </div>

          {/* Animated Blockchain Cube */}
          <div className="flex-1 relative min-h-[200px] sm:min-h-[250px] md:min-h-[300px] lg:min-h-[420px] w-full">
            <div 
              ref={cubeRef}
              className="absolute top-0 lg:top-36 right-0 w-full h-full z-0 lg:w-[630px] lg:h-[420px]"
              style={{
                willChange: 'transform',
                transition: 'transform 0.5s ease-out'
              }}
            >
              <Image
                src="/blockchain-cube.png"
                alt="Blockchain Cube"
                width={630}
                height={420}
                className="object-contain w-full h-full lg:w-[630px] lg:h-[420px]"
                priority
              />
            </div>
          </div>
        </div>
        
        {/* About Cards */}
        <div className="relative grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 lg:-mt-4  md:mt-12 z-20">
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