"use client"

import type { PropsWithChildren } from "react"

export default function MainLayout({ children }: PropsWithChildren) {
  return (
    <div className="h-dvh overflow-hidden flex flex-col bg-white w-full max-w-2xl mx-auto">
      <div className="[&_main]:overflow-auto h-full [&_main]:pb-[1.5rem] [&_main]:max-h-[calc(100dvh-var(--safe-pb))]">
        {children}
      </div>
      {/**
       *  <BottomNavigation />
       */}
    </div>
  )
}
