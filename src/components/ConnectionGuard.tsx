"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useActiveAccount } from "thirdweb/react";

const protectedRoutes = ["/dashboard"];

export function ConnectionGuard() {
  const account = useActiveAccount();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!pathname) return;

    const requiresWallet = protectedRoutes.some((route) =>
      pathname === route || pathname.startsWith(`${route}/`)
    );

    if (requiresWallet && !account?.address) {
      router.replace("/");
    }
  }, [account?.address, pathname, router]);

  return null;
}

