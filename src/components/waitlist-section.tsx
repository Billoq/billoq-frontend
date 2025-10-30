"use client"

import { useState } from "react"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { motion, useAnimation } from "framer-motion"
import { useInView } from "react-intersection-observer"
import { useEffect, type ReactNode, useCallback } from "react"
import { toast } from "react-toastify"
import { CheckCircle, ArrowRight } from "lucide-react"
import { billoqService } from "@/services/billoq.services"

// Define the AnimatedSection component (reused from hero-section)
interface AnimatedSectionProps {
  children: ReactNode
  delay?: number
  direction?: "up" | "down" | "left" | "right"
  className?: string
  distance?: number
}

const AnimatedSection = ({
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

export function WaitlistSection() {
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!email) {
      toast.error("Please enter your email address", {
        position: "bottom-right",
        autoClose: 3000,
      })
      return
    }

    setIsLoading(true)

    try {
      await billoqService.joinWaitlist(email)
      setIsSubmitted(true)
      toast.success("🎉 Welcome to Billoq V2! You're now on the waitlist.", {
        position: "bottom-right",
        autoClose: 5000,
      })
      setEmail("")
    } catch (error) {
      console.error('Waitlist submission error:', error)
      toast.error("Failed to join waitlist. Please try again.", {
        position: "bottom-right",
        autoClose: 3000,
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (isSubmitted) {
    return (
      <section id="waitlist" className="relative bg-[#11171F] py-8 md:py-16 overflow-hidden">
        <div className="container max-w-7xl mx-auto px-4 sm:px-6 md:px-12">
          <AnimatedSection direction="up" delay={0.2}>
            <div className="text-center max-w-2xl mx-auto">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-[#1B89A4]/20 rounded-full mb-6">
                <CheckCircle className="w-10 h-10 text-[#1B89A4]" />
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
                You&apos;re In! 🎉
              </h2>
              <p className="text-xl text-gray-300 mb-8">
                Welcome to the Billoq V2 waitlist. We&apos;ll notify you as soon as the new version is ready.
              </p>
              <div className="bg-[#1B89A4]/10 border border-[#1B89A4]/30 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-[#1B89A4] mb-2">What&apos;s Next?</h3>
                <p className="text-gray-300">
                  Keep an eye on your email for exclusive updates and early access notifications.
                </p>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>
    )
  }

  return (
    <section id="waitlist" className="relative bg-[#11171F] py-8 md:py-16 overflow-hidden">
      <div className="container max-w-7xl mx-auto px-4 sm:px-6 md:px-12">
        {/* Header */}
        <AnimatedSection direction="up" delay={0.2}>
          <div className="text-center max-w-4xl mx-auto mb-12">
            <span className="inline-block text-[#1B89A4] text-sm sm:text-[18px] leading-[100%] font-semibold uppercase tracking-wide px-2 py-1.5 rounded-l-full rounded-r-full bg-[#0E99BC26] mb-6">
              BILLOQ V2 WAITLIST
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-semibold text-white mt-2 leading-tight">
              Pay Any Bill With <span className="text-[#1B89A4]">Any Crypto</span>
            </h2>
            <p className="text-gray-400 mt-4 md:mt-6 text-sm sm:text-base max-w-2xl mx-auto">
              Multi-crypto support, Base network settlement, and loyalty rewards. Join the waitlist to be the first to experience Billoq V2.
            </p>
          </div>
        </AnimatedSection>

        {/* Waitlist Form */}
        <AnimatedSection direction="up" delay={0.4}>
          <div className="max-w-md mx-auto">
            <div className="bg-[#1a2234]/50 border border-[#1B89A4]/30 rounded-xl p-8">
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-white mb-2">
                  Join the Waitlist
                </h3>
                <p className="text-gray-300">
                  Be the first to experience Billoq V2
                </p>
              </div>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email address"
                    className="bg-[#11171F]/50 border-[#1B89A4]/30 text-white placeholder:text-gray-400 focus:border-[#1B89A4] focus:ring-[#1B89A4]/20 h-12"
                    required
                  />
                </div>
                
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-[#1B89A4] hover:bg-[#1B89A4]/80 text-white py-3 text-lg font-medium transition-all duration-200 disabled:opacity-50 h-12"
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      Joining...
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      Join Waitlist
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  )}
                </Button>
              </form>

              <div className="mt-6 text-center">
                <p className="text-xs text-gray-400">
                  We&apos;ll only send you updates about Billoq V2
                </p>
              </div>
            </div>
          </div>
        </AnimatedSection>
      </div>
    </section>
  )
}