"use client"

import { Slider } from "@/components/ui/slider"
import { Card } from "@/components/ui/card"
import { ChevronDown, ChevronUp } from "lucide-react"
import { useState } from "react"

const POETIC_DEVICES = [
  { id: "metaphor", label: "Metaphor" },
  { id: "simile", label: "Simile" },
  { id: "alliteration", label: "Alliteration" },
  { id: "personification", label: "Personification" },
  { id: "imagery", label: "Imagery" },
  { id: "symbolism", label: "Symbolism" },
  { id: "rhyme", label: "Rhyme Scheme" },
  { id: "rhythm", label: "Rhythm & Meter" },
]

interface AdvancedControlsProps {
  creativityLevel: number
  onCreativityChange: (value: number) => void
  poemLength: number
  onPoemLengthChange: (value: number) => void
  selectedDevices: string[]
  onDevicesChange: (devices: string[]) => void
}

export function AdvancedControls({
  creativityLevel,
  onCreativityChange,
  poemLength,
  onPoemLengthChange,
  selectedDevices,
  onDevicesChange,
}: AdvancedControlsProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  const toggleDevice = (deviceId: string) => {
    onDevicesChange(
      selectedDevices.includes(deviceId)
        ? selectedDevices.filter((d) => d !== deviceId)
        : [...selectedDevices, deviceId],
    )
  }

  return (
    <div className="space-y-4">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between px-4 py-3 rounded-lg border border-border/50 hover:bg-card/30 transition-colors"
      >
        <span className="font-medium">Advanced Generation Options</span>
        {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
      </button>

      {isExpanded && (
        <Card className="bg-card/30 border-border/30 p-6 space-y-6">
          {/* Creativity Level */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <label className="text-sm font-medium">Creativity Level</label>
              <span className="text-xs bg-primary/20 text-primary px-2 py-1 rounded">{creativityLevel}/10</span>
            </div>
            <Slider
              min={1}
              max={10}
              step={1}
              value={[creativityLevel]}
              onValueChange={(value) => onCreativityChange(value[0])}
              className="w-full"
            />
            <p className="text-xs text-muted-foreground">
              {creativityLevel <= 3
                ? "Structured and predictable"
                : creativityLevel <= 6
                  ? "Balanced creativity"
                  : "Highly creative and experimental"}
            </p>
          </div>

          {/* Poem Length */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <label className="text-sm font-medium">Poem Length</label>
              <span className="text-xs bg-primary/20 text-primary px-2 py-1 rounded">{poemLength} lines</span>
            </div>
            <Slider
              min={8}
              max={32}
              step={2}
              value={[poemLength]}
              onValueChange={(value) => onPoemLengthChange(value[0])}
              className="w-full"
            />
          </div>

          {/* Poetic Devices */}
          <div className="space-y-3">
            <label className="text-sm font-medium block">Poetic Devices</label>
            <div className="grid grid-cols-2 gap-2">
              {POETIC_DEVICES.map((device) => (
                <button
                  key={device.id}
                  onClick={() => toggleDevice(device.id)}
                  className={`px-3 py-2 rounded-lg text-sm transition-all border ${
                    selectedDevices.includes(device.id)
                      ? "bg-accent/20 border-accent text-accent"
                      : "border-border/50 hover:border-accent/50 text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {device.label}
                </button>
              ))}
            </div>
          </div>
        </Card>
      )}
    </div>
  )
}
