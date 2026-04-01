import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"

// 获取游戏评论
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const comments = await prisma.comment.findMany({
      where: { gameId: id },
      include: {
        user: {
          select: { id: true, name: true, avatar: true },
        },
      },
      orderBy: { createdAt: "desc" },
      take: 20,
    })

    return NextResponse.json(comments)
  } catch (error) {
    console.error("Get comments error:", error)
    return NextResponse.json({ error: "获取评论失败" }, { status: 500 })
  }
}

// 创建评论
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
    const body = await request.json()
    const { content, rating } = body

    if (!content || content.trim().length === 0) {
      return NextResponse.json({ error: "评论内容不能为空" }, { status: 400 })
    }

    if (!rating || rating < 1 || rating > 5) {
      return NextResponse.json({ error: "请选择评分" }, { status: 400 })
    }

    // 检查游戏是否存在
    const game = await prisma.game.findUnique({
      where: { id },
    })

    if (!game) {
      return NextResponse.json({ error: "游戏不存在" }, { status: 404 })
    }

    // 创建评论
    const comment = await prisma.comment.create({
      data: {
        content: content.trim(),
        rating,
        gameId: id,
        userId: (session.user as any).id,
      },
      include: {
        user: {
          select: { id: true, name: true, avatar: true },
        },
      },
    })

    return NextResponse.json(comment, { status: 201 })
  } catch (error) {
    console.error("Create comment error:", error)
    return NextResponse.json({ error: "发表评论失败" }, { status: 500 })
  }
}
