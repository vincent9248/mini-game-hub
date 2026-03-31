import { NextRequest, NextResponse } from "next/server"
import { getGames, getHotGames, getNewGames, searchGames } from "@/lib/data-service"
import { prisma } from "@/lib/prisma"
import { verifyAdminToken } from "@/lib/admin-auth"

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const category = searchParams.get("category")
    const hot = searchParams.get("hot")
    const new_ = searchParams.get("new")
    const q = searchParams.get("q")
    const limit = searchParams.get("limit")
    const offset = searchParams.get("offset")
    const orderBy = searchParams.get("orderBy") as "newest" | "popular" | "rating" | null

    // 搜索
    if (q) {
      const games = await searchGames(q, limit ? parseInt(limit) : 10)
      return NextResponse.json(games)
    }

    // 热门游戏
    if (hot === "true") {
      const games = await getHotGames(limit ? parseInt(limit) : 6)
      return NextResponse.json(games)
    }

    // 最新游戏
    if (new_ === "true") {
      const games = await getNewGames(limit ? parseInt(limit) : 4)
      return NextResponse.json(games)
    }

    // 游戏列表
    const result = await getGames({
      categorySlug: category || undefined,
      limit: limit ? parseInt(limit) : undefined,
      offset: offset ? parseInt(offset) : 0,
      orderBy: orderBy || "newest",
    })

    return NextResponse.json(result)
  } catch (error) {
    console.error("Get games error:", error)
    return NextResponse.json({ error: "获取游戏失败" }, { status: 500 })
  }
}

// 创建游戏
export async function POST(request: NextRequest) {
  try {
    // 验证管理员身份
    const admin = await verifyAdminToken(request)
    if (!admin) {
      return NextResponse.json({ error: "未授权" }, { status: 401 })
    }

    const body = await request.json()
    const { title, slug, description, categoryId, gameType, gameFile, coverImage, isHot, isPublished } = body

    // 验证必填字段
    if (!title || !slug || !gameFile) {
      return NextResponse.json({ error: "缺少必填字段" }, { status: 400 })
    }

    // 检查 slug 是否已存在
    const existingGame = await prisma.game.findUnique({
      where: { slug },
    })
    if (existingGame) {
      return NextResponse.json({ error: "URL 别名已存在" }, { status: 400 })
    }

    // 创建游戏
    const game = await prisma.game.create({
      data: {
        title,
        slug,
        description: description || null,
        categoryId: categoryId || null,
        gameType: gameType || "html5",
        gameFile,
        coverImage: coverImage || "/images/default-cover.jpg",
        isHot: isHot || false,
        isPublished: isPublished !== undefined ? isPublished : true,
      },
      include: {
        category: {
          select: { name: true },
        },
      },
    })

    return NextResponse.json(game, { status: 201 })
  } catch (error) {
    console.error("Create game error:", error)
    return NextResponse.json({ error: "创建游戏失败" }, { status: 500 })
  }
}
