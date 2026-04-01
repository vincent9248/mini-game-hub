"use client"

import { useState } from "react"
import { Search, Gamepad2 } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"

interface Category {
  id: string
  name: string
  slug: string
  description: string | null
  icon: string | null
  _count: {
    games: number
  }
}

const categoryColors: Record<string, string> = {
  action: "from-neon-pink to-neon-purple",
  puzzle: "from-neon-cyan to-neon-green",
  shooter: "from-neon-gold to-neon-pink",
  strategy: "from-neon-purple to-neon-cyan",
  casual: "from-neon-green to-neon-gold",
  racing: "from-neon-pink to-neon-gold",
}

interface CategorySearchProps {
  categories: Category[]
  stats: {
    totalGames: number
    totalUsers: number
  }
}

export function CategorySearch({ categories, stats }: CategorySearchProps) {
  const [search, setSearch] = useState("")

  const filteredCategories = categories.filter((cat) =>
    cat.name.toLowerCase().includes(search.toLowerCase()) ||
    (cat.description && cat.description.toLowerCase().includes(search.toLowerCase()))
  )

  return (
    <>
      {/* Search */}
      <div className="max-w-md mx-auto mb-12">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="搜索分类..."
            className="pl-10"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Categories Grid */}
      {filteredCategories.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCategories.map((category) => (
            <Link key={category.id} href={`/games?category=${category.slug}`}>
              <Card className="group cursor-pointer overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-[0_0_30px_rgba(107,78,255,0.3)]">
                <div className={`h-32 bg-gradient-to-br ${categoryColors[category.slug] || "from-neon-purple to-neon-cyan"} flex items-center justify-center`}>
                  <span className="text-6xl group-hover:scale-110 transition-transform duration-300">
                    {category.icon}
                  </span>
                </div>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <h2 className="text-xl font-bold group-hover:text-primary transition-colors">
                      {category.name}
                    </h2>
                    <Badge variant="secondary">{category._count.games} 游戏</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {category.description}
                  </p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <Gamepad2 className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
          <p className="text-muted-foreground">
            未找到与 "{search}" 相关的分类
          </p>
        </div>
      )}

      {/* Stats */}
      <div className="mt-16 text-center">
        <div className="inline-flex items-center gap-8 p-6 rounded-2xl bg-card">
          <div>
            <div className="text-3xl font-bold text-neon-purple">{categories.length}</div>
            <div className="text-sm text-muted-foreground">游戏分类</div>
          </div>
          <div className="w-px h-12 bg-border" />
          <div>
            <div className="text-3xl font-bold text-neon-cyan">{stats.totalGames}</div>
            <div className="text-sm text-muted-foreground">游戏总数</div>
          </div>
          <div className="w-px h-12 bg-border" />
          <div>
            <div className="text-3xl font-bold text-neon-pink">{stats.totalUsers.toLocaleString()}+</div>
            <div className="text-sm text-muted-foreground">活跃玩家</div>
          </div>
        </div>
      </div>
    </>
  )
}
