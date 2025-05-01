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
      {/* Mobile sidebar backdrop */}
      {isOpen && (
        <div className="fixed inset-0 z-20 bg-[#111C2F] lg:hidden" onClick={() => toggle()} aria-hidden="true" />
      )}

      {/* Sidebar - removed fixed positioning here since it's handled in layout */}
      <aside
        className={`flex h-full w-64 flex-col border-r border-slate-800 bg-[#111C2F] transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Sidebar header */}
        <div className="flex h-16 items-center bg-[#111C2F] border-slate-800 px-4">
          <Link href="/" className="flex items-center text-2xl font-bold text-blue-500">
            <div className="text-blue-500 font-bold text-2xl flex gap-2 items-center">
              <Image
                src="/logo.png"
                alt="Billoq Logo"
                width={40}
                height={40}
                className="w-10 h-10"
              />
              Billoq
            </div>
          </Link>
        </div>

        {/* Sidebar navigation */}
        <nav className="flex-1 space-y-3 px-2 py-12">
          {navItems.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center rounded-md px-3 py-3 text-md font-medium transition-colors ${
                  isActive ? "bg-slate-800 text-white" : "text-slate-300 hover:bg-slate-800/50 hover:text-white"
                }`}
              >
                <item.icon className={`mr-3 h-6 w-6 ${isActive ? "text-blue-500" : "text-slate-400"}`} />
                {item.name}
              </Link>
            )
          })}
        </nav>
      </aside>

      {/* Mobile toggle button */}
      <Button
        variant="ghost"
        size="icon"
        onClick={toggle}
        className="fixed left-4 top-4 z-40 rounded-md bg-slate-800 p-2 lg:hidden"
      >
        <Menu className="h-5 w-5" />
        <span className="sr-only">Toggle sidebar</span>
      </Button>
    </>
  )
}