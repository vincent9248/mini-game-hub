import { SignJWT, jwtVerify } from "jose"
import { cookies } from "next/headers"
import { NextRequest } from "next/server"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"

const SECRET_KEY = process.env.ADMIN_SECRET_KEY || "admin-secret-key-change-in-production"
const key = new TextEncoder().encode(SECRET_KEY)

export interface AdminSession {
  id: string
  email: string
  name: string
  avatar?: string
}

// 管理员登录验证
export async function verifyAdminCredentials(email: string, password: string) {
  const admin = await prisma.admin.findUnique({
    where: { email },
  })

  if (!admin || !admin.password || !admin.isActive) {
    return null
  }

  const isValid = await bcrypt.compare(password, admin.password)

  if (!isValid) {
    return null
  }

  // 更新最后登录时间
  await prisma.admin.update({
    where: { id: admin.id },
    data: { lastLogin: new Date() },
  })

  return {
    id: admin.id,
    email: admin.email,
    name: admin.name,
    avatar: admin.avatar,
  }
}

// 创建管理员会话 Token
export async function createAdminSession(admin: AdminSession) {
  const token = await new SignJWT({
    id: admin.id,
    email: admin.email,
    name: admin.name,
    avatar: admin.avatar,
    type: "admin", // 标识为管理员 token
  })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("8h") // 8小时过期
    .sign(key)

  return token
}

// 验证管理员会话
export async function verifyAdminSession(token: string): Promise<AdminSession | null> {
  try {
    const { payload } = await jwtVerify(token, key)
    
    // 确保 token 类型为 admin
    if (payload.type !== "admin") {
      return null
    }

    return {
      id: payload.id as string,
      email: payload.email as string,
      name: payload.name as string,
      avatar: payload.avatar as string | undefined,
    }
  } catch {
    return null
  }
}

// 获取当前管理员会话
export async function getAdminSession(): Promise<AdminSession | null> {
  const cookieStore = await cookies()
  const token = cookieStore.get("admin_token")?.value

  if (!token) {
    return null
  }

  return verifyAdminSession(token)
}

// 设置管理员会话 Cookie
export async function setAdminSessionCookie(token: string) {
  const cookieStore = await cookies()
  cookieStore.set("admin_token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 8 * 60 * 60, // 8小时
    path: "/",
  })
}

// 清除管理员会话 Cookie
export async function clearAdminSessionCookie() {
  const cookieStore = await cookies()
  cookieStore.delete("admin_token")
}

// 检查管理员是否已登录的辅助函数
export async function requireAdmin(): Promise<AdminSession> {
  const session = await getAdminSession()
  
  if (!session) {
    throw new Error("Unauthorized")
  }
  
  return session
}

// 从 NextRequest 验证管理员 token（用于 API 路由）
export async function verifyAdminToken(request: NextRequest): Promise<AdminSession | null> {
  const token = request.cookies.get("admin_token")?.value
  
  if (!token) {
    return null
  }
  
  return verifyAdminSession(token)
}
