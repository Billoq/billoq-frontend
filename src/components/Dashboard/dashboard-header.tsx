"use client"

import { Bell, ChevronDown, Menu, Search } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useSidebar } from "@/context/sidebar-context"

export function DashboardHeader() {
  const { toggle } = useSidebar()

  return (
    <header className="flex items-center justify-between p-4 md:p-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" className="hidden lg:flex" onClick={toggle}>
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle sidebar</span>
        </Button>
        <h1 className="text-2xl font-bold">Dashboard</h1>
      </div>
      <div className="flex items-center gap-4">
        <div className="relative hidden md:block">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <Input
            placeholder="Search for..."
            className="w-64 rounded-full bg-slate-800 pl-10 text-sm text-white border-slate-700 focus-visible:ring-slate-600"
          />
        </div>
        <Button variant="ghost" size="icon" className="text-slate-400">
          <Bell className="h-5 w-5" />
        </Button>
        <div className="flex items-center gap-2">
          <Avatar className="h-8 w-8 border border-slate-700">
            <AvatarImage src="/placeholder-user.jpg" alt="User" />
            <AvatarFallback className="bg-slate-700">0x</AvatarFallback>
          </Avatar>
          <div className="hidden md:block">
            <div className="flex items-center gap-1">
              <span className="text-sm font-medium">0a1xxx251</span>
              <ChevronDown className="h-4 w-4 text-slate-400" />
            </div>
            <p className="text-xs text-slate-400">0a1xxx251</p>
          </div>
        </div>
      </div>
    </header>
  )
}
