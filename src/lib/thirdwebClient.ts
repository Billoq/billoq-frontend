"use client";

import { createThirdwebClient } from "thirdweb";

const clientId = process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID;

if (!clientId) {
  throw new Error(
    "Missing NEXT_PUBLIC_THIRDWEB_CLIENT_ID. Please set it in your environment to initialize thirdweb."
  );
}

export const thirdwebClient = createThirdwebClient({
  clientId,
});

