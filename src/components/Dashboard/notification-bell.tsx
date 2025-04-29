"use client"

import { Bell } from "lucide-react"
import { Button } from "@/components/ui/button"

interface NotificationBellProps {
  count?: number
}

export function NotificationBell({ count = 0 }: NotificationBellProps) {
  return (
    <Button variant="ghost" size="icon" className="relative text-slate-400 hover:text-white">
      <Bell className="h-5 w-5" />
      {count > 0 && (
        <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-blue-500 text-xs font-bold text-white">
          {count > 9 ? "9+" : count}
        </span>
      )}
      <span className="sr-only">Notifications</span>
    </Button>
  )
}
