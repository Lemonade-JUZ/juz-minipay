"use client"

import { useAtom } from "jotai"
import { atomWithStorage } from "jotai/utils"
import { ONE_DAY_IN_MS } from "@/lib/constants"

const INITIAL_PLAYER_HEARTS = 3
const atomPlayerHearts = atomWithStorage(
  "juz.mini.totalPlayerHearts",
  INITIAL_PLAYER_HEARTS
)

const DEFAULT_REFILL_STATE = {
  zeroHeartsTimestamp: 0,
  isClaimed: false,
}

const atomHeartsRefill = atomWithStorage(
  "juz.heartsRefill",
  DEFAULT_REFILL_STATE
)

export const usePlayerHearts = () => {
  const [{ isClaimed, zeroHeartsTimestamp }, setHeartsRefill] =
    useAtom(atomHeartsRefill)
  const [hearts, setHearts] = useAtom(atomPlayerHearts)

  const removeHeart = () => setHearts((h) => Math.max(h - 1, 0))

  const refill = (opts?: { isForcedRefill?: boolean }) => {
    if (hearts < INITIAL_PLAYER_HEARTS) {
      setHearts(INITIAL_PLAYER_HEARTS)
    }

    // We omit setting claimed timestamp if "forced"
    if (!opts?.isForcedRefill) {
      setHeartsRefill({
        zeroHeartsTimestamp: Date.now(),
        isClaimed: false,
      })
    }
  }

  const nextRefillTime = zeroHeartsTimestamp
    ? zeroHeartsTimestamp + ONE_DAY_IN_MS
    : null

  return {
    refill,
    hearts,
    nextRefillTime,
    canBeRefilled: isClaimed
      ? false
      : nextRefillTime
      ? Date.now() > nextRefillTime && hearts < INITIAL_PLAYER_HEARTS
      : hearts < INITIAL_PLAYER_HEARTS,
    setHearts,
    removeHeart,
    isRefillClaimed: isClaimed,
    // Force null when invalid timestamp
    zeroHeartsTimestamp: zeroHeartsTimestamp || null,
  }
}

const atomIsGameActive = atomWithStorage(
  "juz.mini.isGameActive",
  null as boolean | null
)

export const useIsGameActive = () => useAtom(atomIsGameActive)
