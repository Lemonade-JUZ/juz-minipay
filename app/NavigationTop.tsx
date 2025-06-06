"use client"

import { useProfileImage } from "@/hooks/user"
import { useAccountBalances } from "@/hooks/balances"
import { useWalletAuth } from "@/hooks/wallet"

import { shortifyDecimals } from "@/lib/numbers"
import { beautifyAddress } from "@/lib/utils"

import { FiCopy } from "react-icons/fi"
import { FaRegLemon } from "react-icons/fa"

import LemonIcon from "@/components/LemonIcon"
import FixedTopContainer from "@/components/FixedTopContainer"
import ReusableDialog from "@/components/ReusableDialog"

export default function NavigationTop() {
  const { image } = useProfileImage()
  const { address, isConnected, signIn } = useWalletAuth()

  return (
    <FixedTopContainer className="border-b shrink-0 px-5 flex items-center gap-4">
      <ReusableDialog
        enabled={isConnected}
        title="Your Profile"
        trigger={
          <button
            onClick={isConnected ? undefined : signIn}
            className="flex outline-none text-left items-center gap-2"
          >
            <figure
              style={{
                backgroundImage: `url(${image})`,
              }}
              className="size-10 bg-cover bg-center bg-black/3 border-2 shadow-3d-bottom border-black rounded-full overflow-hidden"
            />
            <div className="whitespace-nowrap">
              <p className="font-semibold text-lg">
                {address ? beautifyAddress(address, 4, "") : "Limoncito"}
              </p>
              <p className="text-xs -mt-1">
                {isConnected ? "View profile" : "Connect wallet"}
              </p>
            </div>
          </button>
        }
      >
        <nav className="flex items-center gap-2">
          <div
            style={{
              backgroundImage: `url(${image})`,
            }}
            className="size-14 shrink-0 bg-cover rounded-2xl border-3 border-black shadow-3d"
          />
          <div className="px-4">
            <button className="text-sm mb-1 font-medium group flex items-center gap-2 text-black">
              {beautifyAddress(address || "", 7, "..")}
              <FiCopy className="group-active:scale-110" />
            </button>
            <div className="text-xs">4 Games played</div>
            <div className="text-xs">2 Games won</div>
          </div>
        </nav>
      </ReusableDialog>
      <div className="flex-grow" />
      <JUZCounter />
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
