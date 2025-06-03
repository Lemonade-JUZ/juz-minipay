import type { Hash } from "viem"
import { getDataSuffix, submitReferral } from "@divvi/referral-sdk"
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

export const withDivviSuffix = async (tx: Promise<Hash>) => {
  await submitReferral({
    txHash: await tx,
    chainId: celo.id,
  })
}
