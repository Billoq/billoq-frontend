"use client"

import { useState } from "react"
import { ChevronDown } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface UserProfileProps {
  username: string
  avatarUrl?: string
}

export function UserProfile({ username, avatarUrl }: UserProfileProps) {
  const [isOpen, setIsOpen] = useState(false)

  // Get initials for avatar fallback
  const getInitials = (name: string) => {
    return name.substring(0, 2).toUpperCase()
  }

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <button className="flex items-center gap-2 outline-none">
          <Avatar className="h-8 w-8 border border-slate-700">
            <AvatarImage src={avatarUrl || "/placeholder.svg"} alt={username} />
            <AvatarFallback className="bg-blue-900 text-white">{getInitials(username)}</AvatarFallback>
          </Avatar>
          <div className="hidden md:block">
            <div className="flex items-center gap-1">
              <span className="text-sm font-medium text-white">{username}</span>
              <ChevronDown className="h-4 w-4 text-slate-400" />
            </div>
            <p className="text-xs text-slate-400">{username}</p>
          </div>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56 bg-slate-800 text-white border-slate-700">
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator className="bg-slate-700" />
        <DropdownMenuItem className="hover:bg-slate-700">Profile</DropdownMenuItem>
        <DropdownMenuItem className="hover:bg-slate-700">Settings</DropdownMenuItem>
        <DropdownMenuItem className="hover:bg-slate-700">Wallet</DropdownMenuItem>
        <DropdownMenuSeparator className="bg-slate-700" />
        <DropdownMenuItem className="text-red-400 hover:bg-slate-700 hover:text-red-400">Sign out</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
