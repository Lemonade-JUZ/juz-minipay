"use server"

import { formatEther, type Address } from "viem"
import { Redis } from "@upstash/redis"
import { getClaimedJUZ } from "@/lib/juz"

const redis = Redis.fromEnv()

const getJUZEarnedKey = (address: Address) => `juz.earned.${address}`

const normalizeJUZEarned = ({
  erc20Claimed,
  gamePoints,
}: {
  erc20Claimed: number
  gamePoints: number
}) => {
  // We subtract the JUZ tokens from points earned
  return Math.max(0, gamePoints > erc20Claimed ? gamePoints - erc20Claimed : 0)
}

export const incrPlayerJUZEarned = async (address: Address, amount: number) => {
  await redis.incrbyfloat(getJUZEarnedKey(address), amount)
}

export const getPlayerPoints = (address: Address) => {
  return redis.get<number>(getJUZEarnedKey(address))
}

export const getPlayerJUZEarned = async (address: Address) => {
  const [claimedJUZ, gamePoints] = await Promise.all([
    getClaimedJUZ(address),
    getPlayerPoints(address),
  ])

  return normalizeJUZEarned({
    erc20Claimed: Number(formatEther(claimedJUZ)),
    gamePoints: gamePoints || 0,
  })
}
