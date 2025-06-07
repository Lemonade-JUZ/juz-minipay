"use client"

import useSWR from "swr"
import { useToast } from "@worldcoin/mini-apps-ui-kit-react"
import { atomWithStorage } from "jotai/utils"
import { useAtom } from "jotai"
import { getPlayerGameData } from "@/actions/game"

import { useWalletAuth } from "./wallet"
import { useIsGameActive } from "./game"

const atomImage = atomWithStorage("juz.mini.imagePF", null as string | null)

export const useProfileImage = () => {
  const [localStorageImage, setLocalStorageImage] = useAtom(atomImage)
  const { isConnected, profilePictureUrl } = useWalletAuth()
  const { toast } = useToast()

  function setImage(image: File) {
    if (image.size > 2 * 1024 * 1024) {
      return toast.error({
        title: "Image too large",
      })
    }

    if (image.type.startsWith("image/")) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const result = e.target?.result as string
        if (result) setLocalStorageImage(result)
      }

      reader.readAsDataURL(image)
    }
  }

  const WORLD_IMAGES = profilePictureUrl || "/marble.png"

  return {
    setImage,
    // Do not show localStorage image if user is not connected
    image: isConnected ? localStorageImage || WORLD_IMAGES : WORLD_IMAGES,
  }
}

export const useAccountGameData = () => {
  const { address } = useWalletAuth()
  const [isGameActive] = useIsGameActive()

  const { data = {} } = useSWR(
    address ? `played.games.${isGameActive}.${address}` : null,
    async () => {
      if (!address) return {}
      return await getPlayerGameData(address)
    }
  )

  return {
    played: 0,
    won: 0,
    ...data,
  }
}
