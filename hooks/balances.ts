"use client"

import useSWR from "swr"
import { erc20Abi, formatEther, parseUnits } from "viem"
import { atomWithStorage } from "jotai/utils"
import { useAtom } from "jotai"

import { getPlayerJUZEarned } from "@/actions/game"
import { ADDRESS_JUZ, ZERO } from "@/lib/constants"
import { useWalletAuth } from "./wallet"
import { celoClient } from "@/lib/celo"

const atomlastClaim = atomWithStorage("juz.mini.lastClaim", 0)

export const useAccountBalances = () => {
  const [lastClaim, setLastClaim] = useAtom(atomlastClaim)
  const { address } = useWalletAuth()

  const canClaimOnchain = Date.now() - lastClaim > 7_000 // 7 seconds

  const { data: balances = null, ...query } = useSWR(
    address ? `wallet.holdings.${address}` : null,
    async () => {
      if (!address) return null

      // We fetch the ERC20 Balance of JUZ and the total points accumulated
      // by playing the trivia game

      const [ERC20JUZBalance, JUZPoints] = await Promise.all([
        celoClient.readContract({
          abi: erc20Abi,
          functionName: "balanceOf",
          address: ADDRESS_JUZ,
          args: [address],
        }),
        getPlayerJUZEarned(address),
      ])

      return {
        JUZToken: ERC20JUZBalance,
        JUZPoints: parseUnits(`${JUZPoints}`, 18),
      }
    },
    {
      keepPreviousData: true,
      refreshInterval: 4_500, // 4.5 seconds
    }
  )

  const JUZToken = balances?.JUZToken || ZERO
  const JUZPoints = balances?.JUZPoints || ZERO

  const TotalJUZBalance = JUZPoints + JUZToken

  return {
    ...query,
    /** SWR returned payload in case we need to "revalidate" */
    data: balances,
    TotalJUZBalance: {
      balance: TotalJUZBalance,
      formatted: formatEther(TotalJUZBalance),
    },
    revalidateTimeSynced: () => {
      console.debug("Revalidating JUZ Balance")
      setLastClaim(Date.now())
    },
    JUZToken: {
      balance: JUZToken,
      formatted: formatEther(JUZToken),
    },
    JUZPoints: {
      balance: JUZPoints,
      formatted: formatEther(JUZPoints),
      /** `true` if user has claimed this balance as ERC20 token */
      isOnchainSynced: canClaimOnchain
        ? JUZPoints < 1
        : // If timer is not active, we assume user has claimed
          true,
    },
  }
}
