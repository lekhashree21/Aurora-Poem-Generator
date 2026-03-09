import { createClient } from "@/lib/supabase/server"

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
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

    const { data, error } = await supabase.from("poems").select("*").eq("id", id).eq("user_id", user.id).single()

    if (error) {
      return Response.json({ error: "Poem not found" }, { status: 404 })
    }

    return Response.json(data)
  } catch (error) {
    console.error("Error fetching poem:", error)
    return Response.json({ error: "Failed to fetch poem" }, { status: 500 })
  }
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
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

    const updates = await request.json()

    const { data, error } = await supabase
      .from("poems")
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .eq("user_id", user.id)

    if (error) throw error

    return Response.json(data)
  } catch (error) {
    console.error("Error updating poem:", error)
    return Response.json({ error: "Failed to update poem" }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
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

    const { error } = await supabase.from("poems").delete().eq("id", id).eq("user_id", user.id)

    if (error) throw error

    return Response.json({ message: "Poem deleted successfully" })
  } catch (error) {
    console.error("Error deleting poem:", error)
    return Response.json({ error: "Failed to delete poem" }, { status: 500 })
  }
}
