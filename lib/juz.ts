import type { Address } from "viem"
import { ABI_DISPENSER } from "./abis"
import { celoClient } from "./celo"
import { ADDRESS_DISPENSER } from "./constants"

export const getClaimedJUZ = async (address: Address) => {
  return await celoClient.readContract({
    abi: ABI_DISPENSER,
    functionName: "claimed",
    address: ADDRESS_DISPENSER,
    args: [address],
  })
}
