// app/layout.tsx
import "./globals.css";
import { AppKit } from "../context/appkit";
import { Providers } from "../context/providers"; // This will be for Wagmi

export const metadata = {
  title: "Billoq",
  description: "Billoq Application",
};

export default function RootLayout({ 
  children 
}: { 
  children: React.ReactNode 
}) {
  return (
    <html lang="en">
      <body>
        <AppKit>
          <Providers>{children}</Providers>
        </AppKit>
      </body>
    </html>
  );
}