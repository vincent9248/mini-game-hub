import { redirect } from "next/navigation"
import { auth } from "@/lib/auth"
import { Gamepad2, Heart, MessageSquare, Settings, User } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"

export default async function ProfilePage() {
  const session = await auth()

  if (!session || !session.user) {
    redirect("/auth/login")
  }

  const user = session.user as any

  // 模拟数据
  const favorites = [
    { id: "1", title: "像素射击", cover: "🎮", rating: 4.8, addedAt: "2026-03-15" },
    { id: "2", title: "糖果消消乐", cover: "🍬", rating: 4.9, addedAt: "2026-03-10" },
  ]

  const comments = [
    { id: "1", game: "像素射击", content: "太好玩了！根本停不下来！", rating: 5, time: "2小时前" },
    { id: "2", game: "糖果消消乐", content: "画面精美，关卡设计很棒", rating: 4, time: "1天前" },
  ]

  return (
    <div className="py-8">
      <div className="container">
        <div className="grid lg:grid-cols-[280px,1fr] gap-6">
          {/* Sidebar */}
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col items-center text-center">
                <Avatar className="h-24 w-24 mb-4">
                  <AvatarImage src={user.avatar || undefined} />
                  <AvatarFallback className="text-2xl bg-gradient-to-br from-neon-purple to-neon-cyan">
                    {user.name?.[0] || user.email[0]}
                  </AvatarFallback>
                </Avatar>
                <h2 className="text-xl font-semibold mb-1">{user.name || "用户"}</h2>
                <p className="text-sm text-muted-foreground mb-4">{user.email}</p>
                <Badge variant={user.role === "ADMIN" ? "neon" : "secondary"} className="mb-4">
                  {user.role === "ADMIN" ? "管理员" : "普通用户"}
                </Badge>
              </div>
              
              <div className="space-y-2 mt-6">
                <Button variant="secondary" className="w-full justify-start">
                  <User className="h-4 w-4 mr-2" />
                  个人信息
                </Button>
                <Button variant="ghost" className="w-full justify-start">
                  <Heart className="h-4 w-4 mr-2" />
                  我的收藏
                </Button>
                <Button variant="ghost" className="w-full justify-start">
                  <MessageSquare className="h-4 w-4 mr-2" />
                  我的评论
                </Button>
                <Button variant="ghost" className="w-full justify-start">
                  <Settings className="h-4 w-4 mr-2" />
                  设置
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Main Content */}
          <div className="space-y-6">
            {/* Stats */}
            <div className="grid grid-cols-3 gap-4">
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold">{favorites.length}</div>
                  <div className="text-sm text-muted-foreground">收藏游戏</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold">{comments.length}</div>
                  <div className="text-sm text-muted-foreground">发表评论</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold">Lv.5</div>
                  <div className="text-sm text-muted-foreground">用户等级</div>
                </CardContent>
              </Card>
            </div>

            {/* Content Tabs */}
            <Card>
              <CardHeader>
                <CardTitle>我的活动</CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="favorites">
                  <TabsList className="w-full">
                    <TabsTrigger value="favorites" className="flex-1">
                      <Heart className="h-4 w-4 mr-2" />
                      收藏 ({favorites.length})
                    </TabsTrigger>
                    <TabsTrigger value="comments" className="flex-1">
                      <MessageSquare className="h-4 w-4 mr-2" />
                      评论 ({comments.length})
                    </TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="favorites" className="mt-4">
                    <div className="grid sm:grid-cols-2 gap-4">
                      {favorites.map((game) => (
                        <div key={game.id} className="flex gap-3 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors cursor-pointer">
                          <div className="w-16 h-12 rounded-lg bg-gradient-to-br from-neon-purple/20 to-neon-cyan/20 flex items-center justify-center text-2xl">
                            {game.cover}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-sm truncate">{game.title}</h4>
                            <p className="text-xs text-muted-foreground">收藏于 {game.addedAt}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </TabsContent>

                  <TabsContent value="comments" className="mt-4">
                    <div className="space-y-4">
                      {comments.map((comment) => (
                        <div key={comment.id} className="p-4 rounded-lg bg-muted/50">
                          <div className="flex items-center gap-2 mb-2">
                            <Badge variant="outline">{comment.game}</Badge>
                            <div className="flex">
                              {[...Array(5)].map((_, i) => (
                                <span key={i} className={i < comment.rating ? "text-neon-gold" : "text-muted"}>★</span>
                              ))}
                            </div>
                            <span className="text-xs text-muted-foreground ml-auto">{comment.time}</span>
                          </div>
                          <p className="text-sm">{comment.content}</p>
                        </div>
                      ))}
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
