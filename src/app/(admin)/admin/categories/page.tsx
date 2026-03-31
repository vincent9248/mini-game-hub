"use client"

import { useState, useEffect } from "react"
import { Plus, Edit, Trash2, GripVertical, FolderTree, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
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
  description: string | null
  icon: string | null
  order: number
  gameCount: number
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

// 表单数据类型
interface FormData {
  name: string
  slug: string
  description: string
  icon: string
  order: number
}

// 初始表单数据
const initialFormData: FormData = {
  name: "",
  slug: "",
  description: "",
  icon: "",
  order: 0,
}

export default function CategoriesManagementPage() {
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [categories, setCategories] = useState<Category[]>([])
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)
  const [deletingCategory, setDeletingCategory] = useState<Category | null>(null)
  const [formData, setFormData] = useState<FormData>(initialFormData)

  // 加载数据
  useEffect(() => {
    loadCategories()
  }, [])

  async function loadCategories() {
    try {
      const res = await fetch("/api/categories")
      const data = await res.json()
      setCategories(data)
    } catch (error) {
      console.error("加载分类失败:", error)
      showToast("加载分类失败", "error")
    } finally {
      setIsLoading(false)
    }
  }

  // 表单输入处理
  const handleInputChange = (field: keyof FormData, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    // 自动生成 slug
    if (field === "name" && !editingCategory) {
      const slug = (value as string)
        .toLowerCase()
        .replace(/[^a-z0-9\u4e00-\u9fa5]+/g, "-")
        .replace(/^-|-$/g, "")
      setFormData((prev) => ({ ...prev, slug }))
    }
  }

  // 重置表单
  const resetForm = () => {
    setFormData(initialFormData)
    setEditingCategory(null)
  }

  // 创建分类
  const handleCreate = async () => {
    if (!formData.name || !formData.slug) {
      showToast("请填写分类名称和 Slug", "error")
      return
    }

    setIsSubmitting(true)
    try {
      const res = await fetch("/api/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })
      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || "创建失败")
      }

      showToast("分类创建成功")
      setIsAddOpen(false)
      resetForm()
      loadCategories()
    } catch (error) {
      console.error("创建分类失败:", error)
      showToast(error instanceof Error ? error.message : "创建失败", "error")
    } finally {
      setIsSubmitting(false)
    }
  }

  // 打开编辑对话框
  const openEditDialog = (category: Category) => {
    setEditingCategory(category)
    setFormData({
      name: category.name,
      slug: category.slug,
      description: category.description || "",
      icon: category.icon || "",
      order: category.order,
    })
    setIsEditOpen(true)
  }

  // 更新分类
  const handleUpdate = async () => {
    if (!editingCategory || !formData.name || !formData.slug) {
      showToast("请填写分类名称和 Slug", "error")
      return
    }

    setIsSubmitting(true)
    try {
      const res = await fetch(`/api/categories/${editingCategory.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })
      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || "更新失败")
      }

      showToast("分类更新成功")
      setIsEditOpen(false)
      resetForm()
      loadCategories()
    } catch (error) {
      console.error("更新分类失败:", error)
      showToast(error instanceof Error ? error.message : "更新失败", "error")
    } finally {
      setIsSubmitting(false)
    }
  }

  // 删除分类
  const handleDelete = async () => {
    if (!deletingCategory) return

    setIsSubmitting(true)
    try {
      const res = await fetch(`/api/categories/${deletingCategory.id}`, {
        method: "DELETE",
      })
      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || "删除失败")
      }

      showToast("分类已删除")
      setIsDeleteOpen(false)
      setDeletingCategory(null)
      loadCategories()
    } catch (error) {
      console.error("删除分类失败:", error)
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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">分类管理</h1>
          <p className="text-muted-foreground">管理游戏分类，包括添加、编辑和删除分类。</p>
        </div>
        
        {/* 添加分类对话框 */}
        <Dialog open={isAddOpen} onOpenChange={(open) => { setIsAddOpen(open); if (!open) resetForm() }}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-neon-purple to-neon-cyan">
              <Plus className="h-4 w-4 mr-2" />
              添加分类
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>添加新分类</DialogTitle>
              <DialogDescription>创建一个新的游戏分类</DialogDescription>
            </DialogHeader>
            
            <CategoryForm formData={formData} onInputChange={handleInputChange} />
            
            <DialogFooter>
              <Button variant="outline" onClick={() => { setIsAddOpen(false); resetForm() }}>
                取消
              </Button>
              <Button 
                className="bg-gradient-to-r from-neon-purple to-neon-cyan"
                onClick={handleCreate}
                disabled={isSubmitting}
              >
                {isSubmitting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                创建
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Categories Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FolderTree className="h-5 w-5" />
            分类列表 ({categories.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {categories.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              暂无分类数据
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">排序</TableHead>
                  <TableHead>分类</TableHead>
                  <TableHead>Slug</TableHead>
                  <TableHead>描述</TableHead>
                  <TableHead>游戏数量</TableHead>
                  <TableHead className="text-right">操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {categories.map((cat) => (
                  <TableRow key={cat.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <GripVertical className="h-4 w-4 text-muted-foreground cursor-move" />
                        <span className="text-sm text-muted-foreground">{cat.order}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-neon-purple/20 to-neon-cyan/20 flex items-center justify-center text-xl">
                          {cat.icon || "📁"}
                        </div>
                        <span className="font-medium">{cat.name}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <code className="text-sm bg-muted px-2 py-1 rounded">{cat.slug}</code>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-muted-foreground line-clamp-1">
                        {cat.description || "-"}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{cat.gameCount} 个游戏</Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => openEditDialog(cat)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="text-destructive hover:text-destructive"
                          onClick={() => { setDeletingCategory(cat); setIsDeleteOpen(true) }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* 编辑分类对话框 */}
      <Dialog open={isEditOpen} onOpenChange={(open) => { setIsEditOpen(open); if (!open) resetForm() }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>编辑分类</DialogTitle>
            <DialogDescription>修改分类信息</DialogDescription>
          </DialogHeader>
          
          <CategoryForm formData={formData} onInputChange={handleInputChange} />
          
          <DialogFooter>
            <Button variant="outline" onClick={() => { setIsEditOpen(false); resetForm() }}>
              取消
            </Button>
            <Button 
              className="bg-gradient-to-r from-neon-purple to-neon-cyan"
              onClick={handleUpdate}
              disabled={isSubmitting}
            >
              {isSubmitting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              保存修改
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 删除确认对话框 */}
      <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>确认删除</AlertDialogTitle>
            <AlertDialogDescription>
              确定要删除分类「{deletingCategory?.name}」吗？
              {deletingCategory && deletingCategory.gameCount > 0 && (
                <span className="block mt-2 text-destructive font-medium">
                  该分类下还有 {deletingCategory.gameCount} 个游戏，请先移动或删除这些游戏。
                </span>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isSubmitting}>取消</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isSubmitting || (deletingCategory?.gameCount ?? 0) > 0}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90 disabled:opacity-50"
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

// 分类表单组件
function CategoryForm({ 
  formData, 
  onInputChange 
}: { 
  formData: FormData
  onInputChange: (field: keyof FormData, value: string | number) => void 
}) {
  return (
    <div className="space-y-4 py-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">分类名称 *</Label>
          <Input 
            id="name" 
            placeholder="例如：动作游戏" 
            value={formData.name}
            onChange={(e) => onInputChange("name", e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="slug">URL Slug *</Label>
          <Input 
            id="slug" 
            placeholder="例如：action" 
            value={formData.slug}
            onChange={(e) => onInputChange("slug", e.target.value)}
          />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="icon">图标 (emoji)</Label>
          <Input 
            id="icon" 
            placeholder="例如：🎮" 
            value={formData.icon}
            onChange={(e) => onInputChange("icon", e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="order">排序</Label>
          <Input 
            id="order" 
            type="number"
            placeholder="0" 
            value={formData.order}
            onChange={(e) => onInputChange("order", parseInt(e.target.value) || 0)}
          />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="description">描述</Label>
        <Textarea
          id="description" 
          placeholder="分类描述（可选）"
          rows={3}
          value={formData.description}
          onChange={(e) => onInputChange("description", e.target.value)}
        />
      </div>
    </div>
  )
}
