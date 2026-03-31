import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { writeFile, mkdir } from "fs/promises"
import { join } from "path"
import { existsSync } from "fs"

// POST /api/upload - 上传文件
export async function POST(request: Request) {
  try {
    const session = await auth()
    if (!session || !(session.user as any)?.role || (session.user as any).role !== "ADMIN") {
      return NextResponse.json({ error: "未授权" }, { status: 401 })
    }

    const formData = await request.formData()
    const file = formData.get("file") as File
    const type = formData.get("type") as string // "cover", "game", "avatar"

    if (!file) {
      return NextResponse.json({ error: "没有上传文件" }, { status: 400 })
    }

    if (!type || !["cover", "game", "avatar"].includes(type)) {
      return NextResponse.json({ error: "无效的文件类型" }, { status: 400 })
    }

    // 验证文件大小 (10MB)
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json({ error: "文件大小不能超过10MB" }, { status: 400 })
    }

    // 生成文件名
    const ext = file.name.split(".").pop()?.toLowerCase() || ""
    const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`

    // 确定存储目录
    const uploadDir = join(process.cwd(), "public", type === "game" ? "games" : `${type}s`)

    // 确保目录存在
    if (!existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true })
    }

    // 写入文件
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    const filePath = join(uploadDir, fileName)
    await writeFile(filePath, buffer)

    // 返回文件URL
    const fileUrl = `/${type === "game" ? "games" : `${type}s`}/${fileName}`

    return NextResponse.json({
      url: fileUrl,
      fileName,
      size: file.size,
    })
  } catch (error) {
    console.error("Error uploading file:", error)
    return NextResponse.json(
      { error: "上传文件失败" },
      { status: 500 }
    )
  }
}
