"use client"

import { useToast } from "@worldcoin/mini-apps-ui-kit-react"
import { formatEther } from "viem"

import { shortifyDecimals } from "@/lib/numbers"
import { getDispenserPayload } from "@/actions/dispenser"
import { useWalletAuth } from "@/hooks/wallet"
import { useAccountBalances } from "@/hooks/balances"
import { useSendTransaction } from "@/hooks/divvi"

import ReusableDialog from "@/components/ReusableDialog"

import { ABI_DISPENSER } from "@/lib/abis"
import { ADDRESS_DISPENSER } from "@/lib/constants"

export default function JUZDistributionModal({
  trigger,
}: {
  trigger: JSX.Element
}) {
  const { toast } = useToast()
  const { address, signIn } = useWalletAuth()
  const { JUZToken, JUZPoints } = useAccountBalances()
  const { sendTransaction } = useSendTransaction()

  const showClaimOnchain = !JUZPoints.isOnchainSynced

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
        title: `Yaay ${shortifyDecimals(formatEther(amount))} JUZ claimed!`,
      })
    } catch (error) {
      console.error({ error })
      toast.error({
        title: "Oops! Something went wrong.",
      })
    }
  }

  // TODO: Add a timer when user claims JUZ Tokens for balances to refresh
  return (
    <ReusableDialog
      title="JUZ Distribution"
      onClosePressed={() => {
        if (showClaimOnchain) return handleClaimJUZToken()
      }}
      footNote={
        showClaimOnchain
          ? "You have points claimable as ERC20 Tokens"
          : undefined
      }
      closeText={showClaimOnchain ? "Claim Tokens" : "Got it"}
      trigger={trigger}
    >
      <p>
        <nav className="flex justify-between gap-6 w-full">
          <div className="w-32">
            <strong className="text-juz-green text-lg">JUZ Points</strong>
            <p className="text-xs opacity-75">
              Points earned from the trivia game
            </p>
          </div>
          <span className="text-xl mt-1 font-medium">
            {shortifyDecimals(formatEther(JUZPoints.balance), 5)}
          </span>
        </nav>
      </p>

      <p className="-mb-2">
        <nav className="flex justify-between gap-6 w-full">
          <div className="w-32">
            <strong className="text-juz-orange whitespace-nowrap text-lg">
              JUZ Tokens
            </strong>
            <p className="text-xs opacity-75">
              Your JUZ balance in ERC20 tokens
            </p>
          </div>
          <span className="text-xl mt-1 font-medium">
            {shortifyDecimals(formatEther(JUZToken.balance), 5)}
          </span>
        </nav>
      </p>
    </ReusableDialog>
  )
}
