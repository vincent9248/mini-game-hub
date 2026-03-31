import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { verifyAdminToken } from "@/lib/admin-auth"

// 获取用户列表
export async function GET(request: NextRequest) {
  try {
    // 验证管理员身份
    const admin = await verifyAdminToken(request)
    if (!admin) {
      return NextResponse.json({ error: "未授权" }, { status: 401 })
    }

    const searchParams = request.nextUrl.searchParams
    const search = searchParams.get("search") || ""
    const status = searchParams.get("status") || "all"
    const role = searchParams.get("role") || "all"
    const limit = parseInt(searchParams.get("limit") || "50")
    const offset = parseInt(searchParams.get("offset") || "0")

    // 构建 where 条件
    const where: Record<string, unknown> = {}

    // 搜索条件
    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { email: { contains: search, mode: "insensitive" } },
      ]
    }

    // 状态筛选
    if (status === "active") {
      where.isActive = true
    } else if (status === "banned") {
      where.isActive = false
    }

    // 角色筛选
    if (role === "admin") {
      where.role = "ADMIN"
    } else if (role === "user") {
      where.role = "USER"
    }

    // 查询用户列表和总数
    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        include: {
          _count: {
            select: {
              comments: true,
              favorites: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
        take: limit,
        skip: offset,
      }),
      prisma.user.count({ where }),
    ])

    // 统计数据
    const [totalUsers, activeUsers, bannedUsers, adminUsers] = await Promise.all([
      prisma.user.count(),
      prisma.user.count({ where: { isActive: true } }),
      prisma.user.count({ where: { isActive: false } }),
      prisma.user.count({ where: { role: "ADMIN" } }),
    ])

    // 转换数据格式
    const result = users.map((user) => ({
      id: user.id,
      name: user.name || "未设置",
      email: user.email,
      avatar: user.avatar,
      role: user.role,
      isActive: user.isActive,
      gameCount: user._count.favorites,
      commentCount: user._count.comments,
      createdAt: user.createdAt.toISOString().split("T")[0],
    }))

    return NextResponse.json({
      users: result,
      total,
      stats: {
        total: totalUsers,
        active: activeUsers,
        banned: bannedUsers,
        admins: adminUsers,
      },
    })
  } catch (error) {
    console.error("Get users error:", error)
    return NextResponse.json({ error: "获取用户列表失败" }, { status: 500 })
  }
}
