"use client"

export const isMiniPay = () => {
  if (typeof window === "undefined") return false
  return Boolean((window as any)?.ethereum?.isMiniPay)
}

export const useIsMiniPay = () => ({ isMiniPay: isMiniPay() })
