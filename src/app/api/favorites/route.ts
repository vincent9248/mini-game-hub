import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"

// GET /api/favorites - 获取用户收藏列表
export async function GET(request: Request) {
  try {
    const session = await auth()
    if (!session || !session.user) {
      return NextResponse.json({ error: "请先登录" }, { status: 401 })
    }

    const userId = (session.user as any).id
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get("page") || "1")
    const limit = parseInt(searchParams.get("limit") || "20")

    const [favorites, total] = await Promise.all([
      prisma.favorite.findMany({
        where: { userId },
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
        include: {
          game: {
            include: {
              category: true,
              _count: {
                select: { comments: true },
              },
            },
          },
        },
      }),
      prisma.favorite.count({
        where: { userId },
      }),
    ])

    return NextResponse.json({
      favorites: favorites.map((f) => f.game),
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error("Error fetching favorites:", error)
    return NextResponse.json(
      { error: "获取收藏列表失败" },
      { status: 500 }
    )
  }
}

// POST /api/favorites - 添加/取消收藏
export async function POST(request: Request) {
  try {
    const session = await auth()
    if (!session || !session.user) {
      return NextResponse.json({ error: "请先登录" }, { status: 401 })
    }

    const userId = (session.user as any).id
    const body = await request.json()
    const { gameId } = body

    if (!gameId) {
      return NextResponse.json(
        { error: "游戏ID不能为空" },
        { status: 400 }
      )
    }

    // 检查游戏是否存在
    const game = await prisma.game.findUnique({
      where: { id: gameId },
    })

    if (!game) {
      return NextResponse.json({ error: "游戏不存在" }, { status: 404 })
    }

    // 检查是否已经收藏
    const existing = await prisma.favorite.findUnique({
      where: {
        userId_gameId: {
          userId,
          gameId,
        },
      },
    })

    if (existing) {
      // 取消收藏
      await prisma.favorite.delete({
        where: { id: existing.id },
      })
      return NextResponse.json({ message: "已取消收藏", isFavorite: false })
    }

    // 添加收藏
    await prisma.favorite.create({
      data: {
        userId,
        gameId,
      },
    })

    return NextResponse.json({ message: "收藏成功", isFavorite: true })
  } catch (error) {
    console.error("Error toggling favorite:", error)
    return NextResponse.json(
      { error: "操作失败" },
      { status: 500 }
    )
  }
}
