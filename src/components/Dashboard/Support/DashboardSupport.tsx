"use client"

import { useState } from "react"
import {
  Search,
  ArrowRight,
  MessageCircle,
  FileText,
  ExternalLink,
  HelpCircle,
  Shield,
  Zap,
  Lightbulb,
} from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { motion } from "framer-motion"

const commonTopics = [
  {
    id: 1,
    title: "Connecting Your Wallet",
    description: "Learn how to connect different wallet types to Billoq",
    icon: <Shield className="h-5 w-5" />,
    category: "Getting Started",
    views: 1245,
  },
  {
    id: 2,
    title: "Understanding Gas Fees",
    description: "Everything you need to know about transaction fees",
    icon: <Zap className="h-5 w-5" />,
    category: "Payments",
    views: 982,
  },
  {
    id: 3,
    title: "Payment Failed Troubleshooting",
    description: "Common issues and solutions for failed transactions",
    icon: <HelpCircle className="h-5 w-5" />,
    category: "Troubleshooting",
    views: 1567,
  },
  {
    id: 4,
    title: "Account Security Best Practices",
    description: "Keep your wallet and account secure with these tips",
    icon: <Shield className="h-5 w-5" />,
    category: "Security",
    views: 876,
  },
]

const guides = [
  {
    id: 1,
    title: "How to Pay a Bill",
    description: "Step-by-step guide to complete your Web3 bill payments.",
    link: "#",
    icon: <FileText className="h-6 w-6" />,
  },
  {
    id: 2,
    title: "Gas Fees Explained",
    description: "Understand what gas fees are and how to reduce them.",
    link: "#",
    icon: <Zap className="h-6 w-6" />,
  },
  {
    id: 3,
    title: "Security & Privacy Tips",
    description: "Best practices for protecting your wallet and data.",
    link: "#",
    icon: <Shield className="h-6 w-6" />,
  },
]

const communityLinks = [
  {
    title: "Join Billoq Discord",
    link: "#",
    icon: <MessageCircle className="h-5 w-5" />,
  },
  {
    title: "Follow on Twitter",
    link: "#",
    icon: <ExternalLink className="h-5 w-5" />,
  },
  {
    title: "Check Status Page",
    link: "#",
    icon: <Lightbulb className="h-5 w-5" />,
  },
]

