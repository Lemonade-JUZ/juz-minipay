"use client"

import { useState } from "react"
import { useToast } from "@worldcoin/mini-apps-ui-kit-react"

import { incrPlayerJUZEarned } from "@/actions/game"

import { useWalletAuth } from "@/hooks/wallet"
import { useCommonTriviaTopics } from "@/hooks/topics"

import WheelSpin from "@/components/WheelSpin"
import ModalGame from "./ModalGame"

export default function PageHome() {
  const { toast } = useToast()
  const { address, isConnected, signIn } = useWalletAuth()
  const { gameTopics, shuffleTopics } = useCommonTriviaTopics()

  const [showGame, setShowGame] = useState(null as { topic?: string } | null)

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
