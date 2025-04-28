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
            <AppSidebar />
            
            {children}

          </div>
        </SidebarProvider>
  )
}

export default DashboardLayout

