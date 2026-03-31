import Link from "next/link"
import { redirect } from "next/navigation"
import { LayoutDashboard, Gamepad2, FolderTree, Users, LogOut, Menu, X, Bell } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { getAdminSession } from "@/lib/admin-auth"
import { AdminLogoutButton } from "./admin-logout-button"

const adminNav = [
  { href: "/admin/dashboard", label: "仪表盘", icon: LayoutDashboard },
  { href: "/admin/games", label: "游戏管理", icon: Gamepad2 },
  { href: "/admin/categories", label: "分类管理", icon: FolderTree },
  { href: "/admin/users", label: "用户管理", icon: Users },
]

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // 使用独立的管理员认证系统
  const admin = await getAdminSession()

  if (!admin) {
    redirect("/admin/login")
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 z-40 h-screen w-64 border-r bg-card">
        <div className="flex h-full flex-col">
          {/* Logo */}
          <div className="flex h-16 items-center border-b px-6">
            <Link href="/" className="flex items-center gap-2">
              <div className="rounded-lg bg-gradient-to-br from-neon-purple to-neon-cyan p-2">
                <Gamepad2 className="h-5 w-5 text-white" />
              </div>
              <span className="font-bold">管理后台</span>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-1 p-4">
            {adminNav.map((item) => (
              <Link key={item.href} href={item.href}>
                <Button
                  variant="ghost"
                  className="w-full justify-start gap-3"
                >
                  <item.icon className="h-5 w-5" />
                  {item.label}
                </Button>
              </Link>
            ))}
          </nav>

          {/* Admin User */}
          <div className="border-t p-4">
            <div className="flex items-center gap-3 mb-4">
              <Avatar className="h-10 w-10">
                <AvatarImage src={admin.avatar || undefined} />
                <AvatarFallback className="bg-gradient-to-br from-neon-purple to-neon-cyan">
                  {admin.name?.[0] || admin.email[0]}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{admin.name || "管理员"}</p>
                <p className="text-xs text-muted-foreground truncate">{admin.email}</p>
              </div>
            </div>
            <div className="space-y-1">
              <Link href="/">
                <Button variant="ghost" className="w-full justify-start">
                  返回首页
                </Button>
              </Link>
              <AdminLogoutButton />
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="pl-64">
        {/* Header */}
        <header className="sticky top-0 z-30 h-16 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="flex h-full items-center justify-between px-6">
            <div className="text-lg font-medium">Mini Game Hub 管理后台</div>
            <div className="flex items-center gap-4">
              <Button variant="outline" size="icon">
                <Bell className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="p-6">{children}</main>
      </div>
    </div>
  )
}
