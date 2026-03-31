import Link from "next/link"
import { Gamepad2, Search } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { getCategories, getStats } from "@/lib/data-service"

// 分类颜色映射
const categoryColors: Record<string, string> = {
  action: "from-neon-pink to-neon-purple",
  puzzle: "from-neon-cyan to-neon-green",
  shooter: "from-neon-gold to-neon-pink",
  strategy: "from-neon-purple to-neon-cyan",
  casual: "from-neon-green to-neon-gold",
  racing: "from-neon-pink to-neon-gold",
}

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

        {/* Search */}
        <div className="max-w-md mx-auto mb-12">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="搜索分类..."
              className="pl-10"
            />
          </div>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category) => (
            <Link key={category.id} href={`/games?category=${category.slug}`}>
              <Card className="group cursor-pointer overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-[0_0_30px_rgba(107,78,255,0.3)]">
                <div className={`h-32 bg-gradient-to-br ${categoryColors[category.slug] || "from-neon-purple to-neon-cyan"} flex items-center justify-center`}>
                  <span className="text-6xl group-hover:scale-110 transition-transform duration-300">
                    {category.icon}
                  </span>
                </div>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <h2 className="text-xl font-bold group-hover:text-primary transition-colors">
                      {category.name}
                    </h2>
                    <Badge variant="secondary">{category._count.games} 游戏</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {category.description}
                  </p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        {/* Stats */}
        <div className="mt-16 text-center">
          <div className="inline-flex items-center gap-8 p-6 rounded-2xl bg-card">
            <div>
              <div className="text-3xl font-bold text-neon-purple">{categories.length}</div>
              <div className="text-sm text-muted-foreground">游戏分类</div>
            </div>
            <div className="w-px h-12 bg-border" />
            <div>
              <div className="text-3xl font-bold text-neon-cyan">{stats.totalGames}</div>
              <div className="text-sm text-muted-foreground">游戏总数</div>
            </div>
            <div className="w-px h-12 bg-border" />
            <div>
              <div className="text-3xl font-bold text-neon-pink">{stats.totalUsers.toLocaleString()}+</div>
              <div className="text-sm text-muted-foreground">活跃玩家</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
