// app/layout.tsx
import type { Metadata } from "next";;
import "./globals.css";
// import ContextProvider from '@/context'
import ClientInitializer from "@/components/ClientInitializer";
import { AppKit } from "../context/appkit";
import { Providers } from "../context/providers";

export const metadata: Metadata = {
  title: "Billoq",
  description: "Billoq Application"
};

export default async function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  // This function runs on the server
  


  return (
    <html lang="en">
      <body>
        
          <ClientInitializer>
          <AppKit>
            <Providers>{children}</Providers>
          </AppKit>
          </ClientInitializer>
        
      </body>
    </html>
  )
}
