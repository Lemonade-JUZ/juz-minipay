import "@worldcoin/mini-apps-ui-kit-react/styles.css"
import "./globals.css"

import type { Metadata, Viewport } from "next"
import dynamic from "next/dynamic"
import { Rubik, Sora } from "next/font/google"

import { Toaster as WorldToaster } from "@worldcoin/mini-apps-ui-kit-react"
import Web3Provider from "./Web3Provider"
import MainLayout from "./MainLayout"

const fontRubik = Rubik({
  subsets: [],
  variable: "--font-sans",
  weight: ["400", "500", "600", "700"],
})

const fontSora = Sora({
  subsets: [],
  variable: "--font-display",
  weight: ["500", "600", "700"],
})

export const metadata: Metadata = {
  title: "JUZ App",
  description: "Learn, share, create and earn with JUZ",
}

export const viewport: Viewport = {
  viewportFit: "cover",
  width: "device-width",
  initialScale: 1,
}

const ErudaProvider = dynamic(
  () => import("../components/Eruda").then((r) => r.ErudaProvider),
  {
    ssr: false,
  }
)

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body
        className={`${fontRubik.variable} ${fontSora.variable} ${fontRubik.className} antialiased`}
      >
        <WorldToaster duration={2_500} />
        <Web3Provider>
          <ErudaProvider>
            <MainLayout>{children}</MainLayout>
          </ErudaProvider>
        </Web3Provider>
      </body>
    </html>
  )
}
