import { PrismaClient } from "@prisma/client"
import bcrypt from "bcryptjs"

const prisma = new PrismaClient()

async function main() {
  console.log("开始初始化管理员账户...")

  // 检查是否已存在管理员
  const existingAdmin = await prisma.admin.findFirst()

  if (existingAdmin) {
    console.log("管理员账户已存在:")
    console.log(`  邮箱: ${existingAdmin.email}`)
    console.log(`  名称: ${existingAdmin.name}`)
    return
  }

  // 创建默认管理员账户
  const defaultEmail = process.env.ADMIN_DEFAULT_EMAIL || "admin@example.com"
  const defaultPassword = process.env.ADMIN_DEFAULT_PASSWORD || "admin123456"
  const defaultName = process.env.ADMIN_DEFAULT_NAME || "超级管理员"

  const hashedPassword = await bcrypt.hash(defaultPassword, 10)

  const admin = await prisma.admin.create({
    data: {
      email: defaultEmail,
      password: hashedPassword,
      name: defaultName,
      isActive: true,
    },
  })

  console.log("✅ 管理员账户创建成功!")
  console.log(`  邮箱: ${admin.email}`)
  console.log(`  名称: ${admin.name}`)
  console.log(`  密码: ${defaultPassword}`)
  console.log("\n⚠️  请登录后立即修改默认密码!")
}

main()
  .catch((e) => {
    console.error("初始化失败:", e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
