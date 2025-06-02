import { useToast } from "@worldcoin/mini-apps-ui-kit-react"
import { atomWithStorage } from "jotai/utils"
import { useAtom } from "jotai"
import { useWalletAuth } from "./wallet"

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
