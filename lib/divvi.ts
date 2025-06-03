"use client"

import type { Hash } from "viem"
import { getDataSuffix, submitReferral } from "@divvi/referral-sdk"
import { useWriteContract } from "wagmi"
import { celo } from "viem/chains"

export const appendDivviSuffix = () => {
  return getDataSuffix({
    consumer: "0xA353557ddfc96325a8ab18E6f6d9c1fC0d7C1eA6",
    providers: [
      "0x0423189886d7966f0dd7e7d256898daeee625dca",
      "0xc95876688026be9d6fa7a7c33328bd013effa2bb",
    ],
  }) as Hash
}

export const withDivviSuffix = async (tx: Promise<Hash> | Hash) => {
  const txHash = await tx
  await submitReferral({
    chainId: celo.id,
    txHash,
  })

  return txHash
}

/**
 * Hook to send a transaction + append Divvi suffix
 * Follows wagmi's `useSendTransaction` hook
 */
export const useSendTransaction = () => {
  const { writeContractAsync } = useWriteContract()

  return {
    sendTransaction: async (
      config: Parameters<typeof writeContractAsync>[0]
    ) => {
      const txHash = await writeContractAsync({
        ...config,
        dataSuffix: appendDivviSuffix(),
      })

      return withDivviSuffix(txHash)
    },
  }
}
