
// 'use client'

// import { wagmiAdapter, projectId } from '../config/index'
// import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
// import { createAppKit } from '@reown/appkit/react' 
// import {  mainnet, arbitrum, lisk, liskSepolia, sepolia } from '@reown/appkit/networks'
// import React, { type ReactNode } from 'react'
// import { cookieToInitialState, WagmiProvider, type Config } from 'wagmi'

// // Set up queryClient
// const queryClient = new QueryClient()

// if (!projectId) {
//   throw new Error('Project ID is not defined')
// }

// // Set up metadata
// const metadata = {
//   name: 'billoq',
//   description: 'AppKit Example',
//   url: 'https://reown.com/appkit', // origin must match your domain & subdomain
//   icons: ['https://assets.reown.com/reown-profile-pic.png']
// }

// // Create the modal
// const modal = createAppKit({
//   adapters: [wagmiAdapter],
//   projectId,
//   networks: [ mainnet, arbitrum, lisk, liskSepolia, sepolia],
//   defaultNetwork: mainnet,
//   metadata: metadata,
//   features: {
//     analytics: true, // Optional - defaults to your Cloud configuration
//   }
// })

// function ContextProvider({ children, cookies }: { children: ReactNode; cookies: string | null }) {
//   const initialState = cookieToInitialState(wagmiAdapter.wagmiConfig as Config, cookies)

//   return (
//     <WagmiProvider config={wagmiAdapter.wagmiConfig as Config} initialState={initialState}>
//       <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
//     </WagmiProvider>
//   )
// }

// export default ContextProvider
    