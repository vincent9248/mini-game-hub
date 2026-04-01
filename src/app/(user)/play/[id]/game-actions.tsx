"use client"

import { useState, useEffect } from "react"
import { Heart, Share2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"

interface GameActionsProps {
  gameId: string
}

export function GameActions({ gameId }: GameActionsProps) {
  const { toast } = useToast()
  const [isFavorited, setIsFavorited] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isCheckingFavorite, setIsCheckingFavorite] = useState(true)

  // 获取初始收藏状态
  useEffect(() => {
    const checkFavoriteStatus = async () => {
      try {
        const response = await fetch(`/api/games/${gameId}/favorite`)
        if (response.ok) {
          const data = await response.json()
          setIsFavorited(data.favorited)
        }
      } catch (error) {
        console.error("获取收藏状态失败:", error)
      } finally {
        setIsCheckingFavorite(false)
      }
    }

    checkFavoriteStatus()
  }, [gameId])

  const handleFavorite = async () => {
    setIsLoading(true)
    try {
      const response = await fetch(`/api/games/${gameId}/favorite`, {
        method: "POST",
      })

      if (response.ok) {
        const data = await response.json()
        setIsFavorited(data.favorited)
        toast({
          title: data.favorited ? "收藏成功" : "已取消收藏",
          description: data.favorited ? "游戏已添加到收藏夹" : "游戏已从收藏夹移除",
        })
      } else {
        const data = await response.json()
        toast({
          title: "操作失败",
          description: data.error || "请先登录",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "操作失败",
        description: "网络错误，请稍后重试",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleShare = async () => {
    const url = window.location.href
    const title = document.title

    if (navigator.share) {
      try {
        await navigator.share({
          title,
          url,
        })
      } catch (error) {
        // 用户取消分享
      }
    } else {
      await navigator.clipboard.writeText(url)
      toast({
        title: "链接已复制",
        description: "游戏链接已复制到剪贴板",
      })
    }
  }

  return (
    <div className="flex gap-2">
      <Button
        variant="outline"
        size="icon"
        onClick={handleFavorite}
        disabled={isLoading || isCheckingFavorite}
        className={isFavorited ? "text-red-500 hover:text-red-600 border-red-500/50" : ""}
        title={isFavorited ? "取消收藏" : "收藏游戏"}
      >
        <Heart className={`h-4 w-4 ${isFavorited ? "fill-current" : ""}`} />
      </Button>
      <Button variant="outline" size="icon" onClick={handleShare} title="分享游戏">
        <Share2 className="h-4 w-4" />
      </Button>
    </div>
  )
}
