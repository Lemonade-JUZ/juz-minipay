"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Fragment } from "react"

import { IoGameController, IoStorefront } from "react-icons/io5"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MdSwapCalls } from "react-icons/md"
import { GiQueenCrown } from "react-icons/gi"

const PLAY_ROUTE = {
  href: "/",
  value: "play",
  label: "Play",
} as const

export default function NavigationBottom() {
  const pathname = usePathname()

  const ROUTES = {
    play: PLAY_ROUTE,

    gamejam: {
      href: "/gamejam",
      value: "gamejam",
      label: "Gamejam",
    },

    market: {
      href: "/market",
      value: "market",
      label: "Market",
    },
  } as const

  const activePathValue =
    Object.values(ROUTES).find((route) => {
      return pathname === route.href
    })?.value || PLAY_ROUTE.value

  return (
    <Tabs value={activePathValue} asChild>
      <Fragment>
        <TabsList asChild>
          <nav className="border-t shrink-0 [&_a]:shrink-0 z-2 fixed left-0 right-0 bottom-[--safe-pb] !bg-white rounded-none h-auto grid grid-cols-3">
            <NavItem
              route={ROUTES.play}
              icon={<IoGameController className="text-2xl" />}
            />

            <TabsTrigger
              asChild
              className="grid place-items-center group text-black/70 data-[state=active]:text-black"
              value={ROUTES.gamejam.value}
            >
              <Link href={ROUTES.gamejam.href}>
                <div className="size-12 group-active:scale-105 rounded-full border-2 border-transparent bg-black/10 group-data-[state=active]:border-black group-data-[state=active]:bg-juz-green-lime grid place-items-center">
                  <GiQueenCrown className="text-2xl scale-105" />
                </div>
              </Link>
            </TabsTrigger>

            <NavItem
              route={ROUTES.market}
              icon={<IoStorefront className="text-xl" />}
            />
          </nav>
        </TabsList>
      </Fragment>
    </Tabs>
  )
}

function NavItem({
  icon,
  route,
  onClick,
}: {
  icon: React.ReactNode
  onClick?: () => void
  route: {
    href: string
    value: string
    label: string
  }
}) {
  return (
    <TabsTrigger
      asChild
      onClick={onClick}
      className="grid place-items-center p-1 pt-2 h-14 rounded-none text-black/70 !bg-transparent data-[state=active]:text-juz-green"
      value={route.value}
    >
      <Link href={route.href}>
        <div className="size-5 grid place-items-center place-content-center">
          {icon}
        </div>
        <span className="text-xs">{route.label}</span>
      </Link>
    </TabsTrigger>
  )
}
