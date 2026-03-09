import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { PoemLibrary } from "@/components/poem-library"
import { Sparkles } from "lucide-react"
import Link from "next/link"

export default async function DashboardPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()

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
          <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <Sparkles className="w-6 h-6 text-primary" />
                <h1 className="text-2xl font-bold text-glow">Aurora</h1>
              </div>
              <p className="text-sm text-muted-foreground mt-1">Welcome back, {profile?.display_name}</p>
            </div>
            <div className="flex items-center gap-3">
              <Link
                href="/"
                className="px-4 py-2 text-sm rounded-lg border border-border/50 hover:bg-accent/10 transition-colors"
              >
                Create New
              </Link>
              <form action="/auth/logout" method="POST" className="inline">
                <button
                  type="submit"
                  className="px-4 py-2 text-sm rounded-lg border border-border/50 hover:bg-destructive/10 transition-colors"
                >
                  Logout
                </button>
              </form>
            </div>
          </div>
        </header>

        {/* Main content */}
        <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
          <PoemLibrary userId={user.id} />
        </div>
      </div>
    </main>
  )
}
