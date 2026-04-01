import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"

// 切换收藏状态
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    
    if (!session || !session.user) {
      return NextResponse.json({ error: "请先登录" }, { status: 401 })
    }

    const { id } = await params
    const userId = (session.user as any).id

    // 检查游戏是否存在
    const game = await prisma.game.findUnique({
      where: { id },
    })

    if (!game) {
      return NextResponse.json({ error: "游戏不存在" }, { status: 404 })
    }

    // 检查是否已收藏
    const existingFavorite = await prisma.favorite.findUnique({
      where: {
        userId_gameId: {
          userId,
          gameId: id,
        },
      },
    })

    if (existingFavorite) {
      // 取消收藏
      await prisma.favorite.delete({
        where: { id: existingFavorite.id },
      })
      return NextResponse.json({ favorited: false })
    } else {
      // 添加收藏
      await prisma.favorite.create({
        data: {
          userId,
          gameId: id,
        },
      })
      return NextResponse.json({ favorited: true })
    }
  } catch (error) {
    console.error("Toggle favorite error:", error)
    return NextResponse.json({ error: "操作失败" }, { status: 500 })
  }
}

// 获取收藏状态
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    
    if (!session || !session.user) {
      return NextResponse.json({ favorited: false })
    }

    const { id } = await params
    const userId = (session.user as any).id

    const favorite = await prisma.favorite.findUnique({
      where: {
        userId_gameId: {
          userId,
          gameId: id,
        },
      },
    })

    return NextResponse.json({ favorited: !!favorite })
  } catch (error) {
    console.error("Get favorite status error:", error)
    return NextResponse.json({ favorited: false })
  }
}
