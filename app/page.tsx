"use client"

import { useWalletAuth } from "@/hooks/wallet"
import { beautifyAddress } from "@/lib/utils"
import { Button, useToast } from "@worldcoin/mini-apps-ui-kit-react"
import { erc20Abi, parseEther } from "viem"
import { useWriteContract } from "wagmi"

const DEV_ADDRESS = "0xA353557ddfc96325a8ab18E6f6d9c1fC0d7C1eA6"
export default function PageHome() {
  const { toast } = useToast()
  const { address, isMiniPay } = useWalletAuth()

  const { writeContract } = useWriteContract()

  function handleSendCUSD() {
    writeContract({
      address: "0x765DE816845861e75A25fCA122bb6898B8B1282a",
      abi: erc20Abi,
      functionName: "transfer",
      args: [DEV_ADDRESS, parseEther("0.1")], // Adjust the recipient address and amount as needed
    })
  }

  return (
    <main className="flex bg-gradient-to-br from-juz-orange/0 via-juz-orange/0 to-juz-orange/7 px-4 pt-6 min-h-full flex-col gap-2">
      <h2 className="font-title text-xl">Welcome to JUZ</h2>
      <div className="flex-grow" />

      <Button onClick={handleSendCUSD} variant="secondary">
        Send cUSD
      </Button>

      <Button>
        {address
          ? beautifyAddress(address)
          : isMiniPay
          ? "Connecting..."
          : "Connect Wallet"}
      </Button>

      <div className="my-3" />
    </main>
  )
}
