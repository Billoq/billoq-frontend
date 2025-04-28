'use strict'

import { Globe, Lightbulb, Monitor, Droplet, BookOpen, Video, Smartphone, Fuel } from "lucide-react"

const defaultProviders = ["National grid", "Power corp", "City electric"]

const services = [
  {
    title: "Electricity",
    icon: Lightbulb,
    providers: defaultProviders,
  },
  {
    title: "Cable TV",
    icon: Monitor,
    providers: defaultProviders,
  },
  {
    title: "Internet Connection",
    icon: Globe,
    providers: defaultProviders,
  },
  {
    title: "Water",
    icon: Droplet,
    providers: defaultProviders,
  },
  {
    title: "Educational",
    icon: BookOpen,
    providers: defaultProviders,
  },
  {
    title: "Streaming services",
    icon: Video,
    providers: defaultProviders,
  },
  {
    title: "Mobile Recharge",
    icon: Smartphone,
    providers: defaultProviders,
  },
  {
    title: "Gas",
    icon: Fuel,
    providers: defaultProviders,
  },
]

export default services