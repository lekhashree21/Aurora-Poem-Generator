"use client"

import { Card } from "@/components/ui/card"
import { Sparkles, Heart, Zap, BookOpen } from "lucide-react"

interface StatsOverviewProps {
  totalPoems: number
  favoritePoems: number
  avgCreativity: number
  avgLength: number
}

export function StatsOverview({ totalPoems, favoritePoems, avgCreativity, avgLength }: StatsOverviewProps) {
  const stats = [
    {
      label: "Total Poems",
      value: totalPoems,
      icon: BookOpen,
      color: "text-primary",
    },
    {
      label: "Favorites",
      value: favoritePoems,
      icon: Heart,
      color: "text-red-500",
    },
    {
      label: "Avg Creativity",
      value: `${avgCreativity}/10`,
      icon: Zap,
      color: "text-yellow-500",
    },
    {
      label: "Avg Length",
      value: `${avgLength} lines`,
      icon: Sparkles,
      color: "text-accent",
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat) => {
        const Icon = stat.icon
        return (
          <Card key={stat.label} className="bg-card/50 border-border/50 p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
                <p className="text-3xl font-bold mt-2">{stat.value}</p>
              </div>
              <Icon className={`w-6 h-6 ${stat.color}`} />
            </div>
          </Card>
        )
      })}
    </div>
  )
}
