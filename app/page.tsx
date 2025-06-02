"use client"

import { useWalletAuth } from "@/hooks/wallet"
import { beautifyAddress } from "@/lib/utils"
import { Button, useToast } from "@worldcoin/mini-apps-ui-kit-react"

export default function Home() {
  const { toast } = useToast()
  const { address, isMiniPay } = useWalletAuth()

  return (
    <main className="flex p-4 h-full flex-col gap-2">
      <h2 className="font-title text-2xl">Welcome to JUZ</h2>
      <div className="flex-grow" />

      <Button
        onClick={() =>
          toast.success({
            title: "Yay!",
          })
        }
        variant="secondary"
      >
        Show success message
      </Button>

      <Button>
        {address
          ? beautifyAddress(address)
          : isMiniPay
          ? "Connecting..."
          : "Connect Wallet"}
      </Button>
    </main>
  )
}
