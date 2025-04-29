"use client"

import { useState, useEffect } from "react"
import { usePathname } from "next/navigation"
import { SearchInput } from "./search-input"
import { NotificationBell } from "./notification-bell"
import { UserProfile } from "./user-profile"
import { Skeleton } from "@/components/ui/skeleton"

interface DashboardHeaderProps {
  username?: string
  avatarUrl?: string
  onSearch?: (query: string) => void
  notificationCount?: number
}

export function DashboardHeader({
  username = "0a1xxx251",
  avatarUrl,
  onSearch,
  notificationCount = 0,
}: DashboardHeaderProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const pathname = usePathname()

  // Simulate loading state for demonstration
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  // Get the current page title from the pathname
  const getPageTitle = () => {
    if (pathname === "/dashboard") return "Dashboard"

    const path = pathname.split("/dashboard/").filter(Boolean)
    if (path.length === 0) return "Dashboard"

    // Capitalize the first letter of the last segment
    const title = path[path.length - 1]
    return title.charAt(0).toUpperCase() + title.slice(1)
  }

  // Handle search input
  const handleSearch = (query: string) => {
    if (onSearch) {
      onSearch(query)
    }
  }

  // Error state
  if (error) {
    return (
      <div className="flex h-16 items-center justify-between bg-red-900/20 px-4 md:px-6">
        <h1 className="text-2xl font-bold">Error</h1>
        <p className="text-red-400">Failed to load header: {error.message}</p>
      </div>
    )
  }

  // Loading state
  if (isLoading) {
    return (
      <div className="flex h-16 items-center justify-between bg-[#0f172a] px-4 md:px-6">
        <Skeleton className="h-8 w-32" />
        
        <div className="flex items-center gap-4">
        <Skeleton className="h-10 w-64 rounded-full" />
          <Skeleton className="h-8 w-8 rounded-full" />
          <Skeleton className="h-8 w-24" />
        </div>
      </div>
    )
  }

  return (
    <header className="flex h-16 items-center justify-between bg-[#0f172a] px-4 md:px-6">
      <h1 className="text-2xl font-bold text-white">{getPageTitle()}</h1>

      <div className="lg:flex  hidden md:block">
        <SearchInput onSearch={handleSearch} />


      <div className="flex items-center gap-4">
     
        <UserProfile username={username} avatarUrl={avatarUrl} />
        <NotificationBell count={notificationCount} />
      </div>
     
      </div>

    </header>
  )
}
