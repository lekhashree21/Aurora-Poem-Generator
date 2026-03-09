import { PoemGenerator } from "@/components/poem-generator"
import { Sparkles } from "lucide-react"
import { redirect } from "next/navigation"
import { createClient, isSupabaseConfigured } from "@/lib/supabase/server"

export default async function Home() {
  if (isSupabaseConfigured()) {
    const supabase = await createClient()
    if (supabase) {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (user) {
        redirect("/dashboard")
      }
    }
  }

  return (
    <main className="min-h-screen bg-background">
      {/* Aurora background effect */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="aurora-glow absolute inset-0 opacity-20"></div>
      </div>

      {/* Content */}
      <div className="relative z-10">
        {/* Header */}
        <header className="border-b border-border/50 backdrop-blur-md bg-background/50 sticky top-0">
          <div className="max-w-6xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-primary" />
              <h1 className="text-2xl font-bold text-glow">Aurora</h1>
            </div>
            <p className="text-sm text-muted-foreground mt-1">Generate poetic masterpieces with AI</p>
          </div>
        </header>

        {/* Main content */}
        <div className="max-w-4xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
          <PoemGenerator />
        </div>
      </div>
    </main>
  )
}
