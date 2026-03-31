import type { Metadata } from "next"
import "./globals.css"

export const metadata: Metadata = {
  title: "Mini Game Hub - 免费小游戏平台",
  description: "发现并玩转海量精品网页游戏，动作、益智、射击、策略、休闲等分类应有尽有",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-CN" className="dark">
      <body className="min-h-screen bg-background antialiased flex flex-col">
        {children}
      </body>
    </html>
  )
}
