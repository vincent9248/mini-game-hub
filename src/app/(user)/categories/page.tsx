import { Badge } from "@/components/ui/badge"
import { getCategories, getStats } from "@/lib/data-service"
import { CategorySearch } from "@/components/category-search"

export default async function CategoriesPage() {
  const [categories, stats] = await Promise.all([
    getCategories(),
    getStats(),
  ])

  return (
    <div className="py-8">
      <div className="container">
        {/* Page Header */}
        <div className="text-center mb-12">
          <Badge variant="neon" className="mb-4">游戏分类</Badge>
          <h1 className="text-4xl font-bold mb-4">探索游戏世界</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            浏览各种游戏分类，找到你喜欢的游戏类型。从动作到益智，从策略到休闲，总有一款适合你。
          </p>
        </div>

        {/* Search and Categories Grid */}
        <CategorySearch 
          categories={categories} 
          stats={{ totalGames: stats.totalGames, totalUsers: stats.totalUsers }} 
        />
      </div>
    </div>
  )
}
