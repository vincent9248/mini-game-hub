import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { verifyAdminToken } from "@/lib/admin-auth"

// 获取单个分类
export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params

    const category = await prisma.category.findUnique({
      where: { id },
      include: {
        _count: {
          select: { games: true },
        },
      },
    })

    if (!category) {
      return NextResponse.json({ error: "分类不存在" }, { status: 404 })
    }

    return NextResponse.json({
      ...category,
      gameCount: category._count.games,
    })
  } catch (error) {
    console.error("Get category error:", error)
    return NextResponse.json({ error: "获取分类失败" }, { status: 500 })
  }
}

// 更新分类
export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    // 验证管理员身份
    const admin = await verifyAdminToken(request)
    if (!admin) {
      return NextResponse.json({ error: "未授权" }, { status: 401 })
    }

    const { id } = await params
    const body = await request.json()
    const { name, slug, description, icon, order } = body

    // 检查分类是否存在
    const existingCategory = await prisma.category.findUnique({
      where: { id },
    })
    if (!existingCategory) {
      return NextResponse.json({ error: "分类不存在" }, { status: 404 })
    }

    // 如果更新 slug，检查是否重复
    if (slug && slug !== existingCategory.slug) {
      const slugExists = await prisma.category.findUnique({
        where: { slug },
      })
      if (slugExists) {
        return NextResponse.json({ error: "Slug 已存在" }, { status: 400 })
      }
    }

    // 如果更新名称，检查是否重复
    if (name && name !== existingCategory.name) {
      const nameExists = await prisma.category.findUnique({
        where: { name },
      })
      if (nameExists) {
        return NextResponse.json({ error: "分类名称已存在" }, { status: 400 })
      }
    }

    // 更新分类
    const category = await prisma.category.update({
      where: { id },
      data: {
        name: name ?? existingCategory.name,
        slug: slug ?? existingCategory.slug,
        description: description !== undefined ? description : existingCategory.description,
        icon: icon !== undefined ? icon : existingCategory.icon,
        order: order !== undefined ? order : existingCategory.order,
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
    })
  } catch (error) {
    console.error("Update category error:", error)
    return NextResponse.json({ error: "更新分类失败" }, { status: 500 })
  }
}

// 删除分类
export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    // 验证管理员身份
    const admin = await verifyAdminToken(request)
    if (!admin) {
      return NextResponse.json({ error: "未授权" }, { status: 401 })
    }

    const { id } = await params

    // 检查分类是否存在
    const existingCategory = await prisma.category.findUnique({
      where: { id },
      include: {
        _count: {
          select: { games: true },
        },
      },
    })
    if (!existingCategory) {
      return NextResponse.json({ error: "分类不存在" }, { status: 404 })
    }

    // 检查是否有游戏关联此分类
    if (existingCategory._count.games > 0) {
      return NextResponse.json({ 
        error: `无法删除，该分类下还有 ${existingCategory._count.games} 个游戏` 
      }, { status: 400 })
    }

    // 删除分类
    await prisma.category.delete({
      where: { id },
    })

    return NextResponse.json({ success: true, message: "分类已删除" })
  } catch (error) {
    console.error("Delete category error:", error)
    return NextResponse.json({ error: "删除分类失败" }, { status: 500 })
  }
}
