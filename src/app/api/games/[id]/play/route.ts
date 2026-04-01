import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

// 记录游玩次数
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    // 检查游戏是否存在
    const game = await prisma.game.findUnique({
      where: { id },
    })

    if (!game) {
      return NextResponse.json({ error: "游戏不存在" }, { status: 404 })
    }

    // 增加游玩次数
    const updatedGame = await prisma.game.update({
      where: { id },
      data: {
        playCount: { increment: 1 },
      },
    })

    return NextResponse.json({ 
      success: true, 
      playCount: updatedGame.playCount 
    })
  } catch (error) {
    console.error("Increment play count error:", error)
    return NextResponse.json({ error: "操作失败" }, { status: 500 })
  }
}
