import { createClient } from "@/lib/supabase/server"
import { randomBytes } from "crypto"

export async function POST(request: Request) {
  try {
    const { poemId, expiresIn } = await request.json()

    if (!poemId) {
      return Response.json({ error: "Poem ID required" }, { status: 400 })
    }

    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Verify poem ownership
    const { data: poem, error: poemError } = await supabase
      .from("poems")
      .select("id")
      .eq("id", poemId)
      .eq("user_id", user.id)
      .single()

    if (poemError || !poem) {
      return Response.json({ error: "Poem not found" }, { status: 404 })
    }

    // Generate share token
    const shareToken = randomBytes(16).toString("hex")
    const expiresAt = expiresIn ? new Date(Date.now() + expiresIn * 1000).toISOString() : null

    const { data, error } = await supabase.from("shared_poems").insert({
      poem_id: poemId,
      shared_by_id: user.id,
      share_token: shareToken,
      expires_at: expiresAt,
    })

    if (error) throw error

    const shareUrl = `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/share/${shareToken}`

    return Response.json({
      shareToken,
      shareUrl,
      expiresAt,
    })
  } catch (error) {
    console.error("Error creating share link:", error)
    return Response.json({ error: "Failed to create share link" }, { status: 500 })
  }
}
