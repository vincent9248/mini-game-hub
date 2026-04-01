import Link from "next/link"
import { notFound } from "next/navigation"
import { Star, Eye, Clock, ArrowLeft, MessageSquare } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { getGameBySlug, getGames } from "@/lib/data-service"
import { GameActions } from "./game-actions"
import { CommentSection } from "./comment-section"
import { GamePlayer } from "./game-player"

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

// 格式化日期
function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("zh-CN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date)
}

interface PlayPageProps {
  params: Promise<{ id: string }>
}

export default async function PlayPage({ params }: PlayPageProps) {
  const { id } = await params
  
  // 获取游戏详情
  const game = await getGameBySlug(id)
  
  if (!game) {
    notFound()
  }

  // 获取相关游戏（同分类或热门）
  const relatedGames = game.categoryId
    ? (await getGames({ categoryId: game.categoryId, limit: 5, offset: 0 })).games.filter(g => g.id !== game.id).slice(0, 4)
    : (await getGames({ isHot: true, limit: 5 })).games.filter(g => g.id !== game.id).slice(0, 4)

  return (
    <div className="py-6">
      <div className="container">
        {/* Back Button */}
        <Link href="/games">
          <Button variant="ghost" className="mb-4 -ml-2">
            <ArrowLeft className="h-4 w-4 mr-2" />
            返回游戏列表
          </Button>
        </Link>

        <div className="grid lg:grid-cols-[1fr,400px] gap-6">
          {/* Game Area */}
          <div className="space-y-4">
            {/* Game Player */}
            <Card className="overflow-hidden">
              {game.gameFile ? (
                <GamePlayer
                  gameFile={game.gameFile}
                  title={game.title}
                  coverImage={game.coverImage}
                  gameId={game.id}
                />
              ) : (
                <div className="aspect-video bg-gradient-to-br from-neon-purple/20 to-neon-cyan/20 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-8xl mb-4">
                      {game.coverImage ? (
                        <img
                          src={game.coverImage}
                          alt={game.title}
                          className="w-32 h-32 mx-auto rounded-2xl object-cover"
                        />
                      ) : (
                        "🎮"
                      )}
                    </div>
                    <div className="text-xl font-medium mb-2">{game.title}</div>
                    <p className="text-sm text-muted-foreground">游戏文件未配置</p>
                  </div>
                </div>
              )}
            </Card>

            {/* Game Info */}
            <Card>
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <div>
                    {game.category && (
                      <Badge variant="neon" className="mb-2">{game.category.name}</Badge>
                    )}
                    <CardTitle className="text-2xl">{game.title}</CardTitle>
                  </div>
                  <GameActions gameId={game.id} />
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Star className="h-4 w-4 text-neon-gold fill-neon-gold" />
                    {game.avgRating} ({game._count.comments} 人评分)
                  </span>
                  <span className="flex items-center gap-1">
                    <Eye className="h-4 w-4" />
                    {formatPlayCount(game.playCount)} 次游玩
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    {formatDate(game.createdAt)}
                  </span>
                </div>
                <Separator />
                <div>
                  <h4 className="font-medium mb-2">游戏介绍</h4>
                  <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                    {game.description || "暂无游戏介绍"}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Comments Section */}
            <CommentSection gameId={game.id} comments={game.comments} />
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            {/* Game Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">游戏数据</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">游戏类型</span>
                  <span>{game.gameType.toUpperCase()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">评分</span>
                  <span className="flex items-center gap-1">
                    <Star className="h-3 w-3 text-neon-gold fill-neon-gold" />
                    {game.avgRating}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">游玩次数</span>
                  <span>{formatPlayCount(game.playCount)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">评论数</span>
                  <span>{game._count.comments}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">收藏数</span>
                  <span>{game._count.favorites}</span>
                </div>
              </CardContent>
            </Card>

            {/* Related Games */}
            {relatedGames.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">相关游戏</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {relatedGames.map((relatedGame) => (
                    <Link key={relatedGame.id} href={`/play/${relatedGame.slug}`} className="flex gap-3 group">
                      <div className="w-16 h-12 rounded-lg bg-gradient-to-br from-neon-purple/20 to-neon-cyan/20 flex items-center justify-center overflow-hidden">
                        {relatedGame.coverImage ? (
                          <img 
                            src={relatedGame.coverImage} 
                            alt={relatedGame.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <span className="text-xl">🎮</span>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-sm truncate group-hover:text-primary transition-colors">
                          {relatedGame.title}
                        </h4>
                        <p className="text-xs text-muted-foreground flex items-center gap-1">
                          <Star className="h-3 w-3 text-neon-gold fill-neon-gold" />
                          {relatedGame.avgRating}
                          <span className="mx-1">·</span>
                          {formatPlayCount(relatedGame.playCount)}
                        </p>
                      </div>
                    </Link>
                  ))}
                </CardContent>
              </Card>
            )}

            {/* Share Card - 已集成到游戏操作按钮中 */}
          </div>
        </div>
      </div>
    </div>
  )
}
