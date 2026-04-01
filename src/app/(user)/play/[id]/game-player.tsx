"use client"

import { useState, useRef, useEffect } from "react"
import { Maximize, Minimize, Play, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface GamePlayerProps {
  gameFile: string
  title: string
  coverImage?: string | null
  gameId: string
}

export function GamePlayer({ gameFile, title, coverImage, gameId }: GamePlayerProps) {
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [showControls, setShowControls] = useState(true)
  const [hasRecordedPlay, setHasRecordedPlay] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  // 全屏切换
  const toggleFullscreen = async () => {
    if (!containerRef.current) return

    try {
      if (!isFullscreen) {
        // 进入全屏
        if (containerRef.current.requestFullscreen) {
          await containerRef.current.requestFullscreen()
        } else if ((containerRef.current as any).webkitRequestFullscreen) {
          await (containerRef.current as any).webkitRequestFullscreen()
        } else if ((containerRef.current as any).msRequestFullscreen) {
          await (containerRef.current as any).msRequestFullscreen()
        }
      } else {
        // 退出全屏
        if (document.exitFullscreen) {
          await document.exitFullscreen()
        } else if ((document as any).webkitExitFullscreen) {
          await (document as any).webkitExitFullscreen()
        } else if ((document as any).msExitFullscreen) {
          await (document as any).msExitFullscreen()
        }
      }
    } catch (error) {
      console.error("全屏切换失败:", error)
    }
  }

  // 监听全屏状态变化
  useEffect(() => {
    const handleFullscreenChange = () => {
      const fullscreenElement =
        document.fullscreenElement ||
        (document as any).webkitFullscreenElement ||
        (document as any).msFullscreenElement

      setIsFullscreen(!!fullscreenElement)
    }

    document.addEventListener("fullscreenchange", handleFullscreenChange)
    document.addEventListener("webkitfullscreenchange", handleFullscreenChange)
    document.addEventListener("msfullscreenchange", handleFullscreenChange)

    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange)
      document.removeEventListener("webkitfullscreenchange", handleFullscreenChange)
      document.removeEventListener("msfullscreenchange", handleFullscreenChange)
    }
  }, [])

  // 自动隐藏控制栏（仅全屏时）
  useEffect(() => {
    if (isPlaying && isFullscreen) {
      controlsTimeoutRef.current = setTimeout(() => {
        setShowControls(false)
      }, 3000)
    }

    return () => {
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current)
      }
    }
  }, [isPlaying, isFullscreen, showControls])

  // 鼠标移动显示控制栏
  const handleMouseMove = () => {
    setShowControls(true)
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current)
    }
  }

  // 开始游戏
  const handlePlay = async () => {
    setIsPlaying(true)
    setIsLoading(true)
    
    // 记录游玩次数（每个会话只记录一次）
    if (!hasRecordedPlay) {
      try {
        await fetch(`/api/games/${gameId}/play`, {
          method: "POST",
        })
        setHasRecordedPlay(true)
      } catch (error) {
        console.error("记录游玩次数失败:", error)
      }
    }
  }

  // 刷新游戏
  const handleRefresh = () => {
    if (iframeRef.current) {
      setIsLoading(true)
      iframeRef.current.src = gameFile
    }
  }

  // iframe 加载完成
  const handleIframeLoad = () => {
    setIsLoading(false)
  }

  // ESC 键退出全屏
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isFullscreen) {
        toggleFullscreen()
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [isFullscreen])

  return (
    <div
      ref={containerRef}
      className={cn(
        "relative bg-gradient-to-br from-neon-purple/20 to-neon-cyan/20 rounded-lg overflow-hidden",
        isFullscreen
          ? "fixed inset-0 z-50 w-screen h-screen rounded-none"
          : "w-full"
      )}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => isFullscreen && setShowControls(false)}
    >
      {/* 游戏开始界面 */}
      {!isPlaying && (
        <div className="w-full h-[400px] md:h-[500px] lg:h-[600px] flex flex-col items-center justify-center bg-gradient-to-br from-neon-purple/30 to-neon-cyan/30">
          {coverImage ? (
            <img
              src={coverImage}
              alt={title}
              className="w-24 h-24 md:w-32 md:h-32 lg:w-40 lg:h-40 rounded-2xl object-cover mb-4 md:mb-6 shadow-2xl"
            />
          ) : (
            <div className="text-5xl md:text-6xl lg:text-7xl mb-4 md:mb-6">🎮</div>
          )}
          <h2 className="text-lg md:text-xl lg:text-2xl font-bold mb-4 md:mb-6 text-center px-4 max-w-md">
            {title}
          </h2>
          <Button
            size="lg"
            onClick={handlePlay}
            className="bg-gradient-to-r from-neon-purple to-neon-cyan hover:opacity-90 transition-opacity text-base md:text-lg px-6 md:px-8 py-4 md:py-6"
          >
            <Play className="mr-2 h-4 w-4 md:h-5 md:w-5" />
            开始游戏
          </Button>
        </div>
      )}

      {/* 游戏iframe */}
      {isPlaying && (
        <div 
          className={cn(
            "w-full",
            isFullscreen ? "h-full" : "h-[400px] md:h-[500px] lg:h-[600px]"
          )}
        >
          <iframe
            ref={iframeRef}
            src={gameFile}
            className="w-full h-full border-0"
            title={title}
            allow="fullscreen; autoplay; gamepad"
            allowFullScreen
            onLoad={handleIframeLoad}
          />
        </div>
      )}

      {/* 加载状态 */}
      {isPlaying && isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-background/80 z-20">
          <div className="flex flex-col items-center gap-4">
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent" />
            <p className="text-sm text-muted-foreground">游戏加载中...</p>
          </div>
        </div>
      )}

      {/* 控制栏 - 非全屏时固定显示，全屏时自动隐藏 */}
      {isPlaying && !isLoading && (
        <div
          className={cn(
            "absolute bottom-0 left-0 right-0 py-2 px-3 md:px-4 transition-all duration-300",
            "bg-gradient-to-t from-black/90 to-transparent backdrop-blur-sm",
            isFullscreen
              ? showControls
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-full pointer-events-none"
              : "opacity-100"
          )}
        >
          <div className="flex items-center justify-between gap-2">
            {/* 左侧控制 */}
            <div className="flex items-center gap-1 md:gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleRefresh}
                className="text-white hover:bg-white/20 h-8 w-8 md:h-9 md:w-9"
                title="刷新游戏"
              >
                <RefreshCw className="h-4 w-4" />
              </Button>
            </div>

            {/* 中间信息 */}
            <div className="flex-1 text-center">
              <span className="text-white text-xs md:text-sm font-medium truncate block max-w-[120px] md:max-w-[200px] mx-auto">
                {title}
              </span>
            </div>

            {/* 右侧控制 */}
            <div className="flex items-center gap-1 md:gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleFullscreen}
                className="text-white hover:bg-white/20 h-8 w-8 md:h-9 md:w-9"
                title={isFullscreen ? "退出全屏" : "全屏"}
              >
                {isFullscreen ? (
                  <Minimize className="h-4 w-4" />
                ) : (
                  <Maximize className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* 全屏时显示提示 */}
      {isFullscreen && showControls && isPlaying && !isLoading && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 text-white/80 text-xs md:text-sm bg-black/60 backdrop-blur-sm px-4 py-2 rounded-full z-30">
          按 ESC 键退出全屏
        </div>
      )}
    </div>
  )
}
