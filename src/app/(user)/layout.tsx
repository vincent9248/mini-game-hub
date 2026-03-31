import Link from "next/link"
import { Gamepad2, Search, Bell, Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { auth } from "@/lib/auth"
import { UserLogoutButton } from "@/components/user-logout-button"

export default async function UserLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-2">
              <div className="rounded-lg bg-gradient-to-br from-neon-purple to-neon-cyan p-2">
                <Gamepad2 className="h-5 w-5 text-white" />
              </div>
              <span className="text-lg font-bold hidden sm:block">Mini Game Hub</span>
            </Link>

            <nav className="hidden md:flex items-center gap-6">
              <Link href="/games" className="text-sm font-medium hover:text-primary transition-colors">
                全部游戏
              </Link>
              <Link href="/games?category=hot" className="text-sm font-medium hover:text-primary transition-colors">
                热门
              </Link>
              <Link href="/games?category=new" className="text-sm font-medium hover:text-primary transition-colors">
                最新
              </Link>
            </nav>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative hidden sm:flex">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder="搜索游戏..."
                className="h-9 w-48 lg:w-64 rounded-lg border bg-background pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            {session ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-9 w-9 rounded-full">
                    <Avatar className="h-9 w-9">
                      <AvatarImage src={(session.user as any)?.avatar || undefined} />
                      <AvatarFallback className="bg-gradient-to-br from-neon-purple to-neon-cyan">
                        {(session.user as any)?.name?.[0] || (session.user as any)?.email?.[0] || "?"}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium">{(session.user as any)?.name || "用户"}</p>
                      <p className="text-xs text-muted-foreground">{(session.user as any)?.email}</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/profile">个人中心</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/profile/favorites">我的收藏</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/profile/comments">我的评论</Link>
                  </DropdownMenuItem>
                  {(session.user as any)?.role === "ADMIN" && (
                    <>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild>
                        <Link href="/admin">管理后台</Link>
                      </DropdownMenuItem>
                    </>
                  )}
                  <DropdownMenuSeparator />
                  <UserLogoutButton />
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center gap-2">
                <Link href="/auth/login">
                  <Button variant="ghost" size="sm">登录</Button>
                </Link>
                <Link href="/auth/register">
                  <Button size="sm" className="bg-gradient-to-r from-neon-purple to-neon-cyan">注册</Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">{children}</main>

      {/* Footer */}
      <footer className="border-t py-8 bg-background">
        <div className="container">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="rounded-lg bg-gradient-to-br from-neon-purple to-neon-cyan p-1.5">
                <Gamepad2 className="h-4 w-4 text-white" />
              </div>
              <span className="text-sm font-medium">Mini Game Hub</span>
            </div>
            <div className="text-sm text-muted-foreground">
              © 2026 Mini Game Hub. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
