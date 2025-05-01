import type React from "react"
import {
  Lightbulb,
  Smartphone,
  Globe,
  Droplet,
  Video,
  GraduationCap,
  Monitor,
  Fuel
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
    title: "Water",
    description: "Pay your water bills instantly",
    icon: Droplet,
    providers: ["American Water", "Aqua America", "California Water Service"],
    comingSoon: true,
  },
  {
    title: "Gas",
    description: "Pay your natural gas bills instantly",
    icon: Fuel,
    providers: ["Southern Company Gas", "National Fuel", "Dominion Energy"],
    comingSoon: true,
  },
  {
    title: "Streaming Services",
    description: "Pay for streaming subscriptions",
    icon: Video,
    providers: ["Netflix", "Disney+", "Amazon Prime Video"],
    comingSoon: true,
  },
  {
    title: "Education",
    description: "Pay your education fees instantly",
    icon: GraduationCap,
    providers: ["Navient", "Nelnet", "Great Lakes"],
    comingSoon: true,
  },
]

export default services