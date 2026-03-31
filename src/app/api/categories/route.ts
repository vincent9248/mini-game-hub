import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { verifyAdminToken } from "@/lib/admin-auth"
import { NextRequest } from "next/server"

export async function GET() {
  try {
    // 直接查询数据库，统计所有游戏数量（包括未发布的）
    const categories = await prisma.category.findMany({
      orderBy: { order: "asc" },
      include: {
        _count: {
          select: { games: true }, // 统计所有游戏，不限制 isPublished
        },
      },
    })

    // 转换数据格式，将 _count.games 转换为 gameCount
    const result = categories.map((cat) => ({
      id: cat.id,
      name: cat.name,
      slug: cat.slug,
      description: cat.description,
      icon: cat.icon,
      order: cat.order,
      createdAt: cat.createdAt,
      updatedAt: cat.updatedAt,
      gameCount: cat._count.games,
    }))

    return NextResponse.json(result)
  } catch (error) {
    console.error("Get categories error:", error)
    return NextResponse.json({ error: "获取分类失败" }, { status: 500 })
  }
}

// 创建分类
export async function POST(request: NextRequest) {
  try {
    // 验证管理员身份
    const admin = await verifyAdminToken(request)
    if (!admin) {
      return NextResponse.json({ error: "未授权" }, { status: 401 })
    }

    const body = await request.json()
    const { name, slug, description, icon, order } = body

    // 验证必填字段
    if (!name || !slug) {
      return NextResponse.json({ error: "分类名称和 Slug 为必填项" }, { status: 400 })
    }

    // 检查 slug 是否已存在
    const existingCategory = await prisma.category.findUnique({
      where: { slug },
    })
    if (existingCategory) {
      return NextResponse.json({ error: "Slug 已存在" }, { status: 400 })
    }

    // 检查名称是否已存在
    const existingName = await prisma.category.findUnique({
      where: { name },
    })
    if (existingName) {
      return NextResponse.json({ error: "分类名称已存在" }, { status: 400 })
    }

    // 创建分类
    const category = await prisma.category.create({
      data: {
        name,
        slug,
        description: description || null,
        icon: icon || null,
        order: order || 0,
      },
      include: {
        _count: {
          select: { games: true },
        },
      },
    })

    return NextResponse.json({
      ...category,
      gameCount: category._count.games,
    }, { status: 201 })
  } catch (error) {
    console.error("Create category error:", error)
    return NextResponse.json({ error: "创建分类失败" }, { status: 500 })
  }
}
