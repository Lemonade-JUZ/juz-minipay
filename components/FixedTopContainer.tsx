import { Fragment, type PropsWithChildren } from "react"
import { cn } from "@/lib/utils"

export default function FixedTopContainer({
  children,
  className,
}: PropsWithChildren<{
  className?: string
}>) {
  return (
    <Fragment>
      <div
        className={cn(
          `h-navigation bg-white top-0 fixed left-0 right-0 z-10`,
          className
        )}
      >
        {children}
      </div>
      <div className="pointer-events-none w-full shrink-0 h-navigation" />
    </Fragment>
  )
}
