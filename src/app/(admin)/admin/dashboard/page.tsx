import Link from "next/link"
import { Gamepad2, Users, MessageSquare, TrendingUp, Eye, Clock } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { getStats, getHotGames, getCategories } from "@/lib/data-service"
import { prisma } from "@/lib/prisma"

// 格式化数字
function formatNumber(num: number): string {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + "M"
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + "K"
  }
  return num.toString()
}

export default async function DashboardPage() {
  const [stats, hotGames, categories] = await Promise.all([
    getStats(),
    getHotGames(4),
    getCategories(),
  ])

  // 获取分类游戏数量用于分布图
  const categoryStats = await Promise.all(
    categories.map(async (cat) => {
      const gameCount = await prisma.game.count({
        where: { categoryId: cat.id, isPublished: true },
      })
      return {
        name: cat.name,
        count: gameCount,
        percentage: stats.totalGames > 0 ? Math.round((gameCount / stats.totalGames) * 100) : 0,
      }
    })
  )

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">仪表盘</h1>
        <p className="text-muted-foreground">欢迎回来！以下是平台数据概览。</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <Gamepad2 className="h-10 w-10 text-neon-purple" />
              <Badge variant="outline" className="text-green-500 border-green-500">
                +12
              </Badge>
            </div>
            <div className="mt-4">
              <div className="text-3xl font-bold">{stats.totalGames}</div>
              <div className="text-sm text-muted-foreground">游戏总数</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <Users className="h-10 w-10 text-neon-cyan" />
              <Badge variant="outline" className="text-green-500 border-green-500">
                +{Math.floor(stats.totalUsers * 0.01)}
              </Badge>
            </div>
            <div className="mt-4">
              <div className="text-3xl font-bold">{stats.totalUsers.toLocaleString()}</div>
              <div className="text-sm text-muted-foreground">用户总数</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <MessageSquare className="h-10 w-10 text-neon-pink" />
              <Badge variant="outline" className="text-green-500 border-green-500">
                +{Math.floor(stats.totalComments * 0.05)}
              </Badge>
            </div>
            <div className="mt-4">
              <div className="text-3xl font-bold">{stats.totalComments.toLocaleString()}</div>
              <div className="text-sm text-muted-foreground">评论总数</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <Eye className="h-10 w-10 text-neon-green" />
              <Badge variant="outline" className="text-green-500 border-green-500">
                +15%
              </Badge>
            </div>
            <div className="mt-4">
              <div className="text-3xl font-bold">{stats.todayPlays.toLocaleString()}</div>
              <div className="text-sm text-muted-foreground">今日访问</div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Games */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>热门游戏</span>
              <Link href="/admin/games" className="text-sm text-primary hover:underline">查看全部</Link>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {hotGames.map((game) => (
                <div key={game.id} className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-neon-purple/20 to-neon-cyan/20 flex items-center justify-center text-xl overflow-hidden">
                    {game.coverImage ? (
                      <img src={game.coverImage} alt={game.title} className="w-full h-full object-cover" />
                    ) : (
                      "🎮"
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium truncate">{game.title}</div>
                    <div className="text-sm text-muted-foreground">{game.category?.name || "未分类"}</div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-1 text-sm">
                      <span className="text-neon-gold">★</span>
                      {game.avgRating}
                    </div>
                    <div className="text-xs text-muted-foreground">{formatNumber(game.playCount)} 游玩</div>
                  </div>
                  {game.isHot && (
                    <Badge variant="hot" className="shrink-0">HOT</Badge>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Category Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>游戏分类分布</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {categoryStats.map((cat) => (
              <div key={cat.name} className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>{cat.name}</span>
                  <span className="text-muted-foreground">{cat.count} 个游戏</span>
                </div>
                <Progress value={cat.percentage} className="h-2" />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>快捷操作</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Link href="/admin/games" className="p-4 rounded-lg bg-gradient-to-br from-neon-purple/10 to-neon-cyan/10 hover:from-neon-purple/20 hover:to-neon-cyan/20 transition-all text-center cursor-pointer">
            <Gamepad2 className="h-8 w-8 mx-auto mb-2 text-neon-purple" />
            <div className="font-medium">添加游戏</div>
          </Link>
          <Link href="/admin/categories" className="p-4 rounded-lg bg-gradient-to-br from-neon-cyan/10 to-neon-green/10 hover:from-neon-cyan/20 hover:to-neon-green/20 transition-all text-center cursor-pointer">
            <TrendingUp className="h-8 w-8 mx-auto mb-2 text-neon-cyan" />
            <div className="font-medium">管理分类</div>
          </Link>
          <Link href="/admin/users" className="p-4 rounded-lg bg-gradient-to-br from-neon-pink/10 to-neon-gold/10 hover:from-neon-pink/20 hover:to-neon-gold/20 transition-all text-center cursor-pointer">
            <Users className="h-8 w-8 mx-auto mb-2 text-neon-pink" />
            <div className="font-medium">管理用户</div>
          </Link>
          <Link href="/" className="p-4 rounded-lg bg-gradient-to-br from-neon-gold/10 to-neon-green/10 hover:from-neon-gold/20 hover:to-neon-green/20 transition-all text-center cursor-pointer">
            <Clock className="h-8 w-8 mx-auto mb-2 text-neon-gold" />
            <div className="font-medium">查看前台</div>
          </Link>
        </CardContent>
      </Card>
    </div>
  )
}
