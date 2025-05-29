"use client"
import { useState } from "react"
import {
  Wallet,
  Bell,
  Shield,
  Check,
  Copy,
  ExternalLink
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { useAccount, useDisconnect, useSwitchChain } from "wagmi"
import { useRouter } from "next/navigation"
import { sepolia, liskSepolia, arbitrumSepolia, bscTestnet } from 'wagmi/chains'
import Image from "next/image"
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

const supportedChains = [sepolia, liskSepolia, arbitrumSepolia, bscTestnet]

export default function DashboardSettings() {
  const router = useRouter()
  const { address, isConnected, connector, chain } = useAccount()
  const { disconnect } = useDisconnect()
  const { switchChain } = useSwitchChain()
  
  // State
  const [copied, setCopied] = useState(false)
  // const [, setIsSaving] = useState(false)
  // const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  // const [showWalletInfo, setShowWalletInfo] = useState(false)
  
  // Settings
  // const [notifications, setNotifications] = useState({
  //   transactions: true,
  //   security: true,
  //   promotions: false
  // })
  // const [security, setSecurity] = useState({
  //   twoFactor: false,
  //   activityTracking: true
  // })

  const truncateAddress = (addr: string | undefined) => 
    addr ? `${addr.slice(0, 6)}...${addr.slice(-4)}` : ""

  const getWalletIcon = () => {
    if (connector?.icon) {
      return (
        <Image
          src={connector.icon}
          alt={connector.name || "Wallet"}
          width={24}
          height={24}
          className="w-6 h-6 rounded-full"
          unoptimized
        />
      )
    }
    return <Wallet className="w-6 h-6 text-[#1B89A4]" />
  }

  const getChainIcon = () => {
    return <div className={`w-3 h-3 rounded-full ${chain?.id === sepolia.id ? 'bg-green-500' : 'bg-[#8247E5]'}`} />
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    toast.success("Address copied to clipboard!", {
      position: "bottom-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "dark",
    })
    setTimeout(() => setCopied(false), 2000)
  }

  const handleDisconnect = () => {
    disconnect()
    router.push('/')
    toast.info("Wallet disconnected", {
      position: "bottom-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "dark",
    })
  }

  const handleSwitchChain = async (chainId: number) => {
    try {
      await switchChain({ chainId })
      toast.success(`Switched to ${supportedChains.find(c => c.id === chainId)?.name} network`, {
        position: "bottom-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      })
    } catch (error) {
      console.error("Error switching chain:", error)
      toast.error("Failed to switch network", {
        position: "bottom-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      })
    }
  }

  // const handleSave = () => {
  //   setIsSaving(true)
  //   setTimeout(() => {
  //     setIsSaving(false)
  //     toast.success("Settings saved successfully!", {
  //       position: "bottom-right",
  //       autoClose: 3000,
  //       hideProgressBar: false,
  //       closeOnClick: true,
  //       pauseOnHover: true,
  //       draggable: true,
  //       progress: undefined,
  //       theme: "dark",
  //     })
  //   }, 1000)
  // }

  return (
    <div className="p-4 md:p-6 h-full max-w-6xl mx-auto overflow-y-auto">
      {/* Toast Container */}
      <ToastContainer
        position="bottom-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
        toastStyle={{
          backgroundColor: '#0F172A',
          border: '1px solid #1E293B',
          borderRadius: '0.5rem',
        }}
      />

      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-white">
          <span className="text-[#1B89A4]">Settings</span>
        </h1>
        <p className="text-[#94A3B8]">Manage your wallet and account preferences</p>
      </div>

      <Tabs defaultValue="wallet" className="space-y-6">
        <div className="flex flex-col md:flex-row gap-4 md:gap-6">
          {/* Sidebar Navigation */}
          <div className="w-full md:w-56">
            <TabsList className="flex flex-row md:flex-col w-full bg-[#1A202885] border border-[#1E293B] rounded-lg p-1 h-auto">
              <TabsTrigger
                value="wallet"
                className="flex items-center cursor-pointer justify-start w-full px-3 md:px-4 py-2 md:py-3 gap-2 md:gap-3 data-[state=active]:bg-[#1E293B] data-[state=active]:text-white text-[#94A3B8] hover:bg-[#1E293B]/50 transition-colors"
              >
                <Wallet className="h-4 w-4 md:h-5 md:w-5 flex-shrink-0" />
                <span className="truncate">Wallet</span>
              </TabsTrigger>
              <TabsTrigger
                value="notifications"
                className="flex items-center  cursor-pointer justify-start w-full px-3 md:px-4 py-2 md:py-3 gap-2 md:gap-3 data-[state=active]:bg-[#1E293B] data-[state=active]:text-white text-[#94A3B8] hover:bg-[#1E293B]/50 transition-colors"
              >
                <Bell className="h-4 w-4 md:h-5 md:w-5 flex-shrink-0" />
                <span className="truncate">Notifications</span>
              </TabsTrigger>
              <TabsTrigger
                value="security"
                className="flex items-center  cursor-pointer justify-start w-full px-3 md:px-4 py-2 md:py-3 gap-2 md:gap-3 data-[state=active]:bg-[#1E293B] data-[state=active]:text-white text-[#94A3B8] hover:bg-[#1E293B]/50 transition-colors"
              >
                <Shield className="h-4 w-4 md:h-5 md:w-5 flex-shrink-0" />
                <span className="truncate">Security</span>
              </TabsTrigger>
            </TabsList>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Wallet Settings */}
            <TabsContent value="wallet" className="space-y-4 md:space-y-6 mt-4 md:mt-0">
              <Card className="border-[#1E293B] bg-[#1A202885]">
                <CardHeader className="px-4 py-4 md:px-6 md:py-6">
                  <CardTitle className="text-lg md:text-xl text-white flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-[#1E293B]">
                      <Wallet className="h-4 w-4 md:h-5 md:w-5 text-[#1B89A4]" />
                    </div>
                    Wallet Settings
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 md:space-y-6 px-4 md:px-6">
                  {isConnected ? (
                    <>
                      <div className="bg-[#111C2F] border border-[#1E293B] rounded-lg p-4 md:p-6 relative overflow-hidden">
                        <div className="absolute -top-20 -right-20 w-40 h-40 bg-[#3B82F6]/10 rounded-full blur-3xl"></div>
                        
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative">
                          <div className="flex items-center gap-3 md:gap-4">
                            <div className="relative">
                              {getWalletIcon()}
                              <div className="absolute -bottom-1 -right-1">
                                {getChainIcon()}
                              </div>
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <h3 className="font-medium text-sm md:text-base text-white">{chain?.name || "Unknown Network"}</h3>
                                <Badge className="bg-green-900/20 text-green-400 border-green-800 text-xs">
                                  Connected
                                </Badge>
                              </div>
                              <div className="flex items-center gap-2 mt-1">
                                <p className="text-xs md:text-sm text-[#94A3B8] font-mono">
                                  {truncateAddress(address)}
                                </p>
                                <TooltipProvider>
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-5 w-5 md:h-6 md:w-6 text-[#94A3B8] cursor-pointer p-0"
                                        onClick={() => address && copyToClipboard(address)}
                                      >
                                        {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                                      </Button>
                                    </TooltipTrigger>
                                    <TooltipContent className="bg-[#1E293B] border-[#1E293B] text-white">
                                      <p>{copied ? "Copied!" : "Copy address"}</p>
                                    </TooltipContent>
                                  </Tooltip>
                                </TooltipProvider>
                              </div>
                            </div>
                          </div>
                          <div className="flex gap-2 md:gap-3 mt-2 sm:mt-0">
                            {chain?.blockExplorers?.default?.url && (
                              <Button
                                variant="outline"
                                size="sm"
                                className="border-[#1E293B] bg-[#111C2F]  cursor-pointer  text-white text-xs md:text-sm py-1 px-2 md:px-3 h-8"
                                onClick={() => chain?.blockExplorers?.default?.url && window.open(`${chain.blockExplorers.default.url}/address/${address}`, "_blank")}
                              >
                                <ExternalLink className="mr-1 md:mr-2 h-3 w-3 md:h-4 md:w-4" />
                                Explorer
                              </Button>
                            )}
                            <Button
                              variant="destructive"
                              size="sm"
                              className="bg-red-900/20 hover:bg-red-900/30 text-white border-red-900/30 text-xs md:text-sm py-1 px-2 md:px-3 h-8 cursor-pointer"
                              onClick={handleDisconnect}
                            >
                              Disconnect
                            </Button>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-3 md:space-y-4">
                        <h3 className="text-base md:text-lg font-medium text-white">Default Network</h3>
                        <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 md:gap-3 w-full">
                          {supportedChains.map(network => (
                            <button
                              key={network.id}
                              onClick={() => handleSwitchChain(network.id)}
                              className={`flex items-center gap-2 md:gap-3 p-2 md:p-3 rounded-lg border transition-all w-full  cursor-pointer ${
                                network.id === chain?.id
                                  ? "bg-[#1E293B] border-[#3B82F6] shadow-[0_0_0_1px_#3B82F6]"
                                  : "bg-[#111C2F] border-[#1E293B] hover:border-[#3B82F6]/50"
                              }`}
                              disabled={!switchChain}
                            >
                              <div className={`h-2 w-2 md:h-3 md:w-3 rounded-full flex-shrink-0 ${network.id === sepolia.id ? 'bg-[#627EEA]' : 'bg-[#8247E5]'}`} />
                              <span className="text-white text-sm md:text-base truncate">{network.name}</span>
                              {network.id === chain?.id && <Check className="ml-auto h-3 w-3 md:h-4 md:w-4 text-[#1B89A4] flex-shrink-0" />}
                            </button>
                          ))}
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="text-center py-8 md:py-12">
                      <div className="inline-flex h-12 w-12 md:h-16 md:w-16 items-center justify-center rounded-full bg-[#1E293B] mb-4 md:mb-6">
                        <Wallet className="h-6 w-6 md:h-8 md:w-8 text-[#3B82F6]" />
                      </div>
                      <h3 className="text-lg md:text-xl font-medium mb-2 md:mb-3 text-white">No Wallet Connected</h3>
                      <p className="text-sm md:text-base text-[#94A3B8] mb-4 md:mb-6 max-w-md mx-auto">
                        Connect your wallet to manage your settings
                      </p>
                      <Button 
                        className="bg-[#1B89A4] hover:bg-[#2563EB] text-white"
                        onClick={() => router.push('/')}
                      >
                        Connect Wallet
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Notification Settings */}
            <TabsContent value="notifications" className="space-y-6">
              {/* ... existing notification settings ... */}
            </TabsContent>

            {/* Security Settings */}
            <TabsContent value="security" className="space-y-6">
              {/* ... existing security settings ... */}
            </TabsContent>
          </div>
        </div>
      </Tabs>
    </div>
  )
}