"use client"

import { useState, useEffect } from "react"
import { Plus, Search, MoreHorizontal, Edit, Trash2, Eye, Star, ToggleLeft, ToggleRight, Upload, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
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

interface Category {
  id: string
  name: string
  slug: string
  icon: string | null
}

interface Game {
  id: string
  title: string
  slug: string
  description: string | null
  coverImage: string
  gameFile: string
  gameType: string
  categoryId: string | null
  playCount: number
  isHot: boolean
  isPublished: boolean
  category: { id: string; name: string } | null
  avgRating: number
}

// 格式化播放次数
function formatPlayCount(count: number): string {
  if (count >= 1000000) {
    return (count / 1000000).toFixed(1) + "M"
  }
  if (count >= 1000) {
    return (count / 1000).toFixed(1) + "K"
  }
  return count.toString()
}

// 简单的 toast 提示
function showToast(message: string, type: "success" | "error" = "success") {
  const container = document.createElement("div")
  container.className = `fixed bottom-4 right-4 z-[100] flex items-center gap-2 px-4 py-3 rounded-lg shadow-lg animate-in slide-in-from-right-full border ${
    type === "success" ? "border-green-500/50 bg-green-500/10 text-green-600" : "border-red-500/50 bg-red-500/10 text-red-600"
  }`
  container.innerHTML = `
    <span class="text-sm">${message}</span>
  `
  document.body.appendChild(container)
  setTimeout(() => container.remove(), 3000)
}

export default function GamesManagementPage() {
  const [search, setSearch] = useState("")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [categories, setCategories] = useState<Category[]>([])
  const [games, setGames] = useState<Game[]>([])
  const [editingGame, setEditingGame] = useState<Game | null>(null)
  const [deletingGame, setDeletingGame] = useState<Game | null>(null)
  const [filterStatus, setFilterStatus] = useState<"all" | "published" | "draft" | "hot">("all")
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    description: "",
    categoryId: "",
    gameType: "html5",
    gameFile: "",
    coverImage: "",
    isHot: false,
    isPublished: true,
  })

  // 加载数据
  useEffect(() => {
    loadData()
  }, [])

  async function loadData() {
    try {
      const [categoriesRes, gamesRes] = await Promise.all([
        fetch("/api/categories"),
        fetch("/api/games?limit=100"),
      ])
      const categoriesData = await categoriesRes.json()
      const gamesData = await gamesRes.json()
      setCategories(categoriesData)
      setGames(gamesData.games || [])
    } catch (error) {
      console.error("加载数据失败:", error)
      showToast("加载数据失败", "error")
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    // 自动生成 slug
    if (field === "title" && !editingGame) {
      const slug = value.toLowerCase()
        .replace(/[^a-z0-9\u4e00-\u9fa5]+/g, "-")
        .replace(/^-|-$/g, "")
      setFormData((prev) => ({ ...prev, slug }))
    }
  }

  // 重置表单
  const resetForm = () => {
    setFormData({
      title: "",
      slug: "",
      description: "",
      categoryId: "",
      gameType: "html5",
      gameFile: "",
      coverImage: "",
      isHot: false,
      isPublished: true,
    })
    setEditingGame(null)
  }

  // 创建游戏
  const handleCreate = async () => {
    if (!formData.title || !formData.slug || !formData.gameFile) {
      showToast("请填写必填字段", "error")
      return
    }

    setIsSubmitting(true)
    try {
      const res = await fetch("/api/games", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })
      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || "创建失败")
      }

      showToast("游戏创建成功")
      setIsAddDialogOpen(false)
      resetForm()
      loadData()
    } catch (error) {
      console.error("创建游戏失败:", error)
      showToast(error instanceof Error ? error.message : "创建失败", "error")
    } finally {
      setIsSubmitting(false)
    }
  }

  // 编辑游戏
  const handleEdit = async () => {
    if (!editingGame || !formData.title || !formData.slug || !formData.gameFile) {
      showToast("请填写必填字段", "error")
      return
    }

    setIsSubmitting(true)
    try {
      const res = await fetch(`/api/games/${editingGame.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })
      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || "更新失败")
      }

      showToast("游戏更新成功")
      setIsEditDialogOpen(false)
      resetForm()
      loadData()
    } catch (error) {
      console.error("更新游戏失败:", error)
      showToast(error instanceof Error ? error.message : "更新失败", "error")
    } finally {
      setIsSubmitting(false)
    }
  }

  // 删除游戏
  const handleDelete = async () => {
    if (!deletingGame) return

    setIsSubmitting(true)
    try {
      const res = await fetch(`/api/games/${deletingGame.id}`, {
        method: "DELETE",
      })
      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || "删除失败")
      }

      showToast("游戏已删除")
      setIsDeleteDialogOpen(false)
      setDeletingGame(null)
      loadData()
    } catch (error) {
      console.error("删除游戏失败:", error)
      showToast(error instanceof Error ? error.message : "删除失败", "error")
    } finally {
      setIsSubmitting(false)
    }
  }

  // 切换热门状态
  const handleToggleHot = async (game: Game) => {
    try {
      const res = await fetch(`/api/games/${game.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "toggleHot" }),
      })
      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || "操作失败")
      }

      showToast(game.isHot ? "已取消热门" : "已设为热门")
      loadData()
    } catch (error) {
      console.error("操作失败:", error)
      showToast(error instanceof Error ? error.message : "操作失败", "error")
    }
  }

  // 切换发布状态
  const handleTogglePublished = async (game: Game) => {
    try {
      const res = await fetch(`/api/games/${game.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "togglePublished" }),
      })
      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || "操作失败")
      }

      showToast(game.isPublished ? "已取消发布" : "已发布")
      loadData()
    } catch (error) {
      console.error("操作失败:", error)
      showToast(error instanceof Error ? error.message : "操作失败", "error")
    }
  }

  // 打开编辑对话框
  const openEditDialog = (game: Game) => {
    setEditingGame(game)
    setFormData({
      title: game.title,
      slug: game.slug,
      description: game.description || "",
      categoryId: game.categoryId || "",
      gameType: game.gameType,
      gameFile: game.gameFile,
      coverImage: game.coverImage,
      isHot: game.isHot,
      isPublished: game.isPublished,
    })
    setIsEditDialogOpen(true)
  }

  // 过滤游戏
  const filteredGames = games.filter((game) => {
    const matchesSearch = game.title.toLowerCase().includes(search.toLowerCase()) ||
      game.slug.toLowerCase().includes(search.toLowerCase())
    switch (filterStatus) {
      case "published":
        return matchesSearch && game.isPublished
      case "draft":
        return matchesSearch && !game.isPublished
      case "hot":
        return matchesSearch && game.isHot
      default:
        return matchesSearch
    }
  })

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">游戏管理</h1>
          <p className="text-muted-foreground">管理所有游戏，包括添加、编辑和删除游戏。</p>
        </div>
        
        {/* 添加游戏对话框 */}
        <Dialog open={isAddDialogOpen} onOpenChange={(open) => { setIsAddDialogOpen(open); if (!open) resetForm() }}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-neon-purple to-neon-cyan">
              <Plus className="h-4 w-4 mr-2" />
              添加游戏
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>添加新游戏</DialogTitle>
              <DialogDescription>
                填写游戏信息并上传游戏文件。带 * 的字段为必填项。
              </DialogDescription>
            </DialogHeader>
            
            <GameForm
              formData={formData}
              categories={categories}
              onInputChange={handleInputChange}
            />
            
            <DialogFooter>
              <Button variant="outline" onClick={() => { setIsAddDialogOpen(false); resetForm() }}>
                取消
              </Button>
              <Button 
                className="bg-gradient-to-r from-neon-purple to-neon-cyan" 
                onClick={handleCreate}
                disabled={isSubmitting}
              >
                {isSubmitting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                添加游戏
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="搜索游戏名称或别名..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              <Button 
                variant={filterStatus === "all" ? "default" : "outline"}
                onClick={() => setFilterStatus("all")}
              >
                全部 ({games.length})
              </Button>
              <Button 
                variant={filterStatus === "published" ? "default" : "outline"}
                onClick={() => setFilterStatus("published")}
              >
                已发布
              </Button>
              <Button 
                variant={filterStatus === "draft" ? "default" : "outline"}
                onClick={() => setFilterStatus("draft")}
              >
                草稿
              </Button>
              <Button 
                variant={filterStatus === "hot" ? "default" : "outline"}
                onClick={() => setFilterStatus("hot")}
              >
                热门
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Games Table */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle>游戏列表 ({filteredGames.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {filteredGames.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              暂无游戏数据
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[300px]">游戏</TableHead>
                  <TableHead>分类</TableHead>
                  <TableHead>游玩次数</TableHead>
                  <TableHead>评分</TableHead>
                  <TableHead>状态</TableHead>
                  <TableHead className="text-right">操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredGames.map((game) => (
                  <TableRow key={game.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-neon-purple/20 to-neon-cyan/20 flex items-center justify-center text-xl overflow-hidden">
                          {game.coverImage ? (
                            <img src={game.coverImage} alt={game.title} className="w-full h-full object-cover" />
                          ) : (
                            "🎮"
                          )}
                        </div>
                        <div>
                          <div className="font-medium">{game.title}</div>
                          <div className="text-xs text-muted-foreground">/{game.slug}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{game.category?.name || "未分类"}</Badge>
                    </TableCell>
                    <TableCell>{formatPlayCount(game.playCount)}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 text-neon-gold fill-neon-gold" />
                        {game.avgRating?.toFixed(1) || "-"}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col gap-1">
                        {game.isPublished ? (
                          <Badge variant="default" className="bg-green-500">已发布</Badge>
                        ) : (
                          <Badge variant="secondary">草稿</Badge>
                        )}
                        {game.isHot && <Badge variant="hot">热门</Badge>}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem asChild>
                            <a href={`/play/${game.slug}`} target="_blank" rel="noopener noreferrer">
                              <Eye className="h-4 w-4 mr-2" />
                              查看游戏
                            </a>
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => openEditDialog(game)}>
                            <Edit className="h-4 w-4 mr-2" />
                            编辑
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => handleToggleHot(game)}>
                            {game.isHot ? <ToggleLeft className="h-4 w-4 mr-2" /> : <ToggleRight className="h-4 w-4 mr-2" />}
                            {game.isHot ? "取消热门" : "设为热门"}
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleTogglePublished(game)}>
                            {game.isPublished ? <ToggleLeft className="h-4 w-4 mr-2" /> : <ToggleRight className="h-4 w-4 mr-2" />}
                            {game.isPublished ? "取消发布" : "发布游戏"}
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem 
                            className="text-destructive focus:text-destructive"
                            onClick={() => { setDeletingGame(game); setIsDeleteDialogOpen(true) }}
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            删除
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

      {/* 编辑游戏对话框 */}
      <Dialog open={isEditDialogOpen} onOpenChange={(open) => { setIsEditDialogOpen(open); if (!open) resetForm() }}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>编辑游戏</DialogTitle>
            <DialogDescription>
              修改游戏信息。带 * 的字段为必填项。
            </DialogDescription>
          </DialogHeader>
          
          <GameForm
            formData={formData}
            categories={categories}
            onInputChange={handleInputChange}
          />
          
          <DialogFooter>
            <Button variant="outline" onClick={() => { setIsEditDialogOpen(false); resetForm() }}>
              取消
            </Button>
            <Button 
              className="bg-gradient-to-r from-neon-purple to-neon-cyan" 
              onClick={handleEdit}
              disabled={isSubmitting}
            >
              {isSubmitting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              保存修改
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 删除确认对话框 */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>确认删除</AlertDialogTitle>
            <AlertDialogDescription>
              确定要删除游戏「{deletingGame?.title}」吗？此操作无法撤销，相关的评论和收藏记录也将被删除。
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

// 游戏表单组件
function GameForm({ 
  formData, 
  categories, 
  onInputChange 
}: { 
  formData: {
    title: string
    slug: string
    description: string
    categoryId: string
    gameType: string
    gameFile: string
    coverImage: string
    isHot: boolean
    isPublished: boolean
  }
  categories: Category[]
  onInputChange: (field: string, value: string | boolean) => void
}) {
  return (
    <div className="grid gap-4 py-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="title">游戏名称 *</Label>
          <Input
            id="title"
            placeholder="输入游戏名称"
            value={formData.title}
            onChange={(e) => onInputChange("title", e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="slug">URL 别名 *</Label>
          <Input
            id="slug"
            placeholder="game-slug"
            value={formData.slug}
            onChange={(e) => onInputChange("slug", e.target.value)}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">游戏描述</Label>
        <Textarea
          id="description"
          placeholder="输入游戏描述..."
          rows={3}
          value={formData.description}
          onChange={(e) => onInputChange("description", e.target.value)}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="category">游戏分类</Label>
          <Select value={formData.categoryId} onValueChange={(value) => onInputChange("categoryId", value)}>
            <SelectTrigger>
              <SelectValue placeholder="选择分类" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((cat) => (
                <SelectItem key={cat.id} value={cat.id}>
                  {cat.icon} {cat.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="gameType">游戏类型 *</Label>
          <Select value={formData.gameType} onValueChange={(value) => onInputChange("gameType", value)}>
            <SelectTrigger>
              <SelectValue placeholder="选择类型" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="html5">HTML5</SelectItem>
              <SelectItem value="flash">Flash</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="coverImage">封面图片</Label>
        <div className="flex gap-2">
          <Input
            id="coverImage"
            placeholder="输入图片URL"
            value={formData.coverImage}
            onChange={(e) => onInputChange("coverImage", e.target.value)}
            className="flex-1"
          />
          <Button variant="outline" type="button" disabled>
            <Upload className="h-4 w-4 mr-2" />
            上传
          </Button>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="gameFile">游戏文件 *</Label>
        <div className="flex gap-2">
          <Input
            id="gameFile"
            placeholder="输入游戏文件URL"
            value={formData.gameFile}
            onChange={(e) => onInputChange("gameFile", e.target.value)}
            className="flex-1"
          />
          <Button variant="outline" type="button" disabled>
            <Upload className="h-4 w-4 mr-2" />
            上传
          </Button>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="isHot"
            checked={formData.isHot}
            onChange={(e) => onInputChange("isHot", e.target.checked)}
            className="h-4 w-4"
          />
          <Label htmlFor="isHot">设为热门</Label>
        </div>
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="isPublished"
            checked={formData.isPublished}
            onChange={(e) => onInputChange("isPublished", e.target.checked)}
            className="h-4 w-4"
          />
          <Label htmlFor="isPublished">立即发布</Label>
        </div>
      </div>
    </div>
  )
}
