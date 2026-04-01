"use client"

import { useState, useRef } from "react"
import { Upload } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface FileUploadProps {
  label: string
  value: string
  onChange: (value: string) => void
  accept?: string
  placeholder?: string
  required?: boolean
}

export function FileUpload({
  label,
  value,
  onChange,
  accept,
  placeholder,
  required,
}: FileUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isUploading, setIsUploading] = useState(false)

  const handleUploadClick = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsUploading(true)
    try {
      const formData = new FormData()
      formData.append("file", file)

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        throw new Error("上传失败")
      }

      const data = await response.json()
      onChange(data.url)
    } catch (error) {
      console.error("上传失败:", error)
      alert("上传失败，请重试")
    } finally {
      setIsUploading(false)
      // 清空 input 以便重复选择同一文件
      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }
    }
  }

  return (
    <div className="space-y-2">
      <Label>
        {label}
        {required && " *"}
      </Label>
      <div className="flex gap-2">
        <Input
          placeholder={placeholder || "输入URL或上传文件"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="flex-1"
        />
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          onChange={handleFileChange}
          className="hidden"
        />
        <Button
          variant="outline"
          type="button"
          onClick={handleUploadClick}
          disabled={isUploading}
        >
          <Upload className="h-4 w-4 mr-2" />
          {isUploading ? "上传中..." : "上传"}
        </Button>
      </div>
    </div>
  )
}
