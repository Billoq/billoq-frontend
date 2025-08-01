// config/index.tsx

import { cookieStorage, createStorage } from '@wagmi/core'
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi'
import { arbitrum, lisk, liskSepolia, arbitrumSepolia, bsc, bscTestnet} from '@reown/appkit/networks'

// Get projectId from environment variable
export const projectId = process.env.NEXT_PUBLIC_PROJECT_ID || '1922d8f34388fb1c3b3553c342d31094'

if (!projectId) {
  throw new Error('Project ID is not defined')
}

export const networks = [arbitrum, lisk, liskSepolia, arbitrumSepolia, bsc, bscTestnet]

//Set up the Wagmi Adapter (Config)
export const wagmiAdapter = new WagmiAdapter({
  storage: createStorage({
    storage: cookieStorage
  }),
  ssr: true,
  projectId,
  networks
})

export const config = wagmiAdapter.wagmiConfig