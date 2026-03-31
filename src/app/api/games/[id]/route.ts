import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { verifyAdminToken } from "@/lib/admin-auth"

// 获取单个游戏
export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params

    const game = await prisma.game.findUnique({
      where: { id },
      include: {
        category: {
          select: { id: true, name: true },
        },
        _count: {
          select: {
            comments: true,
            favorites: true,
          },
        },
      },
    })

    if (!game) {
      return NextResponse.json({ error: "游戏不存在" }, { status: 404 })
    }

    return NextResponse.json(game)
  } catch (error) {
    console.error("Get game error:", error)
    return NextResponse.json({ error: "获取游戏失败" }, { status: 500 })
  }
}

// 更新游戏
export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    // 验证管理员身份
    const admin = await verifyAdminToken(request)
    if (!admin) {
      return NextResponse.json({ error: "未授权" }, { status: 401 })
    }

    const { id } = await params
    const body = await request.json()
    const { title, slug, description, categoryId, gameType, gameFile, coverImage, isHot, isPublished } = body

    // 检查游戏是否存在
    const existingGame = await prisma.game.findUnique({
      where: { id },
    })
    if (!existingGame) {
      return NextResponse.json({ error: "游戏不存在" }, { status: 404 })
    }

    // 如果更新 slug，检查是否重复
    if (slug && slug !== existingGame.slug) {
      const slugExists = await prisma.game.findUnique({
        where: { slug },
      })
      if (slugExists) {
        return NextResponse.json({ error: "URL 别名已存在" }, { status: 400 })
      }
    }

    // 更新游戏
    const game = await prisma.game.update({
      where: { id },
      data: {
        title: title ?? existingGame.title,
        slug: slug ?? existingGame.slug,
        description: description !== undefined ? description : existingGame.description,
        categoryId: categoryId !== undefined ? categoryId || null : existingGame.categoryId,
        gameType: gameType ?? existingGame.gameType,
        gameFile: gameFile ?? existingGame.gameFile,
        coverImage: coverImage ?? existingGame.coverImage,
        isHot: isHot ?? existingGame.isHot,
        isPublished: isPublished ?? existingGame.isPublished,
      },
      include: {
        category: {
          select: { name: true },
        },
      },
    })

    return NextResponse.json(game)
  } catch (error) {
    console.error("Update game error:", error)
    return NextResponse.json({ error: "更新游戏失败" }, { status: 500 })
  }
}

// 删除游戏
export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    // 验证管理员身份
    const admin = await verifyAdminToken(request)
    if (!admin) {
      return NextResponse.json({ error: "未授权" }, { status: 401 })
    }

    const { id } = await params

    // 检查游戏是否存在
    const existingGame = await prisma.game.findUnique({
      where: { id },
    })
    if (!existingGame) {
      return NextResponse.json({ error: "游戏不存在" }, { status: 404 })
    }

    // 删除游戏（关联的评论和收藏会级联删除）
    await prisma.game.delete({
      where: { id },
    })

    return NextResponse.json({ success: true, message: "游戏已删除" })
  } catch (error) {
    console.error("Delete game error:", error)
    return NextResponse.json({ error: "删除游戏失败" }, { status: 500 })
  }
}

// 切换热门状态
export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    // 验证管理员身份
    const admin = await verifyAdminToken(request)
    if (!admin) {
      return NextResponse.json({ error: "未授权" }, { status: 401 })
    }

    const { id } = await params
    const body = await request.json()
    const { action } = body

    const existingGame = await prisma.game.findUnique({
      where: { id },
    })
    if (!existingGame) {
      return NextResponse.json({ error: "游戏不存在" }, { status: 404 })
    }

    let updateData: Record<string, unknown> = {}

    switch (action) {
      case "toggleHot":
        updateData.isHot = !existingGame.isHot
        break
      case "togglePublished":
        updateData.isPublished = !existingGame.isPublished
        break
      default:
        return NextResponse.json({ error: "无效的操作" }, { status: 400 })
    }

    const game = await prisma.game.update({
      where: { id },
      data: updateData,
      include: {
        category: {
          select: { name: true },
        },
      },
    })

    return NextResponse.json(game)
  } catch (error) {
    console.error("Patch game error:", error)
    return NextResponse.json({ error: "操作失败" }, { status: 500 })
  }
}
