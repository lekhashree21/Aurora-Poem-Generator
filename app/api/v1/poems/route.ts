import { createClient } from "@/lib/supabase/server"
import { v4 as uuidv4 } from "uuid"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const authHeader = request.headers.get("authorization")

    if (!authHeader?.startsWith("Bearer ")) {
      return Response.json({ error: "Unauthorized" }, { status: 401 })
    }

    const token = authHeader.slice(7)
    const supabase = await createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 })
    }

    const theme = searchParams.get("theme")
    const favorites = searchParams.get("favorites") === "true"
    const limit = Math.min(Number.parseInt(searchParams.get("limit") || "50"), 100)
    const offset = Number.parseInt(searchParams.get("offset") || "0")

    let query = supabase.from("poems").select("*", { count: "exact" }).eq("user_id", user.id)

    if (theme) {
      query = query.eq("theme", theme)
    }

    if (favorites) {
      query = query.eq("is_favorite", true)
    }

    const { data, count, error } = await query
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1)

    if (error) throw error

    return Response.json({
      poems: data,
      total: count,
      limit,
      offset,
    })
  } catch (error) {
    console.error("Error fetching poems:", error)
    return Response.json({ error: "Failed to fetch poems" }, { status: 500 })
  }
}

export async function POST(request: Request) {
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

    const { title, content, theme, customPrompt, creativityLevel, poemLength, poeticDevices, tags } =
      await request.json()

    if (!title || !content || !theme) {
      return Response.json({ error: "Missing required fields: title, content, theme" }, { status: 400 })
    }

    const { data, error } = await supabase.from("poems").insert({
      id: uuidv4(),
      user_id: user.id,
      title,
      content,
      theme,
      custom_prompt: customPrompt || null,
      creativity_level: creativityLevel || 7,
      poem_length: poemLength || 16,
      poetic_devices: poeticDevices || [],
      tags: tags || [],
    })

    if (error) throw error

    return Response.json(data, { status: 201 })
  } catch (error) {
    console.error("Error creating poem:", error)
    return Response.json({ error: "Failed to create poem" }, { status: 500 })
  }
}
