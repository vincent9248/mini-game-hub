import Link from "next/link"
import { Gamepad2, Star, Heart, Share2, Eye, Clock, ArrowLeft, MessageSquare } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// 模拟游戏数据
const gameData = {
  id: "1",
  title: "像素射击",
  category: "射击游戏",
  rating: 4.8,
  totalRatings: 12580,
  plays: "125.3K",
  description: "一款经典的像素风格射击游戏。控制你的角色，消灭所有敌人，收集道具，提升等级。游戏支持多种武器和技能，让你的战斗更加精彩！",
  cover: "🎮",
  gameType: "html5",
  gameFile: "/games/pixel-shooter.html",
  isHot: true,
  createdAt: "2026-01-15",
  author: "Game Studio",
}

const comments = [
  { id: "1", user: "玩家A", avatar: "A", rating: 5, content: "太好玩了！根本停不下来！", time: "2小时前" },
  { id: "2", user: "玩家B", avatar: "B", rating: 4, content: "游戏性不错，就是有点难", time: "5小时前" },
  { id: "3", user: "玩家C", avatar: "C", rating: 5, content: "像素风格太棒了！", time: "1天前" },
]

export default function PlayPage({ params }: { params: { id: string } }) {
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
              <div className="aspect-video bg-gradient-to-br from-neon-purple/20 to-neon-cyan/20 flex items-center justify-center relative">
                <div className="text-center">
                  <div className="text-8xl mb-4">{gameData.cover}</div>
                  <div className="text-xl font-medium mb-2">{gameData.title}</div>
                  <Button size="lg" className="bg-gradient-to-r from-neon-purple to-neon-cyan">
                    <Gamepad2 className="mr-2 h-5 w-5" />
                    开始游戏
                  </Button>
                </div>
                {/* Game would load here in iframe */}
              </div>
            </Card>

            {/* Game Info */}
            <Card>
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <div>
                    <Badge variant="neon" className="mb-2">{gameData.category}</Badge>
                    <CardTitle className="text-2xl">{gameData.title}</CardTitle>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="icon">
                      <Heart className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="icon">
                      <Share2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Star className="h-4 w-4 text-neon-gold fill-neon-gold" />
                    {gameData.rating} ({gameData.totalRatings.toLocaleString()} 人评分)
                  </span>
                  <span className="flex items-center gap-1">
                    <Eye className="h-4 w-4" />
                    {gameData.plays} 次游玩
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    {gameData.createdAt}
                  </span>
                </div>
                <Separator />
                <div>
                  <h4 className="font-medium mb-2">游戏介绍</h4>
                  <p className="text-sm text-muted-foreground">{gameData.description}</p>
                </div>
              </CardContent>
            </Card>

            {/* Comments Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5" />
                  玩家评论 ({comments.length})
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Add Comment */}
                <div className="flex gap-3">
                  <Avatar>
                    <AvatarFallback className="bg-gradient-to-br from-neon-purple to-neon-cyan">你</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 flex gap-2">
                    <input 
                      type="text" 
                      placeholder="发表你的评论..." 
                      className="flex-1 rounded-lg border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                    <Button size="sm">发表评论</Button>
                  </div>
                </div>
                <Separator />
                {/* Comments List */}
                {comments.map((comment) => (
                  <div key={comment.id} className="flex gap-3">
                    <Avatar>
                      <AvatarFallback className="bg-muted">{comment.avatar}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-sm">{comment.user}</span>
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <Star 
                              key={i} 
                              className={`h-3 w-3 ${i < comment.rating ? "text-neon-gold fill-neon-gold" : "text-muted"}`} 
                            />
                          ))}
                        </div>
                        <span className="text-xs text-muted-foreground">{comment.time}</span>
                      </div>
                      <p className="text-sm">{comment.content}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
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
                  <span>HTML5</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">评分</span>
                  <span className="flex items-center gap-1">
                    <Star className="h-3 w-3 text-neon-gold fill-neon-gold" />
                    {gameData.rating}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">游玩次数</span>
                  <span>{gameData.plays}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">评论数</span>
                  <span>{comments.length}</span>
                </div>
              </CardContent>
            </Card>

            {/* Related Games */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">相关游戏</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {[1, 2, 3, 4].map((i) => (
                  <Link key={i} href={`/play/${i}`} className="flex gap-3 group">
                    <div className="w-16 h-12 rounded-lg bg-gradient-to-br from-neon-purple/20 to-neon-cyan/20 flex items-center justify-center text-xl">
                      🎮
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-sm truncate group-hover:text-primary transition-colors">
                        相关游戏 {i}
                      </h4>
                      <p className="text-xs text-muted-foreground flex items-center gap-1">
                        <Star className="h-3 w-3 text-neon-gold fill-neon-gold" />
                        4.{5 - i}
                      </p>
                    </div>
                  </Link>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
