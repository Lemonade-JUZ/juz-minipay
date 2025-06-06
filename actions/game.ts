"use server"

import type { Address } from "viem"
import { Redis } from "@upstash/redis"

const redis = Redis.fromEnv()

const getJUZEarnedKey = (address: Address) => `juz.earned.${address}`

export const incrPlayerJUZEarned = async (address: Address, amount: number) => {
  await redis.incrbyfloat(getJUZEarnedKey(address), amount)
}
