// app/layout.tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { headers } from "next/headers"; 
import ContextProvider from '@/context'
import ClientInitializer from "@/components/ClientInitializer";

export const metadata: Metadata = {
  title: "Billoq - Web3 Payment Solution",
  description: "Powered by WalletConnect"
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
        <ContextProvider cookies={cookies}>
          <ClientInitializer>
            {children}
          </ClientInitializer>
        </ContextProvider>
      </body>
    </html>
  )
}