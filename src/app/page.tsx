import Link from "next/link"
import { Gamepad2, Search, TrendingUp, Users, Star, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { getCategories, getHotGames, getNewGames, getStats } from "@/lib/data-service"

// 分类颜色映射
const categoryColors: Record<string, string> = {
  action: "from-neon-pink to-neon-purple",
  puzzle: "from-neon-cyan to-neon-green",
  shooter: "from-neon-gold to-neon-pink",
  strategy: "from-neon-purple to-neon-cyan",
  casual: "from-neon-green to-neon-gold",
  racing: "from-neon-pink to-neon-gold",
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

export default async function Home() {
  // 从数据库获取数据
  const [categories, hotGames, newGames, stats] = await Promise.all([
    getCategories(),
    getHotGames(6),
    getNewGames(4),
    getStats(),
  ])

  return (
    <div className="page-center">
      {/* Header */}
      <header className="w-full sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="rounded-lg bg-gradient-to-br from-neon-purple to-neon-cyan p-2">
              <Gamepad2 className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold neon-text">Mini Game Hub</span>
          </Link>

          <div className="flex items-center gap-4">
            <div className="relative hidden md:flex">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder="搜索游戏..."
                className="h-10 w-64 rounded-lg border bg-background pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <Link href="/auth/login">
              <Button variant="ghost">登录</Button>
            </Link>
            <Link href="/auth/register">
              <Button className="bg-gradient-to-r from-neon-purple to-neon-cyan">注册</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="main-content w-full">
        {/* Hero Section */}
        <section className="relative overflow-hidden py-20 md:py-32">
          <div className="absolute inset-0 bg-gradient-to-br from-neon-purple/20 via-background to-neon-cyan/20" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-neon-purple/10 rounded-full blur-[120px]" />
        
          <div className="container relative">
            <div className="mx-auto max-w-3xl text-center">
              <Badge variant="neon" className="mb-6 text-sm">
                <Zap className="mr-1 h-3 w-3" /> 超过 {stats.totalGames}+ 精品游戏
              </Badge>
              <h1 className="text-4xl font-bold tracking-tight md:text-6xl lg:text-7xl mb-6">
                <span className="neon-text">发现</span> 无限乐趣
              </h1>
              <p className="text-xl text-muted-foreground mb-8">
                精选海量网页游戏，包括动作、益智、射击、策略等多种类型。<br />
                无需下载，即点即玩，与好友一起分享快乐！
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/games">
                  <Button size="lg" className="bg-gradient-to-r from-neon-purple to-neon-cyan h-12 px-8">
                    <Gamepad2 className="mr-2 h-5 w-5" /> 开始探索
                  </Button>
                </Link>
                <Link href="/categories">
                  <Button size="lg" variant="outline" className="h-12 px-8">
                    浏览分类
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Categories */}
        <section className="py-16">
          <div className="container">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold">游戏分类</h2>
              <Link href="/categories" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                查看全部 →
              </Link>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {categories.map((cat) => (
                <Link key={cat.id} href={`/games?category=${cat.slug}`}>
                  <Card className="group cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-[0_0_30px_rgba(107,78,255,0.3)]">
                    <CardContent className="p-4 text-center">
                      <div className={`w-12 h-12 mx-auto mb-3 rounded-xl bg-gradient-to-br ${categoryColors[cat.slug] || "from-neon-purple to-neon-cyan"} flex items-center justify-center text-2xl`}>
                        {cat.icon}
                      </div>
                      <h3 className="font-medium text-sm mb-1">{cat.name}</h3>
                      <p className="text-xs text-muted-foreground">{cat._count.games} 个游戏</p>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Hot Games */}
        <section className="py-16 bg-gradient-to-b from-background via-secondary/20 to-background">
          <div className="container">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-6 w-6 text-neon-pink" />
                <h2 className="text-2xl font-bold">热门游戏</h2>
              </div>
              <Link href="/games?orderBy=popular" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                查看全部 →
              </Link>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
              {hotGames.map((game) => (
                <Link key={game.id} href={`/play/${game.slug}`}>
                  <Card className="group cursor-pointer overflow-hidden game-card-hover">
                    <div className="aspect-[4/3] relative bg-gradient-to-br from-neon-purple/20 to-neon-cyan/20">
                      <div className="absolute inset-0 flex items-center justify-center text-6xl opacity-50">
                        🎮
                      </div>
                      {game.isHot && (
                        <Badge variant="hot" className="absolute top-2 right-2">
                          HOT
                        </Badge>
                      )}
                    </div>
                    <CardContent className="p-3">
                      <h3 className="font-medium text-sm mb-2 truncate">{game.title}</h3>
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Star className="h-3 w-3 text-neon-gold fill-neon-gold" />
                          {game.avgRating}
                        </span>
                        <span>{formatPlayCount(game.playCount)} 人在玩</span>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="py-16 border-y border-border/50">
          <div className="container">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <div className="text-center">
                <Gamepad2 className="h-8 w-8 mx-auto mb-3 text-neon-purple" />
                <div className="text-3xl font-bold mb-1">{stats.totalGames}</div>
                <div className="text-sm text-muted-foreground">游戏总数</div>
              </div>
              <div className="text-center">
                <Users className="h-8 w-8 mx-auto mb-3 text-neon-cyan" />
                <div className="text-3xl font-bold mb-1">{stats.totalUsers.toLocaleString()}</div>
                <div className="text-sm text-muted-foreground">活跃用户</div>
              </div>
              <div className="text-center">
                <TrendingUp className="h-8 w-8 mx-auto mb-3 text-neon-pink" />
                <div className="text-3xl font-bold mb-1">{stats.todayPlays.toLocaleString()}</div>
                <div className="text-sm text-muted-foreground">今日游玩</div>
              </div>
              <div className="text-center">
                <Star className="h-8 w-8 mx-auto mb-3 text-neon-gold" />
                <div className="text-3xl font-bold mb-1">4.8/5.0</div>
                <div className="text-sm text-muted-foreground">用户评分</div>
              </div>
            </div>
          </div>
        </section>

        {/* New Games */}
        <section className="py-16">
          <div className="container">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-2">
                <Zap className="h-6 w-6 text-neon-cyan" />
                <h2 className="text-2xl font-bold">最新上线</h2>
              </div>
              <Link href="/games?orderBy=newest" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                查看全部 →
              </Link>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {newGames.map((game) => (
                <Link key={game.id} href={`/play/${game.slug}`}>
                  <Card className="group cursor-pointer overflow-hidden game-card-hover">
                    <div className="aspect-[4/3] relative bg-gradient-to-br from-neon-cyan/20 to-neon-green/20">
                      <div className="absolute inset-0 flex items-center justify-center text-6xl opacity-50">
                        🎮
                      </div>
                      <Badge variant="new" className="absolute top-2 right-2">
                        NEW
                      </Badge>
                    </div>
                    <CardContent className="p-3">
                      <h3 className="font-medium text-sm mb-2 truncate">{game.title}</h3>
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>{game.category?.name || "未分类"}</span>
                        <span>{formatPlayCount(game.playCount)} 游玩</span>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="w-full mt-auto border-t py-12 bg-background">
        <div className="container">
          <div className="grid grid-cols-4 gap-8 mb-8">
            <div className="col-span-2 md:col-span-1">
              <Link href="/" className="flex items-center gap-2 mb-4">
                <div className="rounded-lg bg-gradient-to-br from-neon-purple to-neon-cyan p-2">
                  <Gamepad2 className="h-5 w-5 text-white" />
                </div>
                <span className="font-bold">Mini Game Hub</span>
              </Link>
              <p className="text-sm text-muted-foreground">
                专注分享精品网页游戏<br />
                让快乐触手可及
              </p>
            </div>
            <div>
              <h4 className="font-medium mb-4">快速链接</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="/games" className="hover:text-primary transition-colors">全部游戏</Link></li>
                <li><Link href="/categories" className="hover:text-primary transition-colors">游戏分类</Link></li>
                <li><Link href="/games?orderBy=popular" className="hover:text-primary transition-colors">热门榜单</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-4">关于我们</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="/about" className="hover:text-primary transition-colors">简介</Link></li>
                <li><Link href="/contact" className="hover:text-primary transition-colors">联系</Link></li>
                <li><Link href="/privacy" className="hover:text-primary transition-colors">隐私政策</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-4">关注我们</h4>
              <div className="flex gap-4">
                <Avatar className="cursor-pointer hover:scale-110 transition-transform">
                  <AvatarFallback className="bg-neon-purple">微</AvatarFallback>
                </Avatar>
                <Avatar className="cursor-pointer hover:scale-110 transition-transform">
                  <AvatarFallback className="bg-neon-cyan">公</AvatarFallback>
                </Avatar>
              </div>
            </div>
          </div>
          <div className="pt-8 border-t text-center text-sm text-muted-foreground">
            © 2026 Mini Game Hub. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  )
}
