"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import { Navbar } from "../navbar";
import Image from "next/image";
import { FAQSection } from "../faq-section";
import { Footer } from "../footer";
import { motion, useAnimation } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { AboutSection } from "../about-section";

// Adding the AnimatedSection component from code one
interface AnimatedSectionProps {
  children: React.ReactNode;
  delay?: number;
  direction?: "up" | "down" | "left" | "right";
  className?: string;
  distance?: number;
}

export const AnimatedSection = ({
  children,
  delay = 0.2,
  direction = "up",
  className = "",
  distance = 100,
}: AnimatedSectionProps) => {
  const controls = useAnimation();
  const [ref, inView] = useInView({
    triggerOnce: false,
    threshold: 0.1,
  });

  const getInitialState = useCallback(() => {
    switch (direction) {
      case "up":
        return { y: distance, opacity: 0 };
      case "down":
        return { y: -distance, opacity: 0 };
      case "left":
        return { x: distance, opacity: 0 };
      case "right":
        return { x: -distance, opacity: 0 };
      default:
        return { y: distance, opacity: 0 };
    }
  }, [direction, distance]);

  const getAnimateState = useCallback(() => {
    switch (direction) {
      case "up":
      case "down":
        return { y: 0, opacity: 1 };
      case "left":
      case "right":
        return { x: 0, opacity: 1 };
      default:
        return { y: 0, opacity: 1 };
    }
  }, [direction]);

  useEffect(() => {
    if (inView) {
      controls.start(getAnimateState());
    } else {
      controls.start(getInitialState());
    }
  }, [controls, inView, getInitialState, getAnimateState]);

  return (
    <motion.div
      ref={ref}
      initial={getInitialState()}
      animate={controls}
      transition={{
        duration: 0.8,
        delay,
        type: "spring",
        stiffness: 50,
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

function About() {
  const cubeRef = React.useRef<HTMLDivElement>(null);
  const [isMounted, setIsMounted] = useState(false);

  // Add animation effect for the cube on scroll
  useEffect(() => {
    const handleScroll = () => {
      if (cubeRef.current) {
        const scrollY = window.scrollY;
        const rotation = scrollY * 0.05;
        cubeRef.current.style.transform = `rotateY(${rotation}deg)`;
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Adding the floating animation from code one
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

      cube.style.transform = `translateY(${yPos}px) rotateY(${
        cube.style.transform
          ? cube.style.transform.match(/rotateY\(([^)]+)\)/)?.[1] || "0deg"
          : "0deg"
      })`;

      requestAnimationFrame(animate);
    };

    const animationId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationId);
  }, [isMounted]);

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
    <div className="relative min-h-screen w-full overflow-hidden bg-[#0A0E1A]">
      <Navbar />

      {/* Hero Section */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-16 md:pt-24 pb-12 text-center">
        <AnimatedSection direction="down" delay={0.2}>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-semibold text-white max-w-4xl mx-auto leading-tight">
            Powering Your <span className="text-[#3B82F6]">Bills</span> With
            Cryptocurrency
            <br />
            Meet <span className="text-[#3B82F6]">Billoq</span>
          </h1>
        </AnimatedSection>

        <AnimatedSection direction="up" delay={0.3}>
          <p className="text-base md:text-lg text-gray-300 mt-4 md:mt-6">
            We Make It Easy For Anyone To Pay Bills Using Crypto, Fast And
            Securely.
          </p>
        </AnimatedSection>

        <AnimatedSection direction="up" delay={0.4}>
          <div className="mt-8 md:mt-12 max-w-5xl mx-auto">
            <div className="relative bg-[#1A2233]  p-4 [box-shadow:0_-10px_15px_-3px_rgba(59,130,246,0.2),_-10px_0_15px_-3px_rgba(59,130,246,0.2),_10px_0_15px_-3px_rgba(59,130,246,0.2)]">
              <Image
                src="/Dashboard.png"
                alt="Billoq Dashboard"
                width={1000}
                height={200}
                className="w-full h-auto rounded-lg"
                priority
              />
            </div>
          </div>
        </AnimatedSection>

        {/* Progress Dots */}
        <AnimatedSection direction="up" delay={0.5}>
          <div className="w-full flex items-center justify-between mt-6 md:mt-8">
            <div className="h-4 w-4 rounded-full bg-blue-700"></div>
            <div className="h-px flex-1 bg-[#42556C]"></div>
            <div className="h-4 w-4 rounded-full bg-blue-700"></div>
            <div className="h-px flex-1 bg-[#42556C]"></div>
            <div className="h-4 w-4 rounded-full bg-blue-700"></div>
          </div>
        </AnimatedSection>
      </div>

      {/* About Us Section */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-16">
          {/* Left Side: Text */}
          <div className="flex-1">
            <AnimatedSection direction="right" delay={0.2}>
              <div className="inline-block mb-4">
                <span className="text-[#3B82F6] text-sm md:text-base font-semibold uppercase tracking-wide px-3 py-1 rounded-full bg-[#1D4ED820]">
                  ABOUT US
                </span>
              </div>
            </AnimatedSection>
            <AnimatedSection direction="up" delay={0.3}>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-semibold text-white mt-2 leading-tight">
                Who <span className="text-[#3B82F6]">We</span> Are
              </h2>
            </AnimatedSection>
            <AnimatedSection direction="up" delay={0.4}>
              <p className="text-gray-400 text-base md:text-lg mt-4 md:mt-6 leading-relaxed">
                BILLOQ is a Web3 Subscription application that provides a
                decentralized, transparent, and user-friendly solution for you
                to pay for electricity, cable TV, internet subscription and lots
                more. We leverage on using crypto currency to make bill payments
                simple, global, and crypto-first.
              </p>
            </AnimatedSection>
          </div>

          {/* Right Side: Image */}
          <AnimatedSection
            direction="left"
            delay={0.5}
            className="flex-1 mt-8 lg:mt-0 w-full"
          >
            <div className="relative w-full h-[250px] sm:h-[300px] md:h-[400px] flex items-center justify-center">
              <Image
                src="/Photoroom.png"
                alt="Billoq 3D Visualization"
                width={500}
                height={400}
                priority
                className="object-contain max-w-full max-h-full"
                style={{ display: "block" }}
              />
            </div>
          </AnimatedSection>
        </div>
      </div>

      {/* Revolutionizing Section */}
      <AboutSection />

      {/* FAQ Section */}
      <FAQSection />

      {/* Footer */}
      <Footer />
    </div>
  );
}

export default About;
