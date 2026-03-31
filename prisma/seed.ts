import { PrismaClient } from "@prisma/client"
import bcrypt from "bcryptjs"

const prisma = new PrismaClient()

async function main() {
  console.log("🌱 开始填充数据库...")

  // 清空现有数据
  await prisma.comment.deleteMany()
  await prisma.favorite.deleteMany()
  await prisma.game.deleteMany()
  await prisma.category.deleteMany()
  await prisma.user.deleteMany()
  console.log("✅ 清空现有数据")

  // 1. 创建分类
  const categories = await Promise.all([
    prisma.category.create({
      data: {
        name: "动作游戏",
        slug: "action",
        description: "紧张刺激的动作游戏，考验你的反应速度",
        icon: "🎮",
        order: 1,
      },
    }),
    prisma.category.create({
      data: {
        name: "益智游戏",
        slug: "puzzle",
        description: "烧脑益智游戏，锻炼你的思维能力",
        icon: "🧩",
        order: 2,
      },
    }),
    prisma.category.create({
      data: {
        name: "射击游戏",
        slug: "shooter",
        description: "精准射击游戏，展现你的瞄准技巧",
        icon: "🎯",
        order: 3,
      },
    }),
    prisma.category.create({
      data: {
        name: "策略游戏",
        slug: "strategy",
        description: "策略对战游戏，运筹帷幄决胜千里",
        icon: "♟️",
        order: 4,
      },
    }),
    prisma.category.create({
      data: {
        name: "休闲游戏",
        slug: "casual",
        description: "轻松休闲游戏，放松身心的好选择",
        icon: "🍭",
        order: 5,
      },
    }),
    prisma.category.create({
      data: {
        name: "赛车游戏",
        slug: "racing",
        description: "极速赛车游戏，体验速度与激情",
        icon: "🏎️",
        order: 6,
      },
    }),
  ])
  console.log(`✅ 创建 ${categories.length} 个分类`)

  // 2. 创建测试用户
  const hashedPassword = await bcrypt.hash("password123", 10)
  const users = await Promise.all([
    prisma.user.create({
      data: {
        email: "player1@example.com",
        password: hashedPassword,
        name: "游戏玩家1",
        avatar: null,
        role: "USER",
      },
    }),
    prisma.user.create({
      data: {
        email: "player2@example.com",
        password: hashedPassword,
        name: "游戏玩家2",
        avatar: null,
        role: "USER",
      },
    }),
    prisma.user.create({
      data: {
        email: "player3@example.com",
        password: hashedPassword,
        name: "游戏达人",
        avatar: null,
        role: "USER",
      },
    }),
  ])
  console.log(`✅ 创建 ${users.length} 个测试用户`)

  // 3. 创建游戏数据
  const gamesData = [
    {
      title: "像素射击",
      slug: "pixel-shooter",
      description: "一款经典的像素风格射击游戏。控制你的角色，消灭所有敌人，收集道具，提升等级。游戏支持多种武器和技能，让你的战斗更加精彩！",
      coverImage: "/games/covers/pixel-shooter.jpg",
      gameFile: "/games/files/pixel-shooter.html",
      gameType: "html5",
      categoryId: categories.find(c => c.slug === "shooter")!.id,
      playCount: 125300,
      isHot: true,
      isPublished: true,
    },
    {
      title: "糖果消消乐",
      slug: "candy-crush",
      description: "经典的三消益智游戏，通过交换糖果的位置，消除三个或更多相同的糖果，获得高分！超过1000个精彩关卡等你来挑战。",
      coverImage: "/games/covers/candy-crush.jpg",
      gameFile: "/games/files/candy-crush.html",
      gameType: "html5",
      categoryId: categories.find(c => c.slug === "puzzle")!.id,
      playCount: 256700,
      isHot: true,
      isPublished: true,
    },
    {
      title: "跑酷达人",
      slug: "parkour-runner",
      description: "刺激的跑酷游戏，在城市的高楼大厦间穿梭，躲避障碍，收集金币，挑战最高分！",
      coverImage: "/games/covers/parkour-runner.jpg",
      gameFile: "/games/files/parkour-runner.html",
      gameType: "html5",
      categoryId: categories.find(c => c.slug === "action")!.id,
      playCount: 189200,
      isHot: true,
      isPublished: true,
    },
    {
      title: "2048挑战",
      slug: "2048-challenge",
      description: "经典的2048数字游戏，通过滑动合并相同数字，挑战你的数学思维和策略能力！",
      coverImage: "/games/covers/2048.jpg",
      gameFile: "/games/files/2048.html",
      gameType: "html5",
      categoryId: categories.find(c => c.slug === "puzzle")!.id,
      playCount: 98500,
      isHot: false,
      isPublished: true,
    },
    {
      title: "植物大战僵尸",
      slug: "plants-vs-zombies",
      description: "经典的塔防策略游戏，种植各种植物，抵御僵尸的进攻，保卫你的家园！",
      coverImage: "/games/covers/pvz.jpg",
      gameFile: "/games/files/pvz.html",
      gameType: "html5",
      categoryId: categories.find(c => c.slug === "strategy")!.id,
      playCount: 312100,
      isHot: true,
      isPublished: true,
    },
    {
      title: "弹珠跳一跳",
      slug: "bounce-ball",
      description: "简单有趣的休闲游戏，控制弹珠跳跃，看看你能跳多远！",
      coverImage: "/games/covers/bounce.jpg",
      gameFile: "/games/files/bounce.html",
      gameType: "html5",
      categoryId: categories.find(c => c.slug === "casual")!.id,
      playCount: 76800,
      isHot: false,
      isPublished: true,
    },
    {
      title: "极速飞车",
      slug: "speed-racing",
      description: "3D赛车游戏，体验极速驾驶的快感，多款豪车任你选择！",
      coverImage: "/games/covers/racing.jpg",
      gameFile: "/games/files/racing.html",
      gameType: "html5",
      categoryId: categories.find(c => c.slug === "racing")!.id,
      playCount: 65200,
      isHot: false,
      isPublished: true,
    },
    {
      title: "俄罗斯方块",
      slug: "tetris",
      description: "经典俄罗斯方块游戏，简单规则，无限乐趣！",
      coverImage: "/games/covers/tetris.jpg",
      gameFile: "/games/files/tetris.html",
      gameType: "html5",
      categoryId: categories.find(c => c.slug === "puzzle")!.id,
      playCount: 201400,
      isHot: false,
      isPublished: true,
    },
    {
      title: "坦克大战",
      slug: "tank-battle",
      description: "经典坦克射击游戏，保护基地，消灭敌人！",
      coverImage: "/games/covers/tank.jpg",
      gameFile: "/games/files/tank.html",
      gameType: "html5",
      categoryId: categories.find(c => c.slug === "shooter")!.id,
      playCount: 156000,
      isHot: true,
      isPublished: true,
    },
    {
      title: "连连看",
      slug: "link-game",
      description: "经典连连看游戏，找出相同的图案进行消除，考验你的眼力！",
      coverImage: "/games/covers/link.jpg",
      gameFile: "/games/files/link.html",
      gameType: "html5",
      categoryId: categories.find(c => c.slug === "puzzle")!.id,
      playCount: 134500,
      isHot: false,
      isPublished: true,
    },
    {
      title: "愤怒的小鸟",
      slug: "angry-birds",
      description: "用弹弓发射小鸟，摧毁猪猪的防御工事！",
      coverImage: "/games/covers/angry-birds.jpg",
      gameFile: "/games/files/angry-birds.html",
      gameType: "html5",
      categoryId: categories.find(c => c.slug === "action")!.id,
      playCount: 278900,
      isHot: true,
      isPublished: true,
    },
    {
      title: "贪吃蛇",
      slug: "snake",
      description: "经典贪吃蛇游戏，控制小蛇吃食物变长，不要撞到墙壁和自己！",
      coverImage: "/games/covers/snake.jpg",
      gameFile: "/games/files/snake.html",
      gameType: "html5",
      categoryId: categories.find(c => c.slug === "casual")!.id,
      playCount: 89300,
      isHot: false,
      isPublished: true,
    },
  ]

  const games = await Promise.all(
    gamesData.map((game) => prisma.game.create({ data: game }))
  )
  console.log(`✅ 创建 ${games.length} 个游戏`)

  // 4. 创建评论
  const commentsData = [
    { userId: users[0].id, gameId: games[0].id, content: "太好玩了！根本停不下来！", rating: 5 },
    { userId: users[1].id, gameId: games[0].id, content: "画面很酷，玩法也不错", rating: 4 },
    { userId: users[2].id, gameId: games[1].id, content: "消消乐玩得停不下来", rating: 5 },
    { userId: users[0].id, gameId: games[2].id, content: "跑酷游戏做得很好！", rating: 5 },
    { userId: users[1].id, gameId: games[4].id, content: "经典的塔防游戏，很怀念", rating: 5 },
    { userId: users[2].id, gameId: games[4].id, content: "策略性很强，好玩", rating: 4 },
    { userId: users[0].id, gameId: games[7].id, content: "经典俄罗斯方块，好评！", rating: 5 },
    { userId: users[1].id, gameId: games[10].id, content: "愤怒的小鸟永远的神", rating: 5 },
  ]

  await Promise.all(
    commentsData.map((comment) => prisma.comment.create({ data: comment }))
  )
  console.log(`✅ 创建 ${commentsData.length} 条评论`)

  // 5. 创建收藏
  const favoritesData = [
    { userId: users[0].id, gameId: games[0].id },
    { userId: users[0].id, gameId: games[1].id },
    { userId: users[0].id, gameId: games[4].id },
    { userId: users[1].id, gameId: games[2].id },
    { userId: users[1].id, gameId: games[7].id },
    { userId: users[2].id, gameId: games[0].id },
    { userId: users[2].id, gameId: games[10].id },
  ]

  await Promise.all(
    favoritesData.map((fav) => prisma.favorite.create({ data: fav }))
  )
  console.log(`✅ 创建 ${favoritesData.length} 条收藏记录`)

  // 统计
  const stats = {
    categories: await prisma.category.count(),
    games: await prisma.game.count(),
    users: await prisma.user.count(),
    comments: await prisma.comment.count(),
    favorites: await prisma.favorite.count(),
  }

  console.log("\n📊 数据库填充完成！")
  console.log(`   分类: ${stats.categories}`)
  console.log(`   游戏: ${stats.games}`)
  console.log(`   用户: ${stats.users}`)
  console.log(`   评论: ${stats.comments}`)
  console.log(`   收藏: ${stats.favorites}`)
}

main()
  .catch((e) => {
    console.error("❌ 填充失败:", e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
