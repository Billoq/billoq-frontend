// app/layout.tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { headers } from "next/headers"; 
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
  const headersList = headers();
  const cookies = (await headersList).get('cookie');

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
