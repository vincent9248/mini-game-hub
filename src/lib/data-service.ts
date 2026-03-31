import { prisma } from "@/lib/prisma"

// 获取所有分类
export async function getCategories() {
  return prisma.category.findMany({
    orderBy: { order: "asc" },
    include: {
      _count: {
        select: { games: { where: { isPublished: true } } },
      },
    },
  })
}

// 获取分类详情
export async function getCategoryBySlug(slug: string) {
  return prisma.category.findUnique({
    where: { slug },
    include: {
      _count: {
        select: { games: { where: { isPublished: true } } },
      },
    },
  })
}

// 获取游戏列表
export async function getGames(options?: {
  categoryId?: string
  categorySlug?: string
  isHot?: boolean
  isPublished?: boolean
  limit?: number
  offset?: number
  orderBy?: "newest" | "popular" | "rating"
  search?: string
}) {
  const {
    categoryId,
    categorySlug,
    isHot,
    isPublished = true,
    limit,
    offset = 0,
    orderBy = "newest",
    search,
  } = options || {}

  let category: { id: string } | null = null
  if (categorySlug) {
    category = await prisma.category.findUnique({
      where: { slug: categorySlug },
      select: { id: true },
    })
  }

  const where = {
    ...(categoryId || category?.id ? { categoryId: categoryId || category?.id } : {}),
    ...(isHot !== undefined ? { isHot } : {}),
    ...(isPublished !== undefined ? { isPublished } : {}),
    ...(search
      ? {
          OR: [
            { title: { contains: search, mode: "insensitive" as const } },
            { description: { contains: search, mode: "insensitive" as const } },
          ],
        }
      : {}),
  }

  const orderByClause =
    orderBy === "popular"
      ? { playCount: "desc" as const }
      : orderBy === "rating"
      ? { comments: { _count: "desc" as const } }
      : { createdAt: "desc" as const }

  const [games, total] = await Promise.all([
    prisma.game.findMany({
      where,
      include: {
        category: true,
        _count: {
          select: { comments: true, favorites: true },
        },
      },
      orderBy: orderByClause,
      ...(limit ? { take: limit } : {}),
      skip: offset,
    }),
    prisma.game.count({ where }),
  ])

  // 计算平均评分
  const gamesWithRating = await Promise.all(
    games.map(async (game) => {
      const comments = await prisma.comment.findMany({
        where: { gameId: game.id },
        select: { rating: true },
      })
      const avgRating =
        comments.length > 0
          ? comments.reduce((sum, c) => sum + c.rating, 0) / comments.length
          : 0
      return {
        ...game,
        avgRating: Math.round(avgRating * 10) / 10,
      }
    })
  )

  return { games: gamesWithRating, total }
}

// 获取游戏详情
export async function getGameBySlug(slug: string) {
  const game = await prisma.game.findUnique({
    where: { slug },
    include: {
      category: true,
      comments: {
        include: {
          user: {
            select: { id: true, name: true, avatar: true },
          },
        },
        orderBy: { createdAt: "desc" },
        take: 10,
      },
      _count: {
        select: { comments: true, favorites: true },
      },
    },
  })

  if (!game) return null

  // 计算平均评分
  const comments = await prisma.comment.findMany({
    where: { gameId: game.id },
    select: { rating: true },
  })
  const avgRating =
    comments.length > 0
      ? comments.reduce((sum, c) => sum + c.rating, 0) / comments.length
      : 0

  return {
    ...game,
    avgRating: Math.round(avgRating * 10) / 10,
  }
}

// 获取热门游戏
export async function getHotGames(limit = 6) {
  const games = await prisma.game.findMany({
    where: { isHot: true, isPublished: true },
    include: { category: true },
    orderBy: { playCount: "desc" },
    take: limit,
  })

  return Promise.all(
    games.map(async (game) => {
      const comments = await prisma.comment.findMany({
        where: { gameId: game.id },
        select: { rating: true },
      })
      const avgRating =
        comments.length > 0
          ? comments.reduce((sum, c) => sum + c.rating, 0) / comments.length
          : 0
      return { ...game, avgRating: Math.round(avgRating * 10) / 10 }
    })
  )
}

// 获取最新游戏
export async function getNewGames(limit = 4) {
  const games = await prisma.game.findMany({
    where: { isPublished: true },
    include: { category: true },
    orderBy: { createdAt: "desc" },
    take: limit,
  })

  return Promise.all(
    games.map(async (game) => {
      const comments = await prisma.comment.findMany({
        where: { gameId: game.id },
        select: { rating: true },
      })
      const avgRating =
        comments.length > 0
          ? comments.reduce((sum, c) => sum + c.rating, 0) / comments.length
          : 0
      return { ...game, avgRating: Math.round(avgRating * 10) / 10 }
    })
  )
}

// 获取统计数据
export async function getStats() {
  const [games, users, comments, favorites] = await Promise.all([
    prisma.game.count({ where: { isPublished: true } }),
    prisma.user.count(),
    prisma.comment.count(),
    prisma.favorite.count(),
  ])

  // 获取今日游玩次数 (模拟)
  const todayPlays = await prisma.game.aggregate({
    _sum: { playCount: true },
    where: { isPublished: true },
  })

  return {
    totalGames: games,
    totalUsers: users,
    totalComments: comments,
    totalFavorites: favorites,
    todayPlays: Math.floor((todayPlays._sum.playCount || 0) / 30), // 模拟日活
  }
}

// 搜索游戏
export async function searchGames(query: string, limit = 10) {
  return prisma.game.findMany({
    where: {
      isPublished: true,
      OR: [
        { title: { contains: query, mode: "insensitive" } },
        { description: { contains: query, mode: "insensitive" } },
      ],
    },
    include: { category: true },
    take: limit,
  })
}

// 增加游玩次数
export async function incrementPlayCount(gameId: string) {
  return prisma.game.update({
    where: { id: gameId },
    data: { playCount: { increment: 1 } },
  })
}
