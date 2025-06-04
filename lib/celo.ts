import { createPublicClient, http } from "viem"
import { celo } from "viem/chains"

export const celoClient = createPublicClient({
  chain: celo,
  transport: http(),
})
