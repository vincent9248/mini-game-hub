"use client"

import { useRouter } from "next/navigation"
import { LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"

export function AdminLogoutButton() {
  const router = useRouter()

  async function handleLogout() {
    try {
      await fetch("/api/admin/auth/logout", { method: "POST" })
      router.push("/admin/login")
      router.refresh()
    } catch (error) {
      console.error("Logout error:", error)
    }
  }

  return (
    <Button
      variant="ghost"
      className="w-full justify-start text-destructive hover:text-destructive"
      onClick={handleLogout}
    >
      <LogOut className="h-4 w-4 mr-2" />
      退出登录
    </Button>
  )
}
