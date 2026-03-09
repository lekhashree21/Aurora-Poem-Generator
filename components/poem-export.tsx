"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Copy, Share2, Download } from "lucide-react"

interface PoemExportProps {
  poem: {
    id: string
    title: string
    content: string
    theme: string
    created_at: string
  }
}

export function PoemExport({ poem }: PoemExportProps) {
  const [copied, setCopied] = useState(false)
  const [shareUrl, setShareUrl] = useState<string | null>(null)
  const [isGeneratingShare, setIsGeneratingShare] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(poem.content)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleDownloadTxt = () => {
    const element = document.createElement("a")
    element.setAttribute("href", "data:text/plain;charset=utf-8," + encodeURIComponent(poem.content))
    element.setAttribute("download", `${poem.title || "poem"}-${Date.now()}.txt`)
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)
  }

  const handleGenerateShareLink = async () => {
    setIsGeneratingShare(true)
    try {
      const response = await fetch("/api/share", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          poemId: poem.id,
          expiresIn: 7 * 24 * 60 * 60, // 7 days
        }),
      })

      if (response.ok) {
        const data = await response.json()
        setShareUrl(data.shareUrl)
      }
    } catch (error) {
      console.error("Error generating share link:", error)
    } finally {
      setIsGeneratingShare(false)
    }
  }

  if (shareUrl) {
    return (
      <Card className="bg-card/30 border-border/30 p-6">
        <h3 className="font-semibold mb-4">Shared Link</h3>
        <div className="flex gap-2">
          <input
            type="text"
            readOnly
            value={shareUrl}
            className="flex-1 px-3 py-2 bg-input rounded border border-border/50"
          />
          <Button
            onClick={() => {
              navigator.clipboard.writeText(shareUrl)
              setCopied(true)
              setTimeout(() => setCopied(false), 2000)
            }}
            size="sm"
          >
            {copied ? "Copied!" : "Copy"}
          </Button>
        </div>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      <h3 className="font-semibold">Export & Share</h3>
      <div className="grid grid-cols-2 gap-3">
        <Button onClick={handleCopy} variant="outline" className="border-border/50 bg-transparent">
          <Copy className="w-4 h-4 mr-2" />
          Copy Text
        </Button>
        <Button onClick={handleDownloadTxt} variant="outline" className="border-border/50 bg-transparent">
          <Download className="w-4 h-4 mr-2" />
          Download
        </Button>
        <Button
          onClick={handleGenerateShareLink}
          disabled={isGeneratingShare}
          variant="outline"
          className="border-border/50 bg-transparent col-span-2"
        >
          <Share2 className="w-4 h-4 mr-2" />
          {isGeneratingShare ? "Generating..." : "Create Share Link"}
        </Button>
      </div>
    </div>
  )
}
