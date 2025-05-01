// app/layout.tsx
import type { Metadata } from "next";;
import "./globals.css";
// import ContextProvider from '@/context'
import ClientInitializer from "@/components/ClientInitializer";
import { AppKit } from "../context/appkit";
import { Providers } from "../context/providers";
import { ToastContainer } from "react-toastify";

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
            <Providers>{children}
            <ToastContainer
                position="bottom-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="dark"
                toastStyle={{
                  backgroundColor: '#0F172A',
                  border: '1px solid #1E293B',
                  borderRadius: '0.5rem',
                }}
              />
            </Providers>
          </AppKit>
          </ClientInitializer>
        
      </body>
    </html>
  )
}