export default function DashboardSupport() {
  const [searchQuery, setSearchQuery] = useState("")
  const [activeCategory, setActiveCategory] = useState("All")

  const categories = ["All", "Getting Started", "Payments", "Troubleshooting", "Security"]

  const filteredTopics = commonTopics.filter(
    (topic) =>
      (activeCategory === "All" || topic.category === activeCategory) &&
      (searchQuery === "" ||
        topic.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        topic.description.toLowerCase().includes(searchQuery.toLowerCase())),
  )

  return (
    <div className="bg-[#0f172a] text-white p-6 md:p-8 lg:p-10 min-h-screen">
      {/* Hero Section */}
      <div className="relative mb-12 overflow-hidden rounded-2xl bg-gradient-to-r from-[#111827] to-[#0f172a] p-8 md:p-10">
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-[#2563eb]/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-32 -left-32 w-80 h-80 bg-[#2563eb]/5 rounded-full blur-3xl"></div>

        <div className="relative z-10 max-w-3xl">
          <h1 className="text-3xl md:text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-blue-600">
            Support Center
          </h1>
          <p className="text-xl md:text-2xl font-medium text-slate-300 mb-8">
            Need help? We're here for you — fast and secure support for your Web3 payments.
          </p>

          <div className="flex flex-col md:flex-row items-center gap-4">
            <div className="flex items-center w-full bg-[#1e293b] rounded-xl px-6 py-4 border border-[#2e3b52] shadow-lg shadow-blue-900/10">
              <Search className="h-5 w-5 text-blue-400" />
              <input
                type="text"
                placeholder="Search for a topic"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="ml-4 bg-transparent outline-none text-white text-lg w-full placeholder-slate-400 focus:placeholder-slate-500 transition-colors"
              />
            </div>
            <Button className="w-full md:w-auto bg-[#2563eb] hover:bg-[#1d4ed8] text-white text-lg font-medium px-8 py-6 h-auto rounded-xl shadow-lg shadow-blue-900/20 transition-all hover:shadow-blue-900/30 hover:scale-[1.02]">
              Search
            </Button>
          </div>
        </div>
      </div>

      {/* Categories */}
      <div className="mb-10">
        <div className="flex flex-wrap gap-3">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                activeCategory === category
                  ? "bg-[#2563eb] text-white shadow-lg shadow-blue-900/20"
                  : "bg-[#1e293b] text-slate-300 hover:bg-[#2e3b52]"
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Common Topics */}
      <div className="mb-12">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Common Topics</h2>
          <Button variant="ghost" className="text-blue-400 hover:text-blue-300 hover:bg-[#1e293b]">
            View all <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredTopics.map((topic) => (
            <motion.div
              key={topic.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="bg-[#1e293b] border-[#2e3b52] hover:border-[#2563eb]/50 hover:shadow-lg hover:shadow-blue-900/10 transition-all duration-300 h-full">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="h-10 w-10 rounded-lg bg-[#2563eb]/20 flex items-center justify-center text-blue-400">
                      {topic.icon}
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Badge className="bg-[#111827] text-blue-400 hover:bg-[#1e293b]">{topic.category}</Badge>
                        <span className="text-xs text-slate-400">{topic.views} views</span>
                      </div>
                      <h3 className="font-semibold text-lg text-white">{topic.title}</h3>
                      <p className="text-sm text-slate-400">{topic.description}</p>
                      <Button variant="link" className="text-blue-400 hover:text-blue-300 p-0">
                        Read more <ArrowRight className="ml-1 h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Guides & Resources */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold mb-6">Guides & Resources</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {guides.map((guide) => (
            <motion.div key={guide.id} whileHover={{ scale: 1.03 }} transition={{ type: "spring", stiffness: 300 }}>
              <Card className="bg-gradient-to-br from-[#1e293b] to-[#111827] border-[#2e3b52] hover:border-[#2563eb]/50 overflow-hidden group">
                <CardContent className="p-6 relative">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-[#2563eb]/5 rounded-full blur-2xl transform translate-x-16 -translate-y-16 group-hover:bg-[#2563eb]/10 transition-all duration-700"></div>

                  <div className="h-12 w-12 rounded-xl bg-[#2563eb]/20 flex items-center justify-center text-blue-400 mb-4">
                    {guide.icon}
                  </div>

                  <h3 className="text-xl font-semibold mb-2 text-white">{guide.title}</h3>
                  <p className="text-sm text-slate-400 mb-4">{guide.description}</p>

                  <a
                    href={guide.link}
                    className="inline-flex items-center text-blue-400 hover:text-blue-300 font-medium transition-colors"
                  >
                    Read article <ArrowRight className="ml-2 h-4 w-4" />
                  </a>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Community & Updates */}
      <div className="rounded-2xl bg-[#111827] border border-[#2e3b52] p-8">
        <h2 className="text-2xl font-bold mb-6">Community & Updates</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {communityLinks.map((item, index) => (
            <a
              key={index}
              href={item.link}
              className="flex items-center gap-4 p-4 rounded-xl bg-[#1e293b] hover:bg-[#2e3b52] border border-[#2e3b52] hover:border-[#2563eb]/50 transition-all group"
            >
              <div className="h-10 w-10 rounded-full bg-[#2563eb]/20 flex items-center justify-center text-blue-400 group-hover:bg-[#2563eb]/30 transition-colors">
                {item.icon}
              </div>
              <span className="text-lg font-medium text-white">{item.title}</span>
              <ArrowRight className="ml-auto h-5 w-5 text-blue-400 transform group-hover:translate-x-1 transition-transform" />
            </a>
          ))}
        </div>
      </div>

      {/* Contact Support */}
      <div className="mt-12 text-center">
        <p className="text-slate-400 mb-4">Can't find what you're looking for?</p>
        <Button className="bg-[#2563eb] hover:bg-[#1d4ed8] text-white px-8 py-6 h-auto text-lg font-medium rounded-xl shadow-lg shadow-blue-900/20 transition-all hover:shadow-blue-900/30">
          <MessageCircle className="mr-2 h-5 w-5" />
          Contact Support Team
        </Button>
      </div>
    </div>
  )
}
