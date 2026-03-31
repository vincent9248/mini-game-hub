import { NextRequest, NextResponse } from "next/server"
import { jwtVerify } from "jose"

const SECRET_KEY = process.env.ADMIN_SECRET_KEY || "admin-secret-key-change-in-production"
const key = new TextEncoder().encode(SECRET_KEY)

// 验证管理员 Token
async function verifyAdminToken(token: string) {
  try {
    const { payload } = await jwtVerify(token, key)
    return payload.type === "admin" ? payload : null
  } catch {
    return null
  }
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  // 管理后台路由保护
  if (pathname.startsWith("/admin")) {
    // 排除管理员登录页面
    if (pathname === "/admin/login") {
      // 如果已登录管理员访问登录页，重定向到仪表盘
      const adminToken = req.cookies.get("admin_token")?.value
      if (adminToken) {
        const payload = await verifyAdminToken(adminToken)
        if (payload) {
          return NextResponse.redirect(new URL("/admin/dashboard", req.url))
        }
      }
      return NextResponse.next()
    }

    // 其他管理后台页面需要验证管理员身份
    const adminToken = req.cookies.get("admin_token")?.value

    if (!adminToken) {
      return NextResponse.redirect(new URL("/admin/login", req.url))
    }

    const payload = await verifyAdminToken(adminToken)

    if (!payload) {
      // Token 无效，清除 cookie 并重定向到登录页
      const response = NextResponse.redirect(new URL("/admin/login", req.url))
      response.cookies.delete("admin_token")
      return response
    }

    return NextResponse.next()
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/admin/:path*"],
}
