"use client"

import { createClient } from "@/lib/supabase/server"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Copy, Download } from "lucide-react"
import { notFound } from "next/navigation"

export default async function SharePage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params
  const supabase = await createClient()

  // Get shared poem
  const { data: sharedPoem, error } = await supabase
    .from("shared_poems")
    .select(
      `
      *,
      poems(*)
    `,
    )
    .eq("share_token", token)
    .single()

  if (error || !sharedPoem) {
    notFound()
  }

  // Check if expired
  if (sharedPoem.expires_at && new Date(sharedPoem.expires_at) < new Date()) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="bg-card/50 backdrop-blur border-border/50 p-8 text-center">
          <h1 className="text-2xl font-bold mb-4">Link Expired</h1>
          <p className="text-muted-foreground">This shared poem link has expired.</p>
        </Card>
      </div>
    )
  }

  const poem = (sharedPoem.poems as any)[0]

  return (
    <main className="min-h-screen bg-background">
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="aurora-glow absolute inset-0 opacity-20"></div>
      </div>

      <div className="relative z-10">
        <header className="border-b border-border/50 backdrop-blur-md bg-background/50 sticky top-0">
          <div className="max-w-4xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
            <h1 className="text-2xl font-bold text-glow">Aurora</h1>
            <p className="text-sm text-muted-foreground mt-1">Shared Poem</p>
          </div>
        </header>

        <div className="max-w-4xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
          <Card className="bg-gradient-to-br from-card/80 to-card/40 backdrop-blur-md border-accent/30 p-8">
            <div className="mb-6">
              <h2 className="text-3xl font-bold mb-2">{poem.title || `${poem.theme} Poem`}</h2>
              <p className="text-sm text-muted-foreground">
                Theme: <span className="capitalize">{poem.theme}</span>
              </p>
            </div>

            <div className="prose prose-invert max-w-none mb-8">
              <div className="whitespace-pre-wrap text-lg leading-relaxed text-foreground font-light">
                {poem.content}
              </div>
            </div>

            <div className="border-t border-border/50 pt-6">
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <p className="text-xs text-muted-foreground">Creativity Level</p>
                  <p className="text-lg font-semibold">{poem.creativity_level}/10</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Poem Length</p>
                  <p className="text-lg font-semibold">{poem.poem_length} lines</p>
                </div>
              </div>

              {poem.poetic_devices && poem.poetic_devices.length > 0 && (
                <div className="mb-6">
                  <p className="text-xs text-muted-foreground mb-2">Poetic Devices</p>
                  <div className="flex flex-wrap gap-2">
                    {poem.poetic_devices.map((device: string) => (
                      <span key={device} className="px-3 py-1 bg-accent/20 text-accent rounded-full text-sm">
                        {device}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex gap-3">
                <Button
                  onClick={() => navigator.clipboard.writeText(poem.content)}
                  className="flex-1 border-border/50 hover:bg-accent/10 hover:text-accent bg-transparent"
                  variant="outline"
                >
                  <Copy className="w-4 h-4 mr-2" />
                  Copy
                </Button>
                <Button
                  onClick={() => {
                    const element = document.createElement("a")
                    element.setAttribute("href", "data:text/plain;charset=utf-8," + encodeURIComponent(poem.content))
                    element.setAttribute("download", `aurora-poem-${Date.now()}.txt`)
                    document.body.appendChild(element)
                    element.click()
                    document.body.removeChild(element)
                  }}
                  className="flex-1 border-border/50 hover:bg-accent/10 hover:text-accent bg-transparent"
                  variant="outline"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </main>
  )
}
