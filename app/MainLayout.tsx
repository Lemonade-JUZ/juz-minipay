"use client"

import type { PropsWithChildren } from "react"
import NavigationTop from "./NavigationTop"
import NavigationBottom from "./NavigationBottom"

export default function MainLayout({ children }: PropsWithChildren) {
  return (
    <div className="h-screen overflow-hidden flex flex-col bg-white w-full max-w-2xl mx-auto">
      <NavigationTop />
      <div className="[&_main]:overflow-auto h-full [&_main]:pb-[4.5rem] [&_main]:max-h-[calc(100dvh-var(--safe-pb))]">
        {children}
      </div>
      <NavigationBottom />
    </div>
  )
}
