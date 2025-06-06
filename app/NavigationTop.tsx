"use client"

import { useAccountBalances } from "@/hooks/balances"
import { shortifyDecimals } from "@/lib/numbers"

import { FaRegLemon } from "react-icons/fa"

import JUZDistributionModal from "@/components/JUZDistributionModal"
import FixedTopContainer from "@/components/FixedTopContainer"
import LemonIcon from "@/components/LemonIcon"

import DialogProfileTrigger from "./DialogProfileTrigger"

export default function NavigationTop() {
  return (
    <FixedTopContainer className="border-b shrink-0 px-5 flex items-center gap-4">
      <DialogProfileTrigger />
      <div className="flex-grow" />
      <JUZDistributionModal trigger={<JUZCounter />} />
    </FixedTopContainer>
  )
}

export function JUZCounter({ ...props }) {
  const { TotalJUZBalance, JUZPoints } = useAccountBalances()

  return (
    <button {...props} className="flex whitespace-nowrap items-center gap-2">
      <LemonIcon className="size-9 relative">
        {JUZPoints.isOnchainSynced ? null : (
          <figure className="absolute -bottom-1 -right-1 size-3.5 bg-juz-green-lime border-2 border-black rounded-full" />
        )}
        <FaRegLemon className="text-xl" />
      </LemonIcon>
      <span className="text-xl font-semibold">
        {shortifyDecimals(TotalJUZBalance.formatted, 2)} JUZ
      </span>
    </button>
  )
}
