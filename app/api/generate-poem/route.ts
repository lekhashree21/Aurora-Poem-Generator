import { generateLocalPoem } from "@/lib/poem-templates"

export async function POST(request: Request) {
  try {
    const { theme, customPrompt, creativityLevel = 7, poemLength = 16, poeticDevices = [] } = await request.json()

    // Simulate a small delay for realistic feel
    await new Promise((resolve) => setTimeout(resolve, 500 + Math.random() * 1000))

    const poem = generateLocalPoem(theme, poemLength, poeticDevices, customPrompt)

    return Response.json({
      poem,
      theme,
      creativityLevel,
      poemLength,
      poeticDevices,
    })
  } catch (error) {
    console.error("Poem generation error:", error)
    return Response.json({ error: "Failed to generate poem" }, { status: 500 })
  }
}
