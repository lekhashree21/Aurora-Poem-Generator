"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ThemeSelector } from "./theme-selector"
import { PoemDisplay } from "./poem-display"
import { Loader2, Wand2, Sparkles, AlertCircle } from "lucide-react"
import { AdvancedControls } from "./advanced-controls"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

const themes = [
  { id: "nature", label: "Nature", emoji: "🌿" },
  { id: "cosmic", label: "Cosmic", emoji: "🌌" },
  { id: "love", label: "Love", emoji: "💫" },
  { id: "mystery", label: "Mystery", emoji: "🌙" },
  { id: "ocean", label: "Ocean", emoji: "🌊" },
]

export function PoemGenerator() {
  const [selectedTheme, setSelectedTheme] = useState("nature")
  const [customPrompt, setCustomPrompt] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [poemResult, setPoemResult] = useState<{
    poem: string
    theme: string
    prompt: string
    creativityLevel: number
    poemLength: number
    poeticDevices: string[]
  } | null>(null)

  const [creativityLevel, setCreativityLevel] = useState(7)
  const [poemLength, setPoemLength] = useState(16)
  const [selectedDevices, setSelectedDevices] = useState<string[]>([])

  const handleGeneratePoem = async () => {
    if (!selectedTheme) return

    setIsLoading(true)
    setError(null)
    try {
      const response = await fetch("/api/generate-poem", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          theme: selectedTheme,
          customPrompt: customPrompt || undefined,
          creativityLevel,
          poemLength,
          poeticDevices: selectedDevices,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || "Failed to generate poem")
        return
      }

      setPoemResult({
        poem: data.poem,
        theme: selectedTheme,
        prompt: customPrompt,
        creativityLevel,
        poemLength,
        poeticDevices: selectedDevices,
      })
    } catch (error) {
      console.error("Error generating poem:", error)
      setError("An unexpected error occurred. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-8">
      {error && (
        <Alert variant="destructive" className="bg-destructive/10 border-destructive/50">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Card className="bg-card/50 backdrop-blur border-border/50 p-6 sm:p-8">
        <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
          <Wand2 className="w-5 h-5 text-accent" />
          Create Your Poem
        </h2>

        <div className="space-y-4 mb-6">
          <label className="block text-sm font-medium text-foreground">Choose a Theme</label>
          <ThemeSelector themes={themes} selectedTheme={selectedTheme} onSelectTheme={setSelectedTheme} />
        </div>

        <div className="space-y-4 mb-6">
          <label htmlFor="prompt" className="block text-sm font-medium text-foreground">
            Custom Prompt (Optional)
          </label>
          <Input
            id="prompt"
            placeholder="e.g., 'A poem about forgotten memories under starlight'"
            value={customPrompt}
            onChange={(e) => setCustomPrompt(e.target.value)}
            className="bg-input border-border/50 text-foreground placeholder:text-muted-foreground"
          />
        </div>

        <AdvancedControls
          creativityLevel={creativityLevel}
          onCreativityChange={setCreativityLevel}
          poemLength={poemLength}
          onPoemLengthChange={setPoemLength}
          selectedDevices={selectedDevices}
          onDevicesChange={setSelectedDevices}
        />

        <Button
          onClick={handleGeneratePoem}
          disabled={isLoading}
          className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-6 text-base mt-6"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 mr-2" />
              Generate Poem
            </>
          )}
        </Button>
      </Card>

      {poemResult && <PoemDisplay poem={poemResult.poem} theme={poemResult.theme} />}

      {!poemResult && !error && (
        <Card className="bg-card/30 border-border/30 p-6 text-center">
          <p className="text-muted-foreground">Select a theme and click generate to create a beautiful poem</p>
        </Card>
      )}
    </div>
  )
}
