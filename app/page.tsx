"use client"

import { Fragment, useState } from "react"
import { erc20Abi, parseEther } from "viem"
import { Button, useToast } from "@worldcoin/mini-apps-ui-kit-react"

import { getDispenserPayload } from "@/actions/dispenser"
import { useWalletAuth } from "@/hooks/wallet"
import { ABI_DISPENSER } from "@/lib/abis"
import { ADDRESS_DISPENSER } from "@/lib/constants"
import { useSendTransaction } from "@/hooks/divvi"
import { beautifyAddress } from "@/lib/utils"
import WheelSpin from "@/components/WheelSpin"

const DEV_ADDRESS = "0xA353557ddfc96325a8ab18E6f6d9c1fC0d7C1eA6"
export default function PageHome() {
  const { toast } = useToast()
  const { address, isMiniPay, signIn } = useWalletAuth()

  const { sendTransaction } = useSendTransaction()
  const [showGame, setShowGame] = useState(null as { topic?: string } | null)

  console.debug({ showGame })

  function handleSendCUSD() {
    sendTransaction({
      address: "0x765DE816845861e75A25fCA122bb6898B8B1282a",
      abi: erc20Abi,
      functionName: "transfer",
      args: [DEV_ADDRESS, parseEther("0.1")], // Adjust the recipient address and amount as needed
    })
  }

  async function handleClaimJUZToken() {
    if (!address) return signIn()

    try {
      const { amount, deadline, signature } = await getDispenserPayload(address)
      await sendTransaction({
        abi: ABI_DISPENSER,
        address: ADDRESS_DISPENSER,
        functionName: "claim",
        args: [amount, deadline, signature],
      })

      toast.success({
        title: `Yaay 1 JUZ claimed!`,
      })
    } catch (error) {
      console.error({ error })
      toast.error({
        title: "Oops! Something went wrong.",
      })
    }
  }

  return (
    <main className="flex bg-gradient-to-br from-juz-orange/0 via-juz-orange/0 to-juz-orange/7 px-4 pt-6 min-h-full flex-col gap-2">
      <div className="size-full rounded-full mt-12 overflow-clip grid place-items-center">
        <WheelSpin
          enableSpin
          onItemSelected={(topic) => {
            toast.success({
              title: `Topic selected ${topic}`,
            })
            setShowGame({ topic })
          }}
          size="min(calc(95vw - 2rem), 24rem)"
          items={["Animals", "History", "Science"]}
        />
      </div>
      <div className="my-3" />
    </main>
  )
}
