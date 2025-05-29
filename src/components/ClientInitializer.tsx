'use client'

import { useState, useEffect } from "react";

export default function ClientInitializer({ 
  children 
}: { 
  children: React.ReactNode 
}) {
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);

  // Return a simplified version during SSR
  if (!mounted) {
    return (
      <div className="fixed inset-0 bg-colors-OffWhite flex items-center justify-center w-full h-full">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-[#1B89A4]"></div>
      </div>
    )
  }

  return <>{children}</>;
}