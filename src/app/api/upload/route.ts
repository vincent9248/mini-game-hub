import { NextRequest, NextResponse } from "next/server"
import { verifyAdminToken } from "@/lib/admin-auth"
import { writeFile, mkdir } from "fs/promises"
import { existsSync } from "fs"
import path from "path"

// 支持的文件类型
const ALLOWED_TYPES: Record<string, string[]> = {
  image: ["image/jpeg", "image/png", "image/gif", "image/webp"],
  game: ["application/zip", "application/x-zip-compressed", "application/javascript", "text/html"],
}

// 文件大小限制 (5MB for images, 50MB for games)
const SIZE_LIMITS: Record<string, number> = {
  image: 5 * 1024 * 1024,
  game: 50 * 1024 * 1024,
}

export async function POST(request: NextRequest) {
  try {
    // 验证管理员权限
    const admin = await verifyAdminToken(request)
    if (!admin) {
      return NextResponse.json({ error: "未授权" }, { status: 401 })
    }

    const formData = await request.formData()
    const file = formData.get("file") as File | null

    if (!file) {
      return NextResponse.json({ error: "未选择文件" }, { status: 400 })
    }

    // 检测文件类型
    let fileType = "other"
    for (const [type, mimes] of Object.entries(ALLOWED_TYPES)) {
      if (mimes.includes(file.type)) {
        fileType = type
        break
      }
    }

    // 检查文件大小
    const sizeLimit = SIZE_LIMITS[fileType] || 10 * 1024 * 1024
    if (file.size > sizeLimit) {
      return NextResponse.json(
        { error: `文件大小超出限制 (${Math.floor(sizeLimit / 1024 / 1024)}MB)` },
        { status: 400 }
      )
    }

    // 生成文件名
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    
    const timestamp = Date.now()
    const randomStr = Math.random().toString(36).substring(2, 8)
    const ext = file.name.split(".").pop() || "bin"
    const fileName = `${timestamp}-${randomStr}.${ext}`

    // 确定存储目录
    const uploadDir = path.join(process.cwd(), "public", "uploads", fileType)
    
    // 确保目录存在
    if (!existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true })
    }

    // 写入文件
    const filePath = path.join(uploadDir, fileName)
    await writeFile(filePath, buffer)

    // 返回访问 URL
    const url = `/uploads/${fileType}/${fileName}`

    return NextResponse.json({
      success: true,
      url,
      fileName,
      size: file.size,
      type: file.type,
    })
  } catch (error) {
    console.error("文件上传失败:", error)
    return NextResponse.json(
      { error: "上传失败，请重试" },
      { status: 500 }
    )
  }
}
