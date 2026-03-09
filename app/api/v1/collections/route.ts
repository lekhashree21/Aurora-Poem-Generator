import { createClient } from "@/lib/supabase/server"
import { v4 as uuidv4 } from "uuid"

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

    const { data, error } = await supabase
      .from("collections")
      .select(
        `
        *,
        collection_poems(count)
      `,
      )
      .eq("user_id", user.id)

    if (error) throw error

    return Response.json(data)
  } catch (error) {
    console.error("Error fetching collections:", error)
    return Response.json({ error: "Failed to fetch collections" }, { status: 500 })
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

    const { name, description, isPublic } = await request.json()

    if (!name) {
      return Response.json({ error: "Collection name is required" }, { status: 400 })
    }

    const { data, error } = await supabase.from("collections").insert({
      id: uuidv4(),
      user_id: user.id,
      name,
      description: description || null,
      is_public: isPublic || false,
    })

    if (error) throw error

    return Response.json(data, { status: 201 })
  } catch (error) {
    console.error("Error creating collection:", error)
    return Response.json({ error: "Failed to create collection" }, { status: 500 })
  }
}
