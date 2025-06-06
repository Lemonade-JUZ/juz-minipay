import { useEffect, useRef } from "react"
import { noOp } from "../lib/utils"

const ASSETS = {
  success: "/audio/success.mp3",
  failure: "/audio/error.mp3",
  wheelSpin: "/audio/spin.mp3",
  bell: "/audio/bell.mp3",
}

type AudioAssets = keyof typeof ASSETS
type ZeroToOneString = "0" | `0.${number}` | "1"
export const useAudioMachine = <T extends AudioAssets>(assets: Array<T>) => {
  const audioAssets = useRef(null as Record<T, HTMLAudioElement> | null)

  useEffect(() => {
    audioAssets.current = Object.fromEntries(
      assets.map((key) => {
        console.debug(`Loading audio asset: ${key}`)
        const audio = new Audio(ASSETS[key])
        audio.load() // Preload audio
        return [key, audio]
      })
    ) as any
  }, assets)

  const playSound = (type: T, volumeLevel: ZeroToOneString = "1") => {
    if (!audioAssets.current?.[type]) {
      return console.error(`Audio asset ${type} not found`)
    }

    audioAssets.current[type].volume = Number(volumeLevel) // Set volume
    audioAssets.current[type].currentTime = 0 // Reset to start
    audioAssets.current[type].play().catch(noOp)
  }

  return {
    playSound,
  }
}
