"use client"

import { signOut } from "@/lib/auth"
import { DropdownMenuItem } from "@/components/ui/dropdown-menu"

export function UserLogoutButton() {
  return (
    <DropdownMenuItem
      onClick={() => signOut({ redirectTo: "/" })}
      className="text-destructive cursor-pointer"
    >
      退出登录
    </DropdownMenuItem>
  )
}
