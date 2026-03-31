import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { verifyAdminToken } from "@/lib/admin-auth"

// 获取单个用户详情
export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const admin = await verifyAdminToken(request)
    if (!admin) {
      return NextResponse.json({ error: "未授权" }, { status: 401 })
    }

    const { id } = await params

    const user = await prisma.user.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            comments: true,
            favorites: true,
          },
        },
      },
    })

    if (!user) {
      return NextResponse.json({ error: "用户不存在" }, { status: 404 })
    }

    return NextResponse.json({
      id: user.id,
      name: user.name || "未设置",
      email: user.email,
      avatar: user.avatar,
      role: user.role,
      isActive: user.isActive,
      gameCount: user._count.favorites,
      commentCount: user._count.comments,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    })
  } catch (error) {
    console.error("Get user error:", error)
    return NextResponse.json({ error: "获取用户详情失败" }, { status: 500 })
  }
}

// 更新用户状态
export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const admin = await verifyAdminToken(request)
    if (!admin) {
      return NextResponse.json({ error: "未授权" }, { status: 401 })
    }

    const { id } = await params
    const body = await request.json()
    const { action } = body

    // 检查用户是否存在
    const existingUser = await prisma.user.findUnique({
      where: { id },
    })
    if (!existingUser) {
      return NextResponse.json({ error: "用户不存在" }, { status: 404 })
    }

    let updateData: Record<string, unknown> = {}

    switch (action) {
      case "toggleActive":
        updateData.isActive = !existingUser.isActive
        break
      default:
        return NextResponse.json({ error: "无效的操作" }, { status: 400 })
    }

    const user = await prisma.user.update({
      where: { id },
      data: updateData,
      include: {
        _count: {
          select: {
            comments: true,
            favorites: true,
          },
        },
      },
    })

    return NextResponse.json({
      id: user.id,
      name: user.name || "未设置",
      email: user.email,
      avatar: user.avatar,
      role: user.role,
      isActive: user.isActive,
      gameCount: user._count.favorites,
      commentCount: user._count.comments,
    })
  } catch (error) {
    console.error("Update user error:", error)
    return NextResponse.json({ error: "更新用户失败" }, { status: 500 })
  }
}

// 删除用户
export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const admin = await verifyAdminToken(request)
    if (!admin) {
      return NextResponse.json({ error: "未授权" }, { status: 401 })
    }

    const { id } = await params

    // 检查用户是否存在
    const existingUser = await prisma.user.findUnique({
      where: { id },
    })
    if (!existingUser) {
      return NextResponse.json({ error: "用户不存在" }, { status: 404 })
    }

    // 删除用户（关联的评论和收藏会级联删除）
    await prisma.user.delete({
      where: { id },
    })

    return NextResponse.json({ success: true, message: "用户已删除" })
  } catch (error) {
    console.error("Delete user error:", error)
    return NextResponse.json({ error: "删除用户失败" }, { status: 500 })
  }
}
