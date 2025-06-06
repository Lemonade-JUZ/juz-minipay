"use client"

import copy from "clipboard-copy"
import { useToast } from "@worldcoin/mini-apps-ui-kit-react"
import { useAccountGameData, useProfileImage } from "@/hooks/user"
import { useWalletAuth } from "@/hooks/wallet"
import { beautifyAddress } from "@/lib/utils"

import { FiCopy } from "react-icons/fi"

import ReusableDialog from "@/components/ReusableDialog"

export default function DialogProfileTrigger() {
  const { image } = useProfileImage()
  const { toast } = useToast()
  const { address, isConnected, signIn } = useWalletAuth()

  function handleCopyAddress() {
    if (address) {
      copy(address)
      return toast.success({
        title: "Address copied to clipboard",
      })
    }
  }

  const { played, won } = useAccountGameData()

  return (
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
          className="size-16 shrink-0 bg-cover rounded-2xl border-3 border-black shadow-3d"
        />

        <div className="px-3">
          <button
            onClick={handleCopyAddress}
            className="text-sm mb-1 font-medium group flex items-center gap-2 text-black"
          >
            {beautifyAddress(address || "", 7, "..")}
            <FiCopy className="group-active:scale-110" />
          </button>
          <div className="text-xs">{played} Games played</div>
          <div className="text-xs">{won} Games won</div>
        </div>
      </nav>
    </ReusableDialog>
  )
}
