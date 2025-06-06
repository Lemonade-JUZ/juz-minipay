"use server"

import { formatEther, type Address } from "viem"
import { Redis } from "@upstash/redis"
import { getClaimedJUZ } from "@/lib/juz"

const redis = Redis.fromEnv()

const getPlayedGameKey = (address: Address) => `juz.games.played.${address}`
const getWonGamesKey = (address: Address) => `juz.games.won.${address}`
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

export const incrementGamesPlayed = async (address: Address) => {
  await redis.incr(getPlayedGameKey(address))
}

export const incrementGamesWon = async (address: Address) => {
  await redis.incr(getWonGamesKey(address))
}

export const incrPlayerJUZEarned = async (address: Address, amount: number) => {
  await redis.incrbyfloat(getJUZEarnedKey(address), amount)
}

export const getPlayerGameData = async (address: Address) => {
  const [gamesPlayed = 0, gamesWon = 0] = await Promise.all([
    redis.get(getPlayedGameKey(address)),
    redis.get(getWonGamesKey(address)),
  ])

  return {
    played: Number(gamesPlayed),
    won: Number(gamesWon),
  }
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
