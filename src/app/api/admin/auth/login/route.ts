import { NextRequest, NextResponse } from "next/server"
import { verifyAdminCredentials, createAdminSession, setAdminSessionCookie } from "@/lib/admin-auth"

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json(
        { error: "邮箱和密码不能为空" },
        { status: 400 }
      )
    }

    const admin = await verifyAdminCredentials(email, password)

    if (!admin) {
      return NextResponse.json(
        { error: "邮箱或密码错误，或账户已被禁用" },
        { status: 401 }
      )
    }

    const token = await createAdminSession(admin)
    await setAdminSessionCookie(token)

    return NextResponse.json({
      success: true,
      admin: {
        id: admin.id,
        email: admin.email,
        name: admin.name,
        avatar: admin.avatar,
      },
    })
  } catch (error) {
    console.error("Admin login error:", error)
    return NextResponse.json(
      { error: "登录失败，请稍后重试" },
      { status: 500 }
    )
  }
}
