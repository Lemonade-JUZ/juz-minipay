"use server"

import { type Address, encodePacked, keccak256, parseEther } from "viem"
import { privateKeyToAccount } from "viem/accounts"
import { celo } from "viem/chains"

import { ABI_DISPENSER } from "@/lib/abis"
import { celoClient } from "@/lib/celo"
import { ADDRESS_DISPENSER } from "@/lib/constants"

const account = privateKeyToAccount(process.env.DEV_JUZ_PK as `0x${string}`)

export async function getDispenserPayload(address: Address) {
  const nonce = await celoClient.readContract({
    abi: ABI_DISPENSER,
    functionName: "nonces",
    address: ADDRESS_DISPENSER,
    args: [address],
  })

  const amount = parseEther("1") // Test out 1 JUZ token
  const deadline = BigInt(Math.floor(Date.now() / 1000) + 60 * 5) // 5 minutes
  const encoded = encodePacked(
    [
      "string",
      "uint256",
      "address",
      "address",
      "uint256",
      "uint256",
      "uint256",
    ],
    [
      // Encoding the namespace
      "JUZDispenser",
      // Encode the chain ID for CELO
      // to make this signature chain-specific
      BigInt(celo.id),
      ADDRESS_DISPENSER,
      address,
      nonce,
      amount,
      deadline,
    ]
  )

  const signature = await account.signMessage({
    message: { raw: keccak256(encoded) },
  })

  return { signature, amount, deadline }
}
