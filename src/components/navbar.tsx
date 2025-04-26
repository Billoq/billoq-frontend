


import Link from "next/link"
import { Button } from "./ui/button"
import Image from "next/image"

interface NavItem {
  label: string
  href: string
}

const navItems: NavItem[] = [
  { label: "Home", href: "/" },
  { label: "Services", href: "/services" },
  { label: "Features", href: "/features" },
  { label: "About Us", href: "/about" },
  { label: "FAQs", href: "/faqs" },
]

export function Navbar() {
  return (
    <nav className="flex items-center justify-between pt-[16px] px-6 md:px-12 w-full ">
      <div className="flex items-center">
        <Link href="/" className="flex items-center">
          <div className="text-blue-500 font-bold text-2xl flex gap-2 items-center">
          <Image
            src="/logo.png" // Path to your logo in the public folder
            alt="Billoq Logo"
            width={40} // Set appropriate width
            height={40} // Set appropriate height
            className="w-10 h-10" // Optional: additional styling
          />
            Billoq
          </div>
        </Link>
      </div>

      <div className="hidden md:flex items-center space-x-8">
        {navItems.map((item) => (
          <Link key={item.label} href={item.href} className="text-gray-200 hover:text-white transition-colors">
            {item.label}
          </Link>
        ))}
      </div>

      <Button className="bg-blue-600 hover:bg-blue-700 text-white py-3 px-10">Connect Wallet</Button>
    </nav>
  )
}

