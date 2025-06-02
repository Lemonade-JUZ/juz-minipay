"use client"

import { injected, useAccount, useConnect } from "wagmi"
import { useIsMiniPay } from "./minipay"
import { useEffect } from "react"

export const useWalletAuth = () => {
  const { isMiniPay } = useIsMiniPay()
  const { address, isConnected } = useAccount()
  const { connect } = useConnect()

  useEffect(() => {
    if (isMiniPay && !address) {
      // Connect to MiniPay wallet if not connected

      connect({ connector: injected() })
    }
  }, [isMiniPay, address])

  return {
    isMiniPay,
    address,
    isConnected,
  }
}
