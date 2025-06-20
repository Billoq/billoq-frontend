"use client"

import { Button } from "./ui/button"
import { Navbar } from "./navbar"
import Image from "next/image"
import Link from "next/link"
import { motion, useAnimation } from "framer-motion"
import { useInView } from "react-intersection-observer"
import { useEffect, type ReactNode, useCallback } from "react"
import { useAppKitAccount, useAppKit } from "@reown/appkit/react"
import { useRouter } from "next/navigation"
import { RollingBall } from "./RollingBall"

// Define the AnimatedSection component
interface AnimatedSectionProps {
  children: ReactNode
  delay?: number
  direction?: "up" | "down" | "left" | "right"
  className?: string
  distance?: number
}

export const AnimatedSection = ({
  children,
  delay = 0.2,
  direction = "up",
  className = "",
  distance = 100,
}: AnimatedSectionProps) => {
  const controls = useAnimation()
  const [ref, inView] = useInView({
    triggerOnce: false,
    threshold: 0.1,
  })

  const getInitialState = useCallback(() => {
    switch (direction) {
      case "up":
        return { y: distance, opacity: 0 }
      case "down":
        return { y: -distance, opacity: 0 }
      case "left":
        return { x: distance, opacity: 0 }
      case "right":
        return { x: -distance, opacity: 0 }
      default:
        return { y: distance, opacity: 0 }
    }
  }, [direction, distance])

  const getAnimateState = useCallback(() => {
    switch (direction) {
      case "up":
      case "down":
        return { y: 0, opacity: 1 }
      case "left":
      case "right":
        return { x: 0, opacity: 1 }
      default:
        return { y: 0, opacity: 1 }
    }
  }, [direction])

  useEffect(() => {
    if (inView) {
      controls.start(getAnimateState())
    } else {
      controls.start(getInitialState())
    }
  }, [controls, inView, getAnimateState, getInitialState])

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
  )
}

export function HeroSection() {
  // Wallet connection hooks
  const { isConnected } = useAppKitAccount()
  const { open } = useAppKit()
  const router = useRouter()

  const handleGetStarted = async () => {
    if (isConnected) {
      // If already connected, navigate to dashboard
      router.push("/dashboard")
    } else {
      // If not connected, open wallet connection modal
      try {
        await open()
      } catch (error) {
        console.error("Connection error:", error)
      }
    }
  }

  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      <div className="absolute inset-0 z-0 bg-[url('/herobg.png')] bg-cover bg-center">
        {/* Dark overlay to make text more readable */}
        <div className="absolute inset-0 bg-black/30"></div>
      </div>

      {/* Background effects */}
      <div className="absolute inset-0 z-10">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#1B89A4]/30 rounded-full filter blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#1B89A4]/20 rounded-full filter blur-3xl"></div>
      </div>

      {/* Rolling balls - moved here to be behind the content */}
      <div className="absolute inset-0 z-15">
        <RollingBall size={40} color="#1B89A4" duration={7} yPosition="30%" />
        <RollingBall size={60} color="#5FB3C4" duration={10} delay={2} yPosition="50%" />
        <RollingBall size={30} color="#8CCCD9" duration={5} delay={1} yPosition="70%" />
        <RollingBall size={40} color="#156D83" duration={7} yPosition="30%" />
        <RollingBall size={60} color="#0F4F5E" duration={10} delay={2} yPosition="50%" />
        <RollingBall size={30} color="#558B97" duration={5} delay={1} yPosition="70%" />
        <RollingBall size={40} color="#3A6E7F" duration={7} yPosition="30%" />
        <RollingBall size={60} color="#0B2F36" duration={10} delay={2} yPosition="50%" />
        <RollingBall size={30} color="#2D5E9C" duration={5} delay={1} yPosition="70%" />
        <RollingBall size={40} color="#1F6F91" duration={7} yPosition="30%" />
      </div>

      {/* Content - now has a higher z-index to be above the balls */}
      <div className="relative z-20 max-w-7xl mx-auto">
        <Navbar />

        <div className="container mx-auto px-6 pt-16 md:pt-24 pb-20 text-center">
          <AnimatedSection direction="down" delay={0.3}>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white max-w-4xl mx-auto leading-tight">
              A Comprehensive <span className="text-[#1B89A4]">Web3 Payment</span>, Designed To Ease Your Subscription{" "}
              <span className="text-[#1B89A4]">Services</span>.
            </h1>
          </AnimatedSection>

          <AnimatedSection direction="up" delay={0.5}>
            <p className="mt-6 text-gray-300 max-w-2xl mx-auto text-lg">
              Billoq Make It Easy To Pay For Electricity, Cable Tv, Internet Subscription And Lots More Using
              Cryptocurrency
            </p>
          </AnimatedSection>

          <AnimatedSection direction="up" delay={0.7}>
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center mx-6 gap-4">
              <Button 
                onClick={handleGetStarted}
                className="bg-[#1B89A4] hover:bg-[#1B89A4]/80 text-white w-[230px] py-6 text-lg cursor-pointer"
              >
                {isConnected ? "Go to Dashboard" : "Get Started"}
              </Button>
              <Button 
                variant="outline" 
                className="bg-transparent text-white hover:bg-gray-800 w-[230px] py-6 text-lg cursor-pointer"
                asChild
              >
                <Link href="/about">
                  Learn more
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="ml-2"
                  >
                    <path d="M5 12h14" />
                    <path d="m12 5 7 7-7 7" />
                  </svg>
                </Link>
              </Button>
            </div>
          </AnimatedSection>

          <div className="mt-16 px-6 grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl">
            <AnimatedSection direction="left" delay={0.9}>
              <div className="flex items-center gap-4">
                <div className="flex-shrink-0 bg-[#42556CCC] p-2 rounded-full">
                  <Image src="/fast.png" alt="Fast & secured" width={27} height={27} className="w-7 h-7" />
                </div>
                <div>
                  <h3 className="text-lg font-medium text-white">Fast & secured</h3>
                  <p className="text-gray-400">Blockchain-powered</p>
                </div>
              </div>
            </AnimatedSection>

            <AnimatedSection direction="right" delay={1.1}>
              <div className="flex items-center gap-4">
                <div className="flex-shrink-0 bg-[#42556CCC] p-2 rounded-full">
                  <Image src="/fully.png" alt="Fully Protected" width={27} height={27} className="w-7 h-7" />
                </div>
                <div>
                  <h3 className="text-lg font-medium text-white">Fully Protected</h3>
                  <p className="text-gray-400">Smart contracts</p>
                </div>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </div>
    </div>
  )
}