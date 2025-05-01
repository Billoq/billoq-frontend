"use client"
import { useState } from "react"
import {
  Wallet,
  Bell,
  Shield,
  Check,
  Copy,
  Loader2,
  Key,
  Lock,
  LogOut,
  Settings as SettingsIcon,
  ExternalLink,
  ChevronDown
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { useAccount, useDisconnect } from "wagmi"
import { useRouter } from "next/navigation"
import { sepolia, liskSepolia } from 'wagmi/chains'

const networks = [
  { id: sepolia.id, name: sepolia.name, color: "bg-[#627EEA]" },
  { id: liskSepolia.id, name: liskSepolia.name, color: "bg-[#8247E5]" }
]

export default function DashboardSettings() {
  const router = useRouter()
  const { address, isConnected, connector } = useAccount()
  const { disconnect } = useDisconnect()
  
  // Notification settings
  const [notifications, setNotifications] = useState({
    transactions: true,
    security: true,
    promotions: false
  })

  // Security settings
  const [security, setSecurity] = useState({
    twoFactor: false,
    activityTracking: true
  })

  const [copied, setCopied] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [saveStatus, setSaveStatus] = useState<"success" | "error" | string | null>(null)
  const [currentChainId, setCurrentChainId] = useState(networks[0].id)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)

  const truncateAddress = (addr: string | undefined) => 
    addr ? `${addr.slice(0, 6)}...${addr.slice(-4)}` : ""

  const getWalletIcon = () => {
    if (connector?.icon) {
      return (
        <img
          src={connector.icon}
          alt={connector.name}
          className="w-6 h-6 rounded-full"
        />
      )
    }
    return <Wallet className="w-6 h-6 text-blue-500" />
  }

  const getWalletName = () => 
    connector?.name || "Connected Wallet"

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleDisconnect = () => {
    disconnect()
    router.push('/')
  }

  const handleSave = () => {
    setIsSaving(true)
    setTimeout(() => {
      setIsSaving(false)
      setSaveStatus("success")
      setTimeout(() => setSaveStatus(null), 3000)
    }, 1000)
  }

  const handleNetworkSwitch = (chainId: number) => {
    setCurrentChainId(chainId)
    const networkName = networks.find(n => n.id === chainId)?.name || 'Unknown'
    setSaveStatus(`Switched to ${networkName} network`)
    setTimeout(() => setSaveStatus(null), 3000)
  }

  const currentNetwork = networks.find(n => n.id === currentChainId) || networks[0]

  return (
    <div className="p-4 md:p-6 h-full max-w-6xl mx-auto">
      {/* Network switch notification */}
      {saveStatus && typeof saveStatus === 'string' && (
        <Alert className="fixed top-4 right-4 w-auto max-w-sm bg-[#1E293B] border-[#3B82F6] text-white shadow-lg z-50">
          <Check className="h-4 w-4" />
          <AlertDescription>{saveStatus}</AlertDescription>
        </Alert>
      )}

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

            {/* Help Card - Only visible on desktop */}
            <div className="hidden md:block mt-6">
              <Card className="border-[#1E293B] bg-[#111C2F]">
                <CardHeader className="pb-4">
                  <CardTitle className="text-lg text-white">Need Help?</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-[#94A3B8] mb-4">
                    Contact our support team for assistance with your settings.
                  </p>
                  <Button className="w-full bg-[#3B82F6] hover:bg-[#2563EB] text-white">
                    Contact Support
                  </Button>
                </CardContent>
              </Card>
            </div>
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
                            <div className="h-12 w-12 rounded-full bg-[#1E293B] flex items-center justify-center">
                              <div className={`h-3 w-3 rounded-full ${currentNetwork.color}`} />
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <h3 className="font-medium text-white">{currentNetwork.name}</h3>
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
                            <Button
                              variant="outline"
                              size="sm"
                              className="border-[#1E293B] bg-[#111C2F] hover:bg-[#1E293B] text-white"
                              onClick={() => window.open(`https://etherscan.io/address/${address}`, "_blank")}
                            >
                              <ExternalLink className="mr-2 h-4 w-4" />
                              Explorer
                            </Button>
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
                          {networks.map(network => (
                            <button
                              key={network.id}
                              onClick={() => handleNetworkSwitch(network.id)}
                              className={`flex items-center gap-3 p-3 rounded-lg border transition-all ${
                                network.id === currentChainId
                                  ? "bg-[#1E293B] border-[#3B82F6] shadow-[0_0_0_1px_#3B82F6]"
                                  : "bg-[#111C2F] border-[#1E293B] hover:border-[#3B82F6]/50"
                              }`}
                            >
                              <div className={`h-3 w-3 rounded-full ${network.color}`} />
                              <span className="text-white">{network.name}</span>
                              {network.id === currentChainId && <Check className="ml-auto h-4 w-4 text-[#3B82F6]" />}
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

            {/* Rest of the tabs remain the same */}
            {/* Notification Settings */}
            <TabsContent value="notifications" className="space-y-6">
              {/* ... existing notification settings content ... */}
            </TabsContent>

            {/* Security Settings */}
            <TabsContent value="security" className="space-y-6">
              {/* ... existing security settings content ... */}
            </TabsContent>
          </div>
        </div>
      </Tabs>
    </div>
  )
}

