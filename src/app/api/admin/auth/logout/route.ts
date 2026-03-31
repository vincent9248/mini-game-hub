import { NextResponse } from "next/server"
import { clearAdminSessionCookie } from "@/lib/admin-auth"

export async function POST() {
  try {
    await clearAdminSessionCookie()
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Admin logout error:", error)
    return NextResponse.json(
      { error: "登出失败" },
      { status: 500 }
    )
  }
}
