import { cn } from "@/lib/utils"
import { FaHeart, FaHeartBroken } from "react-icons/fa"

/**
 * A reusable component to visualize hearts in a game-like manner.
 * I made it look like the Zelda hearts blink when they are active.
 * 💚💚[💚]
 */
export default function HeartsVisualizer({
  hearts,
  className,
}: {
  hearts: number
  className?: string
}) {
  return (
    <div className={cn("flex text-xl items-center gap-1", className)}>
      {Array.from({ length: 3 }).map((_, index) => {
        const isActive = index < hearts
        const isLastItemIndex = index === 2
        const isAnimatedHeart =
          index === hearts - 1 || (isLastItemIndex && hearts > 3)

        return isActive ? (
          <FaHeart
            key={`h.active.${index}`}
            className={cn(
              isAnimatedHeart && "animate-zelda-pulse",
              "text-juz-green drop-shadow"
            )}
          />
        ) : (
          <FaHeartBroken
            key={`h.inactive.${index}`}
            className="text-black/35"
          />
        )
      })}
    </div>
  )
}
