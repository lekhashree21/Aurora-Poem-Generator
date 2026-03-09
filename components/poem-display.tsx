"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Copy, Download } from "lucide-react"
import { useState } from "react"

interface PoemDisplayProps {
  poem: string
  theme: string
}

export function PoemDisplay({ poem, theme }: PoemDisplayProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(poem)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleDownload = () => {
    const element = document.createElement("a")
    element.setAttribute("href", "data:text/plain;charset=utf-8," + encodeURIComponent(poem))
    element.setAttribute("download", `aurora-poem-${Date.now()}.txt`)
    element.style.display = "none"
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)
  }

  return (
    <Card className="bg-gradient-to-br from-card/80 to-card/40 backdrop-blur-md border-accent/30 p-8">
      <div className="prose prose-invert max-w-none mb-6">
        <div className="whitespace-pre-wrap text-lg leading-relaxed text-foreground font-light">{poem}</div>
      </div>

      <div className="flex gap-3 pt-6 border-t border-border/50">
        <Button
          onClick={handleCopy}
          variant="outline"
          className="flex-1 border-border/50 hover:bg-accent/10 hover:text-accent bg-transparent"
        >
          <Copy className="w-4 h-4 mr-2" />
          {copied ? "Copied!" : "Copy"}
        </Button>
        <Button
          onClick={handleDownload}
          variant="outline"
          className="flex-1 border-border/50 hover:bg-accent/10 hover:text-accent bg-transparent"
        >
          <Download className="w-4 h-4 mr-2" />
          Download
        </Button>
      </div>
    </Card>
  )
}
