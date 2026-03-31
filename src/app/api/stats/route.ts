import { NextResponse } from "next/server"
import { getStats } from "@/lib/data-service"

export async function GET() {
  try {
    const stats = await getStats()
    return NextResponse.json(stats)
  } catch (error) {
    console.error("Get stats error:", error)
    return NextResponse.json({ error: "获取统计失败" }, { status: 500 })
  }
}
