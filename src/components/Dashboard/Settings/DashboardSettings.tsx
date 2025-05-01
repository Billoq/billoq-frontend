"use client"
import { useState } from "react"
import {
  Wallet,
  Bell,
  Shield,
  Check,
  Copy,
  Loader2,
  ExternalLink,
  ChevronDown,
  LogOut,
  X
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useAccount, useDisconnect, useConnectors, useSwitchChain } from "wagmi"
import { useRouter } from "next/navigation"
import { sepolia, liskSepolia } from 'wagmi/chains'
import Image from "next/image"
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

const supportedChains = [sepolia, liskSepolia]

export default function DashboardSettings() {
  const router = useRouter()
  const { address, isConnected, connector, chain } = useAccount()
  const { disconnect } = useDisconnect()
  const connectors = useConnectors()
  const { switchChain } = useSwitchChain()
  
  // State
  const [copied, setCopied] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [showWalletInfo, setShowWalletInfo] = useState(false)
  
  // Settings
  const [notifications, setNotifications] = useState({
    transactions: true,
    security: true,
    promotions: false
  })
  const [security, setSecurity] = useState({
    twoFactor: false,
    activityTracking: true
  })

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
    return <Wallet className="w-6 h-6 text-blue-500" />
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

  const handleSave = () => {
    setIsSaving(true)
    setTimeout(() => {
      setIsSaving(false)
      toast.success("Settings saved successfully!", {
        position: "bottom-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      })
    }, 1000)
  }

  return (
    <div className="p-4 md:p-6 h-full max-w-6xl mx-auto">
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

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">
          <span className="text-[#3B82F6]">Settings</span>
        </h1>
        <p className="text-[#94A3B8]">Manage your wallet and account preferences</p>
      </div>

      <Tabs defaultValue="wallet" className="space-y-6">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Sidebar Navigation */}
          <div className="md:w-56">
            <TabsList className="flex flex-row md:flex-col w-full bg-[#111C2F] border border-[#1E293B] rounded-lg p-1 h-auto">
              <TabsTrigger
                value="wallet"
                className="flex items-center justify-start w-full px-4 py-3 gap-3 data-[state=active]:bg-[#1E293B] data-[state=active]:text-white text-[#94A3B8] hover:bg-[#1E293B]/50 transition-colors"
              >
                <Wallet className="h-5 w-5 flex-shrink-0" />
                <span className="truncate">Wallet</span>
              </TabsTrigger>
              <TabsTrigger
                value="notifications"
                className="flex items-center justify-start w-full px-4 py-3 gap-3 data-[state=active]:bg-[#1E293B] data-[state=active]:text-white text-[#94A3B8] hover:bg-[#1E293B]/50 transition-colors"
              >
                <Bell className="h-5 w-5 flex-shrink-0" />
                <span className="truncate">Notifications</span>
              </TabsTrigger>
              <TabsTrigger
                value="security"
                className="flex items-center justify-start w-full px-4 py-3 gap-3 data-[state=active]:bg-[#1E293B] data-[state=active]:text-white text-[#94A3B8] hover:bg-[#1E293B]/50 transition-colors"
              >
                <Shield className="h-5 w-5 flex-shrink-0" />
                <span className="truncate">Security</span>
              </TabsTrigger>
            </TabsList>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Wallet Settings */}
            <TabsContent value="wallet" className="space-y-6">
              <Card className="border-[#1E293B] bg-[#0A1525]">
                <CardHeader>
                  <CardTitle className="text-xl text-white flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-[#1E293B]">
                      <Wallet className="h-5 w-5 text-[#3B82F6]" />
                    </div>
                    Wallet Settings
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {isConnected ? (
                    <>
                      <div className="bg-[#111C2F] border border-[#1E293B] rounded-lg p-6 relative overflow-hidden">
                        <div className="absolute -top-20 -right-20 w-40 h-40 bg-[#3B82F6]/10 rounded-full blur-3xl"></div>
                        
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative">
                          <div className="flex items-center gap-4">
                            <div className="relative">
                              {getWalletIcon()}
                              <div className="absolute -bottom-1 -right-1">
                                {getChainIcon()}
                              </div>
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <h3 className="font-medium text-white">{chain?.name || "Unknown Network"}</h3>
                                <Badge className="bg-green-900/20 text-green-400 border-green-800">
                                  Connected
                                </Badge>
                              </div>
                              <div className="flex items-center gap-2 mt-1">
                                <p className="text-sm text-[#94A3B8] font-mono">
                                  {truncateAddress(address)}
                                </p>
                                <TooltipProvider>
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-6 w-6 text-[#94A3B8] hover:text-white"
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
                          <div className="flex gap-3">
                            {chain?.blockExplorers?.default?.url && (
                              <Button
                                variant="outline"
                                size="sm"
                                className="border-[#1E293B] bg-[#111C2F] hover:bg-[#1E293B] text-white"
                                onClick={() => chain?.blockExplorers?.default?.url && window.open(`${chain.blockExplorers.default.url}/address/${address}`, "_blank")}
                              >
                                <ExternalLink className="mr-2 h-4 w-4" />
                                Explorer
                              </Button>
                            )}
                            <Button
                              variant="destructive"
                              size="sm"
                              className="bg-red-900/20 hover:bg-red-900/30 text-white border-red-900/30"
                              onClick={handleDisconnect}
                            >
                              Disconnect
                            </Button>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <h3 className="text-lg font-medium text-white">Default Network</h3>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                          {supportedChains.map(network => (
                            <button
                              key={network.id}
                              onClick={() => handleSwitchChain(network.id)}
                              className={`flex items-center gap-3 p-3 rounded-lg border transition-all ${
                                network.id === chain?.id
                                  ? "bg-[#1E293B] border-[#3B82F6] shadow-[0_0_0_1px_#3B82F6]"
                                  : "bg-[#111C2F] border-[#1E293B] hover:border-[#3B82F6]/50"
                              }`}
                              disabled={!switchChain}
                            >
                              <div className={`h-3 w-3 rounded-full ${network.id === sepolia.id ? 'bg-[#627EEA]' : 'bg-[#8247E5]'}`} />
                              <span className="text-white">{network.name}</span>
                              {network.id === chain?.id && <Check className="ml-auto h-4 w-4 text-[#3B82F6]" />}
                            </button>
                          ))}
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="text-center py-12">
                      <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-[#1E293B] mb-6">
                        <Wallet className="h-8 w-8 text-[#3B82F6]" />
                      </div>
                      <h3 className="text-xl font-medium mb-3 text-white">No Wallet Connected</h3>
                      <p className="text-[#94A3B8] mb-6 max-w-md mx-auto">
                        Connect your wallet to manage your settings
                      </p>
                      <Button 
                        className="bg-[#3B82F6] hover:bg-[#2563EB] text-white"
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