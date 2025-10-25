import type React from "react"
import {
  Lightbulb,
  Smartphone,
  Globe,
  Droplet,
  Video,
  Monitor,
  Fuel,
  Trophy,
  BookOpen
} from "lucide-react"

export type ServiceType = {
  title: string
  description: string
  icon: React.ElementType
  providers: string[]
  comingSoon?: boolean
  featured?: boolean
}

const services: ServiceType[] = [
    {
    title: "Mobile Recharge",
    description: "Recharge your mobile service",
    icon: Smartphone,
    providers: ["Verizon Wireless", "AT&T", "T-Mobile"],
  },
    {
    title: "Internet Connection",
    description: "Pay your internet bills instantly",
    icon: Globe,
    providers: ["Comcast Xfinity", "Spectrum", "AT&T Fiber"],
  },
  {
    title: "Electricity",
    description: "Pay your electricity bills instantly",
    icon: Lightbulb,
    providers: ["National Grid", "Pacific Gas & Electric", "Duke Energy"],
    featured: true,
  },
  {
    title: "Cable TV",
    description: "Pay your cable TV bills instantly",
    icon: Monitor,
    providers: ["Comcast Xfinity", "Spectrum", "DirecTV"],
  },
  {
    title: "Water",
    description: "Pay your water bills instantly",
    icon: Droplet,
    comingSoon: true,
    featured: true,
    providers: ["American Water", "Aqua America", "California Water Service"],
  },
  {
    title: "Education",
    description: "Pay your education fees instantly",
    icon: BookOpen,
    comingSoon: true,
    providers: ["Navient", "Nelnet", "Great Lakes"],
  },
  {
    title: "Streaming Services",
    description: "Pay for streaming subscriptions",
    icon: Video,
    comingSoon: true,
    providers: ["Netflix", "Disney+", "Amazon Prime Video"],
  },

  {
    title: "Gas",
    description: "Pay your natural gas bills instantly",
    icon: Fuel,
    comingSoon: true,
    providers: ["Southern Company Gas", "National Fuel", "Dominion Energy"],
  },
  {
    title: "Betting",
    description: "Pay your betting",
    icon: Trophy,
    providers: ["Sporty", "Stake", "Bet9ja"],
    comingSoon: true,
  },
]

export default services
