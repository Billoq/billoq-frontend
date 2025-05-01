"use client"

import { AppSidebar } from "@/components/Dashboard/Sidebar/AppSidebar"
import { SidebarProvider } from "@/context/sidebar-context"
import type React from "react"

interface DashboardLayoutProps {
  children: React.ReactNode
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen bg-[#161E28]">
        {/* Sidebar will be fixed */}
        <div className="hidden lg:block fixed inset-y-0 left-0 z-30 w-64">
          <AppSidebar />
        </div>
        
        {/* Main content with padding to account for sidebar */}
        <div className="flex-1 lg:pl-64">
          {children}
        </div>
      </div>
    </SidebarProvider>
  )
}

export default DashboardLayout