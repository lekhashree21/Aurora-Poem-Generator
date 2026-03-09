import type React from "react"
import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Sparkles, BarChart3, Home, Settings, LogOut } from "lucide-react"
import Link from "next/link"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  return (
    <main className="min-h-screen bg-background">
      {/* Aurora background effect */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="aurora-glow absolute inset-0 opacity-20"></div>
      </div>

      <div className="relative z-10 flex">
        {/* Sidebar */}
        <aside className="w-64 border-r border-border/50 bg-background/50 backdrop-blur-sm p-6 hidden md:flex flex-col">
          <div className="flex items-center gap-2 mb-8">
            <Sparkles className="w-6 h-6 text-primary" />
            <h1 className="text-xl font-bold text-glow">Aurora</h1>
          </div>

          <nav className="space-y-4 flex-1">
            <Link
              href="/dashboard"
              className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-card/30 transition-colors"
            >
              <Home className="w-5 h-5" />
              <span>Library</span>
            </Link>
            <Link
              href="/dashboard/stats"
              className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-card/30 transition-colors"
            >
              <BarChart3 className="w-5 h-5" />
              <span>Statistics</span>
            </Link>
            <Link
              href="/dashboard/settings"
              className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-card/30 transition-colors"
            >
              <Settings className="w-5 h-5" />
              <span>Settings</span>
            </Link>
          </nav>

          <form action="/auth/logout" method="POST">
            <button
              type="submit"
              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-destructive/10 transition-colors text-destructive"
            >
              <LogOut className="w-5 h-5" />
              <span>Logout</span>
            </button>
          </form>
        </aside>

        {/* Main content */}
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <header className="border-b border-border/50 backdrop-blur-md bg-background/50 sticky top-0">
            <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex items-center justify-between">
              <Link href="/" className="text-accent hover:underline text-sm">
                ← Back to Create
              </Link>
            </div>
          </header>

          {/* Page content */}
          <div className="flex-1 overflow-auto p-4 sm:p-6 lg:p-8">
            <div className="max-w-7xl mx-auto">{children}</div>
          </div>
        </div>
      </div>
    </main>
  )
}
