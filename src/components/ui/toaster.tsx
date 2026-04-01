"use client"

import { useToast } from "@/hooks/use-toast"
import { useEffect } from "react"

export function Toaster() {
  const { toasts } = useToast()

  useEffect(() => {
    if (toasts.length > 0) {
      const toast = toasts[0]
      
      // 创建 toast 元素
      const toastEl = document.createElement("div")
      toastEl.className = `fixed bottom-4 right-4 z-50 flex flex-col gap-2 animate-in slide-in-from-bottom-2 duration-300`
      
      const toastInner = document.createElement("div")
      toastInner.className = `pointer-events-auto w-full max-w-sm overflow-hidden rounded-lg border shadow-lg ${
        toast.variant === "destructive"
          ? "border-red-500/50 bg-red-950 text-red-100"
          : "border-border bg-background text-foreground"
      }`
      
      const toastContent = document.createElement("div")
      toastContent.className = "p-4"
      
      if (toast.title) {
        const title = document.createElement("div")
        title.className = "text-sm font-semibold"
        title.textContent = String(toast.title)
        toastContent.appendChild(title)
      }
      
      if (toast.description) {
        const description = document.createElement("div")
        description.className = "text-sm opacity-90 mt-1"
        description.textContent = String(toast.description)
        toastContent.appendChild(description)
      }
      
      toastInner.appendChild(toastContent)
      toastEl.appendChild(toastInner)
      document.body.appendChild(toastEl)
      
      // 3秒后移除
      const timeout = setTimeout(() => {
        toastEl.style.opacity = "0"
        toastEl.style.transform = "translateY(10px)"
        toastEl.style.transition = "all 0.3s"
        setTimeout(() => {
          document.body.removeChild(toastEl)
        }, 300)
      }, 3000)
      
      return () => clearTimeout(timeout)
    }
  }, [toasts])

  return null
}
