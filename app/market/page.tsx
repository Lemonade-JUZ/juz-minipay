"use client"

import { useWalletAuth } from "@/hooks/wallet"
import { Button, useToast } from "@worldcoin/mini-apps-ui-kit-react"

export default function PageMarket() {
  const { toast } = useToast()
  const { address, isMiniPay } = useWalletAuth()

  return (
    <main className="px-4 pt-6 min-h-full">
      <h2 className="font-title text-xl">Market</h2>

      <div className="my-3" />
    </main>
  )
}
