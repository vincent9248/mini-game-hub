"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Gamepad2, Mail, Lock, Loader2, Shield } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function AdminLoginPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    const formData = new FormData(e.currentTarget)
    const email = formData.get("email") as string
    const password = formData.get("password") as string

    try {
      const res = await fetch("/api/admin/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || "登录失败")
      } else {
        router.push("/admin/dashboard")
        router.refresh()
      }
    } catch {
      setError("登录失败，请稍后重试")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-neon-purple/10 via-background to-neon-cyan/10 p-4">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-neon-purple/5 rounded-full blur-[120px]" />
      
      <Card className="w-full max-w-md relative z-10">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="rounded-lg bg-gradient-to-br from-neon-purple to-neon-cyan p-2">
              <Gamepad2 className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold neon-text">Mini Game Hub</span>
          </div>
          <div className="flex items-center justify-center gap-2 mb-2">
            <Shield className="h-5 w-5 text-neon-purple" />
            <CardTitle className="text-2xl">管理员登录</CardTitle>
          </div>
          <CardDescription>请使用管理员账户登录后台系统</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 rounded-lg bg-destructive/10 text-destructive text-sm text-center">
                {error}
              </div>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="email">管理员邮箱</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="admin@example.com"
                  className="pl-10"
                  required
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">密码</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="••••••••"
                  className="pl-10"
                  required
                />
              </div>
            </div>

            <Button type="submit" className="w-full bg-gradient-to-r from-neon-purple to-neon-cyan" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  登录中...
                </>
              ) : (
                "登录管理后台"
              )}
            </Button>
          </form>

          <div className="mt-6 text-center text-sm text-muted-foreground">
            <Link href="/auth/login" className="text-primary hover:underline">
              返回用户登录
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
