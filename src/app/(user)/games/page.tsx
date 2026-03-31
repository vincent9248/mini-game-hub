import Link from "next/link"
import { Gamepad2, Search, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { getCategories, getGames } from "@/lib/data-service"

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

interface GamesPageProps {
  searchParams: {
    category?: string
    orderBy?: "newest" | "popular" | "rating"
    page?: string
    search?: string
  }
}

export default async function GamesPage({ searchParams }: GamesPageProps) {
  const { category, orderBy = "newest", page = "1", search = "" } = searchParams
  const currentPage = parseInt(page)
  const pageSize = 12
  const offset = (currentPage - 1) * pageSize

  const [categories, { games, total }] = await Promise.all([
    getCategories(),
    getGames({
      categorySlug: category,
      orderBy,
      limit: pageSize,
      offset,
      search: search || undefined,
    }),
  ])

  const totalPages = Math.ceil(total / pageSize)

  // 构建分页链接
  const buildPageUrl = (pageNum: number) => {
    const params = new URLSearchParams()
    if (category) params.set("category", category)
    if (orderBy !== "newest") params.set("orderBy", orderBy)
    if (search) params.set("search", search)
    params.set("page", pageNum.toString())
    return `/games?${params.toString()}`
  }

  return (
    <div className="py-8">
      <div className="container">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">全部游戏</h1>
            <p className="text-muted-foreground">
              {search ? `搜索 "${search}" 结果，` : ""}共 {total} 款游戏
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <form action="/games" method="get" className="relative flex-1 md:flex-none">
              {category && <input type="hidden" name="category" value={category} />}
              {orderBy !== "newest" && <input type="hidden" name="orderBy" value={orderBy} />}
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                name="search"
                placeholder="搜索游戏..." 
                className="pl-10 w-full md:w-64" 
                defaultValue={search}
              />
            </form>
            <Link href={buildPageUrl(currentPage)}>
              <Select value={orderBy}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">最新</SelectItem>
                  <SelectItem value="popular">最热</SelectItem>
                  <SelectItem value="rating">评分</SelectItem>
                </SelectContent>
              </Select>
            </Link>
          </div>
        </div>

        {/* Categories */}
        <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
          <Link 
            href={search ? `/games?search=${encodeURIComponent(search)}` : "/games"}
            className="shrink-0"
          >
            <Button 
              variant={!category ? "default" : "outline"} 
              size="sm"
              className={!category ? "bg-gradient-to-r from-neon-purple to-neon-cyan" : ""}
            >
              全部
            </Button>
          </Link>
          {categories.map((cat) => {
            const catUrl = search 
              ? `/games?category=${cat.slug}&search=${encodeURIComponent(search)}`
              : `/games?category=${cat.slug}`
            return (
              <Link key={cat.id} href={catUrl} className="shrink-0">
                <Button 
                  variant={category === cat.slug ? "default" : "outline"} 
                  size="sm"
                  className={category === cat.slug ? "bg-gradient-to-r from-neon-purple to-neon-cyan" : ""}
                >
                  {cat.name}
                </Button>
              </Link>
            )
          })}
        </div>

        {/* Games Grid */}
        {games.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {games.map((game) => (
              <Link key={game.id} href={`/play/${game.slug}`}>
                <Card className="group cursor-pointer overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-[0_0_30px_rgba(107,78,255,0.3)]">
                  <div className="aspect-[4/3] relative bg-gradient-to-br from-neon-purple/20 to-neon-cyan/20 overflow-hidden">
                    {game.coverImage ? (
                      <img 
                        src={game.coverImage} 
                        alt={game.title} 
                        className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" 
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center text-5xl opacity-50">
                        🎮
                      </div>
                    )}
                    {game.isHot && (
                      <Badge variant="hot" className="absolute top-2 right-2">
                        HOT
                      </Badge>
                    )}
                    {game.isNew && (
                      <Badge variant="new" className="absolute top-2 right-2">
                        NEW
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
                      <span>{formatPlayCount(game.playCount)}</span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <Gamepad2 className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
            <p className="text-muted-foreground">
              {search ? `未找到与 "${search}" 相关的游戏` : "暂无游戏"}
            </p>
            {search && (
              <Link href="/games">
                <Button variant="outline" className="mt-4">
                  清除搜索
                </Button>
              </Link>
            )}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center mt-12">
            <div className="flex gap-2">
              <Link 
                href={buildPageUrl(currentPage - 1)}
                className={currentPage <= 1 ? "pointer-events-none" : ""}
              >
                <Button variant="outline" disabled={currentPage <= 1}>上一页</Button>
              </Link>
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const pageNum = i + 1
                return (
                  <Link key={pageNum} href={buildPageUrl(pageNum)}>
                    <Button 
                      variant="outline" 
                      className={pageNum === currentPage ? "bg-primary text-primary-foreground" : ""}
                    >
                      {pageNum}
                    </Button>
                  </Link>
                )
              })}
              {totalPages > 5 && <span className="px-2 py-2">...</span>}
              <Link 
                href={buildPageUrl(currentPage + 1)}
                className={currentPage >= totalPages ? "pointer-events-none" : ""}
              >
                <Button variant="outline" disabled={currentPage >= totalPages}>下一页</Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
