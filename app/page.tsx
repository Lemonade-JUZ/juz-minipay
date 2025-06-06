"use client"

import { useState } from "react"
import { useToast } from "@worldcoin/mini-apps-ui-kit-react"

import {
  incrementGamesPlayed,
  incrementGamesWon,
  incrPlayerJUZEarned,
} from "@/actions/game"

import { FaHeart, FaHeartBroken } from "react-icons/fa"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@radix-ui/react-tabs"

import { useWalletAuth } from "@/hooks/wallet"
import { useCommonTriviaTopics } from "@/hooks/topics"

import WheelSpin from "@/components/WheelSpin"
import ModalGame from "./ModalGame"
import { usePlayerHearts } from "@/hooks/game"
import ReusableDialog from "@/components/ReusableDialog"

export default function PageHome() {
  const { toast } = useToast()
  const { address, isConnected, signIn } = useWalletAuth()
  const { gameTopics, shuffleTopics } = useCommonTriviaTopics()

  const [showGame, setShowGame] = useState(null as { topic?: string } | null)
  const { hearts } = usePlayerHearts()

  function handleGameWon(wonJUZ: number) {
    if (address) {
      incrementGamesWon(address)
      incrPlayerJUZEarned(address, wonJUZ)
    }

    toast.success({
      title: `You won ${wonJUZ} JUZ!`,
    })
  }

  return (
    <Tabs asChild defaultValue="play">
      <main className="bg-gradient-to-br min-h-screen from-juz-orange/0 via-juz-orange/0 to-juz-orange/7">
        <ModalGame
          topic={showGame?.topic}
          open={Boolean(showGame?.topic)}
          onGameWon={handleGameWon}
          onOpenChange={() => setShowGame(null)}
        />

        <nav className="px-5">
          <TabsList className="border-b flex items-center border-b-black/3">
            <TabsTrigger
              id="play-tab"
              className="border-b-2 px-6 py-3 border-transparent data-[state=active]:border-black font-semibold"
              value="play"
            >
              Play
            </TabsTrigger>

            <TabsTrigger
              className="border-b-2 px-6 py-3 border-transparent data-[state=active]:border-black font-semibold"
              value="leaderboard"
            >
              Leaderboard
            </TabsTrigger>

            <div className="flex-grow" />

            <ReusableDialog
              title="Game points"
              trigger={
                <button className="flex text-xl items-center gap-1">
                  {hearts > 0 ? (
                    <FaHeart className="text-juz-green animate-zelda-pulse" />
                  ) : (
                    <FaHeartBroken />
                  )}
                  <strong className="font-semibold text-lg">x{hearts}</strong>
                </button>
              }
            >
              <p>
                Anytime you fail a question in the trivia, you lose a heart. In
                the future you can refill hearts or buy them in the Market.
              </p>
            </ReusableDialog>
          </TabsList>
        </nav>

        <TabsContent asChild value="play">
          <div className="px-4 mb-12">
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

                  if (address) incrementGamesPlayed(address)
                }}
                items={gameTopics}
                size="min(calc(95vw - 2rem), 24rem)"
              />
            </div>
          </div>
        </TabsContent>

        <TabsContent asChild value="leaderboard">
          <div className="px-4 mb-12">
            <p className="mt-8 max-w-xs text-center mx-auto">
              Leaderboard content will be available soon! Stay tuned for
              updates.
            </p>
          </div>
        </TabsContent>

        <div className="my-3" />
      </main>
    </Tabs>
  )
}
