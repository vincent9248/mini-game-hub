"use client"

import { useState, useEffect } from "react"
import { Search, MoreHorizontal, Ban, CheckCircle, User, Shield, Loader2, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

interface User {
  id: string
  name: string
  email: string
  avatar: string | null
  role: "USER" | "ADMIN"
  isActive: boolean
  gameCount: number
  commentCount: number
  createdAt: string
}

interface UserStats {
  total: number
  active: number
  banned: number
  admins: number
}

// Toast 提示
function showToast(message: string, type: "success" | "error" = "success") {
  const container = document.createElement("div")
  container.className = `fixed bottom-4 right-4 z-[100] flex items-center gap-2 px-4 py-3 rounded-lg shadow-lg animate-in slide-in-from-right-full border ${
    type === "success" ? "border-green-500/50 bg-green-500/10 text-green-600" : "border-red-500/50 bg-red-500/10 text-red-600"
  }`
  container.innerHTML = `<span class="text-sm">${message}</span>`
  document.body.appendChild(container)
  setTimeout(() => container.remove(), 3000)
}

export default function UsersManagementPage() {
  const [search, setSearch] = useState("")
  const [filter, setFilter] = useState("all")
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [users, setUsers] = useState<User[]>([])
  const [stats, setStats] = useState<UserStats>({ total: 0, active: 0, banned: 0, admins: 0 })
  const [deleteUser, setDeleteUser] = useState<User | null>(null)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)

  // 加载数据
  useEffect(() => {
    loadUsers()
  }, [search, filter])

  async function loadUsers() {
    try {
      const params = new URLSearchParams()
      if (search) params.append("search", search)
      if (filter !== "all") {
        if (filter === "active") params.append("status", "active")
        else if (filter === "banned") params.append("status", "banned")
        else if (filter === "admin") params.append("role", "admin")
      }

      const res = await fetch(`/api/users?${params.toString()}`)
      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || "加载失败")
      }

      setUsers(data.users)
      setStats(data.stats)
    } catch (error) {
      console.error("加载用户失败:", error)
      showToast("加载用户失败", "error")
    } finally {
      setIsLoading(false)
    }
  }

  // 切换用户状态
  const handleToggleActive = async (user: User) => {
    try {
      const res = await fetch(`/api/users/${user.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "toggleActive" }),
      })
      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || "操作失败")
      }

      showToast(user.isActive ? "用户已禁用" : "用户已启用")
      loadUsers()
    } catch (error) {
      console.error("操作失败:", error)
      showToast(error instanceof Error ? error.message : "操作失败", "error")
    }
  }

  // 删除用户
  const handleDelete = async () => {
    if (!deleteUser) return

    setIsSubmitting(true)
    try {
      const res = await fetch(`/api/users/${deleteUser.id}`, {
        method: "DELETE",
      })
      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || "删除失败")
      }

      showToast("用户已删除")
      setIsDeleteDialogOpen(false)
      setDeleteUser(null)
      loadUsers()
    } catch (error) {
      console.error("删除失败:", error)
      showToast(error instanceof Error ? error.message : "删除失败", "error")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">用户管理</h1>
        <p className="text-muted-foreground">管理平台用户，包括查看、禁用和启用用户账户。</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold">{stats.total}</div>
            <div className="text-sm text-muted-foreground">总用户数</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-500">{stats.active}</div>
            <div className="text-sm text-muted-foreground">活跃用户</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-red-500">{stats.banned}</div>
            <div className="text-sm text-muted-foreground">已禁用</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-neon-purple">{stats.admins}</div>
            <div className="text-sm text-muted-foreground">管理员</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="搜索用户名称或邮箱..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>
            <Tabs value={filter} onValueChange={setFilter}>
              <TabsList>
                <TabsTrigger value="all">全部</TabsTrigger>
                <TabsTrigger value="active">活跃</TabsTrigger>
                <TabsTrigger value="banned">已禁用</TabsTrigger>
                <TabsTrigger value="admin">管理员</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card>
        <CardHeader>
          <CardTitle>用户列表 ({users.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {users.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              暂无用户数据
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[300px]">用户</TableHead>
                  <TableHead>角色</TableHead>
                  <TableHead>收藏游戏</TableHead>
                  <TableHead>评论数</TableHead>
                  <TableHead>状态</TableHead>
                  <TableHead>注册时间</TableHead>
                  <TableHead className="text-right">操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={user.avatar || undefined} />
                          <AvatarFallback className="bg-gradient-to-br from-neon-purple to-neon-cyan">
                            {user.name?.[0] || "U"}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{user.name}</div>
                          <div className="text-xs text-muted-foreground">{user.email}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={user.role === "ADMIN" ? "neon" : "outline"}>
                        {user.role === "ADMIN" ? (
                          <><Shield className="h-3 w-3 mr-1" /> 管理员</>
                        ) : (
                          <><User className="h-3 w-3 mr-1" /> 用户</>
                        )}
                      </Badge>
                    </TableCell>
                    <TableCell>{user.gameCount}</TableCell>
                    <TableCell>{user.commentCount}</TableCell>
                    <TableCell>
                      {user.isActive ? (
                        <Badge variant="default" className="bg-green-500">正常</Badge>
                      ) : (
                        <Badge variant="destructive">已禁用</Badge>
                      )}
                    </TableCell>
                    <TableCell>{user.createdAt}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleToggleActive(user)}>
                            {user.isActive ? (
                              <><Ban className="h-4 w-4 mr-2" /> 禁用用户</>
                            ) : (
                              <><CheckCircle className="h-4 w-4 mr-2" /> 启用用户</>
                            )}
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem 
                            className="text-destructive focus:text-destructive"
                            onClick={() => { setDeleteUser(user); setIsDeleteDialogOpen(true) }}
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            删除用户
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* 删除确认对话框 */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>确认删除</AlertDialogTitle>
            <AlertDialogDescription>
              确定要删除用户「{deleteUser?.name}」吗？此操作无法撤销，用户的评论和收藏记录也将被删除。
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isSubmitting}>取消</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isSubmitting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isSubmitting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              确认删除
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
