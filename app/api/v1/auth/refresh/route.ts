import { createClient } from "@/lib/supabase/server"

export async function POST(request: Request) {
  try {
    const { refreshToken } = await request.json()

    if (!refreshToken) {
      return Response.json({ error: "Refresh token required" }, { status: 400 })
    }

    const supabase = await createClient()
    const { data, error } = await supabase.auth.refreshSession({
      refresh_token: refreshToken,
    })

    if (error) throw error

    return Response.json({
      accessToken: data.session?.access_token,
      refreshToken: data.session?.refresh_token,
      user: data.user,
    })
  } catch (error) {
    console.error("Error refreshing token:", error)
    return Response.json({ error: "Failed to refresh token" }, { status: 401 })
  }
}
