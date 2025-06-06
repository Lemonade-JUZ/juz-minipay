"use client"

import type { Hash } from "viem"
import { getDataSuffix, submitReferral } from "@divvi/referral-sdk"
import { useWriteContract } from "wagmi"
import { celo } from "viem/chains"
import { atomWithStorage } from "jotai/utils"
import { useWalletAuth } from "@/hooks/wallet"
import { useAtom } from "jotai"

export const appendDivviSuffix = () => {
  return getDataSuffix({
    consumer: "0xA353557ddfc96325a8ab18E6f6d9c1fC0d7C1eA6",
    providers: [
      "0x0423189886d7966f0dd7e7d256898daeee625dca",
      "0xc95876688026be9d6fa7a7c33328bd013effa2bb",
    ],
  }) as Hash
}

// A list of addresses where we call `appendDivviSuffix`
// to include the users in the Divvi referral program
const atomReferredAddresses = atomWithStorage(
  "juz.mini.referredAddresses",
  {} as Record<string, string[]>
)

/**
 * Hook to send a transaction + append Divvi suffix
 * Follows wagmi's `useSendTransaction` hook
 */
export const useSendTransaction = () => {
  const { address } = useWalletAuth()
  const { writeContractAsync } = useWriteContract()

  const [referredAddresses, setReferredAddresses] = useAtom(
    atomReferredAddresses
  )

  return {
    sendTransaction: async (
      config: Parameters<typeof writeContractAsync>[0]
    ) => {
      const isSenderAlreadyReferredForContract = address
        ? referredAddresses?.[address]?.includes(config.address)
        : // Do not refer if disconnected
          true

      const txHash = await writeContractAsync({
        ...config,
        dataSuffix: appendDivviSuffix(),
      })

      if (!isSenderAlreadyReferredForContract && address) {
        // If connected and not referred
        // Refer the address to Divvi
        // This will only happen once per contract address

        submitReferral({
          chainId: celo.id,
          txHash,
        })
          .then(({ status }) => {
            if (status === 200) {
              // Store the referred address only when successful
              setReferredAddresses((prev) => ({
                ...prev,
                [address]: [...(prev[address] || []), config.address],
              }))
            }
          })
          .catch((error) => {
            // We don't want to block the user if divvi submission fails
            console.error({ error })
          })
      }

      return txHash
    },
  }
}
