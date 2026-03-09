import { createClient } from "@/lib/supabase/server"

export async function GET(request: Request) {
  try {
    const authHeader = request.headers.get("authorization")

    if (!authHeader?.startsWith("Bearer ")) {
      return Response.json({ error: "Unauthorized" }, { status: 401 })
    }

    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get total poems
    const { count: totalPoems } = await supabase.from("poems").select("id", { count: "exact" }).eq("user_id", user.id)

    // Get favorite poems
    const { count: favoritePoems } = await supabase
      .from("poems")
      .select("id", { count: "exact" })
      .eq("user_id", user.id)
      .eq("is_favorite", true)

    // Get theme distribution
    const { data: themesData } = await supabase.from("poems").select("theme").eq("user_id", user.id)

    const themeDistribution: Record<string, number> = {}
    themesData?.forEach((item) => {
      themeDistribution[item.theme] = (themeDistribution[item.theme] || 0) + 1
    })

    return Response.json({
      totalPoems,
      favoritePoems,
      themeDistribution,
      createdAt: user.created_at,
    })
  } catch (error) {
    console.error("Error fetching stats:", error)
    return Response.json({ error: "Failed to fetch stats" }, { status: 500 })
  }
}
