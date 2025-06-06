"use client"

import { useState } from "react"
import { erc20Abi, parseEther } from "viem"
import { useToast } from "@worldcoin/mini-apps-ui-kit-react"

import WheelSpin from "@/components/WheelSpin"

import { ABI_DISPENSER } from "@/lib/abis"
import { ADDRESS_DISPENSER } from "@/lib/constants"

import { incrPlayerJUZEarned } from "@/actions/game"
import { getDispenserPayload } from "@/actions/dispenser"

import { useWalletAuth } from "@/hooks/wallet"
import { useCommonTriviaTopics } from "@/hooks/topics"
import { useSendTransaction } from "@/hooks/divvi"

import ModalGame from "./ModalGame"

const DEV_ADDRESS = "0xA353557ddfc96325a8ab18E6f6d9c1fC0d7C1eA6"
export default function PageHome() {
  const { toast } = useToast()
  const { address, isConnected, signIn } = useWalletAuth()
  const { gameTopics, shuffleTopics } = useCommonTriviaTopics()

  const { sendTransaction } = useSendTransaction()
  const [showGame, setShowGame] = useState(null as { topic?: string } | null)

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

  function handleGameWon(wonJUZ: number) {
    if (address) incrPlayerJUZEarned(address, wonJUZ)
    toast.success({
      title: `You won ${wonJUZ} JUZ!`,
    })
  }

  return (
    <main className="flex bg-gradient-to-br from-juz-orange/0 via-juz-orange/0 to-juz-orange/7 px-4 pt-6 min-h-full flex-col gap-2">
      <ModalGame
        topic={showGame?.topic}
        open={Boolean(showGame?.topic)}
        onGameWon={handleGameWon}
        onOpenChange={() => setShowGame(null)}
      />

      <div className="size-full rounded-full mt-12 overflow-clip grid place-items-center">
        <WheelSpin
          enableSpin={isConnected}
          onClick={() => {
            if (!isConnected) {
              // Prompt login when not connected
              return signIn()
            }
          }}
          onItemSelected={(topic) => {
            setShowGame({ topic })
            setTimeout(shuffleTopics, 250)
          }}
          items={gameTopics}
          size="min(calc(95vw - 2rem), 24rem)"
        />
      </div>
      <div className="my-3" />
    </main>
  )
}
