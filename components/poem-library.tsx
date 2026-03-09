"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Heart, Search, Trash2, Download, Share2, FolderPlus } from "lucide-react"

interface Poem {
  id: string
  title: string
  content: string
  theme: string
  created_at: string
  is_favorite: boolean
  tags: string[]
}

export function PoemLibrary({ userId }: { userId: string }) {
  const [poems, setPoems] = useState<Poem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [filterTheme, setFilterTheme] = useState<string | null>(null)

  useEffect(() => {
    fetchPoems()
  }, [userId])

  const fetchPoems = async () => {
    const supabase = createClient()
    const { data, error } = await supabase
      .from("poems")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Error fetching poems:", error)
    } else {
      setPoems(data || [])
    }
    setIsLoading(false)
  }

  const toggleFavorite = async (poemId: string, isFavorite: boolean) => {
    const supabase = createClient()
    await supabase.from("poems").update({ is_favorite: !isFavorite }).eq("id", poemId)

    setPoems(poems.map((p) => (p.id === poemId ? { ...p, is_favorite: !isFavorite } : p)))
  }

  const deletePoem = async (poemId: string) => {
    const supabase = createClient()
    await supabase.from("poems").delete().eq("id", poemId)

    setPoems(poems.filter((p) => p.id !== poemId))
  }

  const filteredPoems = poems.filter((poem) => {
    const matchesSearch =
      poem.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      poem.content.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesTheme = !filterTheme || poem.theme === filterTheme

    return matchesSearch && matchesTheme
  })

  const themes = Array.from(new Set(poems.map((p) => p.theme)))

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="space-y-4">
        <h2 className="text-3xl font-bold">Your Poems</h2>
        <p className="text-muted-foreground">Manage and organize your generated poems</p>
      </div>

      {/* Controls */}
      <Card className="bg-card/30 border-border/30 p-6 space-y-4">
        <div className="flex gap-2">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search poems..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button variant="outline" className="border-border/50 bg-transparent">
            <FolderPlus className="w-4 h-4 mr-2" />
            New Collection
          </Button>
        </div>

        {themes.length > 0 && (
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={() => setFilterTheme(null)}
              className={`px-3 py-1 rounded-full text-sm transition-all ${
                filterTheme === null ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
              }`}
            >
              All
            </button>
            {themes.map((theme) => (
              <button
                key={theme}
                onClick={() => setFilterTheme(theme)}
                className={`px-3 py-1 rounded-full text-sm transition-all capitalize ${
                  filterTheme === theme ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                }`}
              >
                {theme}
              </button>
            ))}
          </div>
        )}
      </Card>

      {/* Poems Grid */}
      {isLoading ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">Loading your poems...</p>
        </div>
      ) : filteredPoems.length === 0 ? (
        <Card className="bg-card/30 border-border/30 p-12 text-center">
          <p className="text-muted-foreground mb-4">No poems yet. Start creating!</p>
          <Button className="bg-primary hover:bg-primary/90">Create Your First Poem</Button>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredPoems.map((poem) => (
            <Card
              key={poem.id}
              className="bg-card/50 backdrop-blur border-border/50 p-6 hover:border-accent/50 transition-all group"
            >
              <div className="space-y-4">
                <div className="space-y-2">
                  <h3 className="font-semibold text-lg truncate">{poem.title || `${poem.theme} Poem`}</h3>
                  <p className="text-xs text-muted-foreground">{new Date(poem.created_at).toLocaleDateString()}</p>
                </div>

                <p className="text-sm text-foreground/80 line-clamp-3">{poem.content}</p>

                <div className="flex gap-2 pt-4 border-t border-border/50 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => toggleFavorite(poem.id, poem.is_favorite)}
                    className={poem.is_favorite ? "text-accent" : ""}
                  >
                    <Heart className={`w-4 h-4 ${poem.is_favorite ? "fill-current" : ""}`} />
                  </Button>
                  <Button size="sm" variant="ghost">
                    <Share2 className="w-4 h-4" />
                  </Button>
                  <Button size="sm" variant="ghost">
                    <Download className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => deletePoem(poem.id)}
                    className="text-destructive hover:text-destructive ml-auto"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
