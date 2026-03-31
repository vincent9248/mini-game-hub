"use client"

import * as React from "react"
import { X, CheckCircle, AlertCircle, Info } from "lucide-react"
import { cn } from "@/lib/utils"

interface Toast {
  id: string
  message: string
  type: "success" | "error" | "info"
}

interface ToastContextType {
  toasts: Toast[]
  addToast: (message: string, type?: Toast["type"]) => void
  removeToast: (id: string) => void
}

const ToastContext = React.createContext<ToastContextType | undefined>(undefined)

export function useToast() {
  const context = React.useContext(ToastContext)
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider")
  }
  return context
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = React.useState<Toast[]>([])

  const addToast = React.useCallback((message: string, type: Toast["type"] = "info") => {
    const id = Math.random().toString(36).substr(2, 9)
    setToasts((prev) => [...prev, { id, message, type }])
    // 自动移除
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id))
    }, 3000)
  }, [])

  const removeToast = React.useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast }}>
      {children}
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </ToastContext.Provider>
  )
}

function ToastContainer({ toasts, removeToast }: { toasts: Toast[]; removeToast: (id: string) => void }) {
  if (toasts.length === 0) return null

  return (
    <div className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={cn(
            "flex items-center gap-2 px-4 py-3 rounded-lg shadow-lg animate-in slide-in-from-right-full",
            "bg-background border",
            toast.type === "success" && "border-green-500/50 bg-green-500/10",
            toast.type === "error" && "border-red-500/50 bg-red-500/10",
            toast.type === "info" && "border-blue-500/50 bg-blue-500/10"
          )}
        >
          {toast.type === "success" && <CheckCircle className="h-4 w-4 text-green-500" />}
          {toast.type === "error" && <AlertCircle className="h-4 w-4 text-red-500" />}
          {toast.type === "info" && <Info className="h-4 w-4 text-blue-500" />}
          <span className="text-sm">{toast.message}</span>
          <button
            onClick={() => removeToast(toast.id)}
            className="ml-2 text-muted-foreground hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ))}
    </div>
  )
}
