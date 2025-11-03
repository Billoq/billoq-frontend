# Social Login Configuration Guide for Billoq

## Problem
Social logins (Google, X, GitHub, Discord, Apple, Facebook, Farcaster) show a popup but nothing happens. Only wallet connections work.

## Root Cause
There were TWO issues:
1. **Code Issue (FIXED ✅)**: You were using `EthersAdapter` instead of `WagmiAdapter`. EthersAdapter has limited support for social logins. This has been FIXED in your `src/context/appkit.tsx` file.
2. **Backend Configuration**: Social login features require proper configuration in the WalletConnect Cloud dashboard.

## Solution: Configure WalletConnect Cloud

### Step 1: Access Your Project
1. Go to https://cloud.reown.com
2. Log in with your account
3. Find your project with ID: `a9fbadc760baa309220363ec867b732e`

### Step 2: Enable Social Providers
1. Navigate to your project dashboard
2. Go to **Settings** → **Auth**
3. Enable **Email Login**
4. Enable the social providers you want:
   - Google
   - X (Twitter)
   - GitHub
   - Discord
   - Apple
   - Facebook
   - Farcaster

### Step 3: Configure Allowed Domains
1. In the **Auth** settings, add your allowed domains:
   - `http://localhost:3000` (for development)
   - `https://www.billoqpay.com` (for production)
   - Any other domains where your app is hosted

### Step 4: Configure Redirect URIs (Important!)
Add these redirect URIs in your WalletConnect Cloud project:
- `http://localhost:3000/__walletconnect_auth`
- `https://www.billoqpay.com/__walletconnect_auth`
- Any other domains: `https://yourdomain.com/__walletconnect_auth`

### Step 5: Verify Configuration
1. Save all settings in WalletConnect Cloud
2. Wait 1-2 minutes for configuration to propagate
3. Clear browser cache and cookies
4. Test the social login again

## Code Fixes Applied ✅

**FIXED**: Changed from `EthersAdapter` to `WagmiAdapter` in `src/context/appkit.tsx`:

```typescript
// OLD (Had issues with social login):
import { EthersAdapter } from "@reown/appkit-adapter-ethers";
createAppKit({
  adapters: [new EthersAdapter()],
  ...
});

// NEW (Fixed - Better social login support):
import { wagmiAdapter } from "@/config/index";
createAppKit({
  adapters: [wagmiAdapter],
  ...
});
```

Your features configuration is correct:

```typescript
features: {
  analytics: true,
  email: true, // ✅ Enabled
  socials: [
    "google",
    "x",
    "github",
    "discord",
    "apple",
    "facebook",
    "farcaster"
  ], // ✅ Enabled
  emailShowWallets: false,
}
```

## Testing After Configuration

1. Open your app in an incognito/private window
2. Click on the AppKit connect button
3. Try logging in with Google or another social provider
4. The popup should now complete the authentication process

## Troubleshooting

### If social login still doesn't work:

1. **Check Browser Console** for errors
   - Open DevTools (F12)
   - Look for CORS errors or authentication errors

2. **Verify Project ID**
   - Ensure you're configuring the correct project: `a9fbadc760baa309220363ec867b732e`

3. **Check Domain Whitelist**
   - Make sure your current domain is in the allowed list

4. **Clear All Cache**
   ```bash
   # For development
   rm -rf .next
   npm run dev
   ```

5. **Check Network Tab**
   - Look for failed requests to WalletConnect auth endpoints
   - Verify the redirect flow is happening correctly

## Additional Notes

- Social logins require an active internet connection
- Some social providers (like Apple) require additional app configuration
- Email login requires email verification to be enabled in WalletConnect Cloud
- You may need to verify your domain ownership for production deployments

## Reference Links

- WalletConnect Cloud: https://cloud.reown.com
- AppKit Docs: https://docs.reown.com/appkit/overview
- Social Login Setup: https://docs.reown.com/appkit/features/social-login
