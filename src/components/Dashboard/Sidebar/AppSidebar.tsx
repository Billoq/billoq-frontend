"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutGrid, Settings, HelpCircle, BarChart3, ArrowLeftRight, Menu } from "lucide-react"
import { useSidebar } from "@/context/sidebar-context"
import { Button } from "@/components/ui/button"
import Image from "next/image"

const navItems = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: LayoutGrid,
  },
  {
    name: "Services",
    href: "/dashboard/services",
    icon: BarChart3,
  },
  {
    name: "Transactions",
    href: "/dashboard/transactions",
    icon: ArrowLeftRight,
  },
  {
    name: "Settings",
    href: "/dashboard/settings",
    icon: Settings,
  },
  {
    name: "Support",
    href: "/dashboard/support",
    icon: HelpCircle,
  },
]

export function AppSidebar() {
  const { isOpen, toggle } = useSidebar()
  const pathname = usePathname()

  return (
    <>
      {/* Mobile backdrop overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-30 bg-black/60 backdrop-blur-sm lg:hidden" 
          onClick={toggle} 
          aria-hidden="true" 
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 flex-col border-r border-slate-800 bg-[#030C0F] transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } lg:sticky lg:top-0 lg:translate-x-0 lg:h-screen flex`}
      >
        {/* Sidebar header */}
        <div className="flex h-16 items-center border-b border-slate-800 px-4">
          <Link href="/" className="flex items-center text-2xl font-bold text-[#139EBB]">
            <div className="text-[#139EBB] font-bold text-2xl flex gap-2 items-center">
              <Image
                src="/newlogo.png"
                alt="Billoq Logo"
                width={40}
                height={40}
                className="w-8 h-8"
              />
              Billoq
            </div>
          </Link>
          
          {/* Close button - visible only on mobile */}
          <Button
            variant="ghost"
            size="icon"
            onClick={toggle}
            className="ml-auto text-slate-300 hover:text-white hover:bg-slate-700/50 rounded-md lg:hidden"
          >
            <Menu className="h-5 w-5" />
            <span className="sr-only">Close sidebar</span>
          </Button>
        </div>

        {/* Sidebar navigation */}
        <nav className="flex-1 space-y-3 overflow-y-auto px-2 py-8">
          {navItems.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => {
                  // Close sidebar on mobile when clicking a nav item
                  if (window.innerWidth < 1024) {
                    toggle()
                  }
                }}
                className={`flex items-center rounded-md px-3 py-3 text-md font-medium transition-colors ${
                  isActive ? "bg-slate-800 text-[#1B89A4]" : "text-slate-300 hover:bg-slate-800/50 hover:text-white"
                }`}
              >
                <item.icon className={`mr-3 h-6 w-6 ${isActive ? "text-[#1B89A4]" : "text-slate-400"}`} />
                {item.name}
              </Link>
            )
          })}
        </nav>
      </aside>
    </>
  )
}