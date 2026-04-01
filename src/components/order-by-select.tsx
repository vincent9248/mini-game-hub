"use client"

import { useRouter, usePathname, useSearchParams } from "next/navigation"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

type OrderBy = "newest" | "popular" | "rating"

interface OrderBySelectProps {
  value: OrderBy
}

const orderOptions = [
  { value: "newest", label: "最新" },
  { value: "popular", label: "最热" },
  { value: "rating", label: "评分" },
] as const

export function OrderBySelect({ value }: OrderBySelectProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const handleValueChange = (newValue: string) => {
    const params = new URLSearchParams(searchParams.toString())
    
    if (newValue === "newest") {
      params.delete("orderBy")
    } else {
      params.set("orderBy", newValue)
    }
    
    // 重置页码
    params.delete("page")
    
    const queryString = params.toString()
    router.push(queryString ? `${pathname}?${queryString}` : pathname)
  }

  return (
    <Select value={value} onValueChange={handleValueChange}>
      <SelectTrigger className="w-32">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {orderOptions.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
