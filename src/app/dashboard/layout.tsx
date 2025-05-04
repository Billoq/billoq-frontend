// "use client"

// import { AppSidebar } from "@/components/Dashboard/Sidebar/AppSidebar"
// import { SidebarProvider } from "@/context/sidebar-context"
// import { TransactionProvider } from "@/context/transaction-context"
// import type React from "react"

// interface DashboardLayoutProps {
//   children: React.ReactNode
// }

// const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
//   return (
//     <SidebarProvider>
//       <div className="flex min-h-screen bg-[#161E28]">
//         {/* Sidebar will be fixed */}
//         <div className="hidden lg:block fixed inset-y-0 left-0 z-30 w-64">
//           <AppSidebar />
//         </div>
        
//         {/* Main content with padding to account for sidebar */}
//         <div className="flex-1 lg:pl-64">
//           <TransactionProvider>
//           {children}
//           </TransactionProvider>

//         </div>
//       </div>
//     </SidebarProvider>
//   )
// }

// export default DashboardLayout

"use client"

import { AppSidebar } from "@/components/Dashboard/Sidebar/AppSidebar"
import { SidebarProvider } from "@/context/sidebar-context"
import { TransactionProvider } from "@/context/transaction-context"
import { Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useSidebar } from "@/context/sidebar-context"
import type React from "react"

// Mobile toggle component extracted for better organization
function MobileToggle() {
  const { toggle } = useSidebar()
  
  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggle}
      className="fixed left-4 top-4 z-20 rounded-md bg-slate-800 p-2 hover:bg-slate-700 lg:hidden"
    >
      <Menu className="h-5 w-5 text-slate-200" />
      <span className="sr-only">Toggle sidebar</span>
    </Button>
  )
}

interface DashboardLayoutProps {
  children: React.ReactNode
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen bg-[#161E28]">
        {/* Sidebar */}
        <AppSidebar />
        
        {/* Main content */}
        <div className="flex-1 w-full">
          {/* Mobile toggle button */}
          <MobileToggle />
          
          {/* Content container */}
          <TransactionProvider>
            {children}
          </TransactionProvider>
        </div>
      </div>
    </SidebarProvider>
  )
}

export default DashboardLayout

