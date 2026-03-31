import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"

// GET /api/comments - 获取评论列表
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const gameId = searchParams.get("gameId")
    const page = parseInt(searchParams.get("page") || "1")
    const limit = parseInt(searchParams.get("limit") || "20")

    const where: any = {}
    if (gameId) {
      where.gameId = gameId
    }

    const [comments, total] = await Promise.all([
      prisma.comment.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
        include: {
          user: {
            select: { id: true, name: true, avatar: true },
          },
          game: {
            select: { id: true, title: true, coverImage: true },
          },
        },
      }),
      prisma.comment.count({ where }),
    ])

    return NextResponse.json({
      comments,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error("Error fetching comments:", error)
    return NextResponse.json(
      { error: "获取评论列表失败" },
      { status: 500 }
    )
  }
}

// POST /api/comments - 创建评论
export async function POST(request: Request) {
  try {
    const session = await auth()
    if (!session || !session.user) {
      return NextResponse.json({ error: "请先登录" }, { status: 401 })
    }

    const userId = (session.user as any).id
    const body = await request.json()
    const { gameId, content, rating } = body

    if (!gameId || !content) {
      return NextResponse.json(
        { error: "游戏ID和评论内容不能为空" },
        { status: 400 }
      )
    }

    if (rating && (rating < 1 || rating > 5)) {
      return NextResponse.json(
        { error: "评分必须在1-5之间" },
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

    // 检查用户是否已经评论过该游戏
    const existingComment = await prisma.comment.findFirst({
      where: {
        userId,
        gameId,
      },
    })

    if (existingComment) {
      // 更新评论
      const comment = await prisma.comment.update({
        where: { id: existingComment.id },
        data: {
          content,
          rating: rating || existingComment.rating,
        },
        include: {
          user: {
            select: { id: true, name: true, avatar: true },
          },
        },
      })
      return NextResponse.json(comment)
    }

    // 创建新评论
    const comment = await prisma.comment.create({
      data: {
        content,
        rating: rating || 5,
        userId,
        gameId,
      },
      include: {
        user: {
          select: { id: true, name: true, avatar: true },
        },
      },
    })

    return NextResponse.json(comment, { status: 201 })
  } catch (error) {
    console.error("Error creating comment:", error)
    return NextResponse.json(
      { error: "创建评论失败" },
      { status: 500 }
    )
  }
}
