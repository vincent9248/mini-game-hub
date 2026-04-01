"use client"

import { useState } from "react"
import { Star, MessageSquare, ThumbsUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"

interface Comment {
  id: string
  content: string
  rating: number
  createdAt: Date
  user: {
    id: string
    name: string | null
    avatar: string | null
  }
}

interface CommentSectionProps {
  gameId: string
  comments: Comment[]
}

function formatTimeAgo(date: Date): string {
  const now = new Date()
  const diff = now.getTime() - new Date(date).getTime()
  const minutes = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)

  if (minutes < 1) return "刚刚"
  if (minutes < 60) return `${minutes}分钟前`
  if (hours < 24) return `${hours}小时前`
  if (days < 7) return `${days}天前`
  return new Date(date).toLocaleDateString("zh-CN")
}

export function CommentSection({ gameId, comments: initialComments }: CommentSectionProps) {
  const { toast } = useToast()
  const [comments, setComments] = useState(initialComments)
  const [newComment, setNewComment] = useState("")
  const [rating, setRating] = useState(5)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmitComment = async () => {
    if (!newComment.trim()) {
      toast({
        title: "请输入评论内容",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)
    try {
      const response = await fetch(`/api/games/${gameId}/comments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content: newComment,
          rating,
        }),
      })

      if (response.ok) {
        const data = await response.json()
        setComments([data, ...comments])
        setNewComment("")
        setRating(5)
        toast({
          title: "评论成功",
        })
      } else {
        const data = await response.json()
        toast({
          title: "评论失败",
          description: data.error || "请先登录",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "评论失败",
        description: "网络错误，请稍后重试",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5" />
          玩家评论 ({comments.length})
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Add Comment */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">评分：</span>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((value) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setRating(value)}
                  className="p-1 hover:scale-110 transition-transform"
                >
                  <Star
                    className={`h-5 w-5 ${
                      value <= rating
                        ? "text-neon-gold fill-neon-gold"
                        : "text-muted"
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>
          <div className="flex gap-3">
            <Avatar>
              <AvatarFallback className="bg-gradient-to-br from-neon-purple to-neon-cyan">你</AvatarFallback>
            </Avatar>
            <div className="flex-1 flex gap-2">
              <input
                type="text"
                placeholder="发表你的评论..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSubmitComment()}
                className="flex-1 rounded-lg border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <Button 
                size="sm" 
                onClick={handleSubmitComment}
                disabled={isSubmitting}
              >
                发表评论
              </Button>
            </div>
          </div>
        </div>
        <Separator />
        {/* Comments List */}
        {comments.length > 0 ? (
          <div className="space-y-4">
            {comments.map((comment) => (
              <div key={comment.id} className="flex gap-3">
                <Avatar>
                  <AvatarImage src={comment.user.avatar || undefined} />
                  <AvatarFallback className="bg-muted">
                    {comment.user.name?.[0] || "U"}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium text-sm">{comment.user.name || "匿名用户"}</span>
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-3 w-3 ${
                            i < comment.rating ? "text-neon-gold fill-neon-gold" : "text-muted"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-xs text-muted-foreground">{formatTimeAgo(comment.createdAt)}</span>
                  </div>
                  <p className="text-sm">{comment.content}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            <MessageSquare className="h-12 w-12 mx-auto mb-2 opacity-50" />
            <p>暂无评论，快来发表第一条评论吧！</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
