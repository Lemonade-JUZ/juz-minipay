"use client"

import type { PropsWithChildren } from "react"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { celo } from "wagmi/chains"
import { WagmiProvider, createConfig, http } from "wagmi"
import { fallback } from "viem"

export const config = createConfig({
  chains: [celo],
  transports: {
    [celo.id]: fallback([
      // Here we can add our custom RPCs for Base
      // Default to public RPC - HTTP
      http(),
    ]),
  },
  ssr: true,
})

const queryClient = new QueryClient()

export default function Web3Provider({ children }: PropsWithChildren) {
  return (
    <QueryClientProvider client={queryClient}>
      <WagmiProvider config={config}>{children}</WagmiProvider>
    </QueryClientProvider>
  )
}
