import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Card } from "@/components/ui/card"
import { StatsOverview } from "@/components/stats-overview"

export default async function StatsPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  // Get statistics
  const { count: totalPoems } = await supabase.from("poems").select("id", { count: "exact" }).eq("user_id", user.id)

  const { count: favoritePoems } = await supabase
    .from("poems")
    .select("id", { count: "exact" })
    .eq("user_id", user.id)
    .eq("is_favorite", true)

  const { data: themesData } = await supabase.from("poems").select("theme").eq("user_id", user.id)

  const themeDistribution: Record<string, number> = {}
  themesData?.forEach((item) => {
    themeDistribution[item.theme] = (themeDistribution[item.theme] || 0) + 1
  })

  const { data: creativityData } = await supabase.from("poems").select("creativity_level").eq("user_id", user.id)

  const avgCreativity =
    creativityData && creativityData.length > 0
      ? Math.round(creativityData.reduce((sum, item) => sum + (item.creativity_level || 0), 0) / creativityData.length)
      : 0

  const { data: lengthData } = await supabase.from("poems").select("poem_length").eq("user_id", user.id)

  const avgLength =
    lengthData && lengthData.length > 0
      ? Math.round(lengthData.reduce((sum, item) => sum + (item.poem_length || 0), 0) / lengthData.length)
      : 0

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Your Statistics</h1>
        <p className="text-muted-foreground mt-2">Insights about your poetry generation</p>
      </div>

      <StatsOverview
        totalPoems={totalPoems || 0}
        favoritePoems={favoritePoems || 0}
        avgCreativity={avgCreativity}
        avgLength={avgLength}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-card/50 border-border/50 p-6">
          <h2 className="text-lg font-semibold mb-4">Poems by Theme</h2>
          <div className="space-y-4">
            {Object.entries(themeDistribution).map(([theme, count]) => (
              <div key={theme} className="flex items-center justify-between">
                <span className="capitalize text-muted-foreground">{theme}</span>
                <div className="flex items-center gap-4">
                  <div className="w-32 h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary"
                      style={{
                        width: `${(count / (totalPoems || 1)) * 100}%`,
                      }}
                    />
                  </div>
                  <span className="font-semibold w-8 text-right">{count}</span>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="bg-card/50 border-border/50 p-6">
          <h2 className="text-lg font-semibold mb-4">Generation Patterns</h2>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground mb-2">Average Creativity Level</p>
              <p className="text-3xl font-bold">{avgCreativity}/10</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-2">Average Poem Length</p>
              <p className="text-3xl font-bold">{avgLength} lines</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
