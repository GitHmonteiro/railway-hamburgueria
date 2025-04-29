"use client"

import { Button } from "@/components/ui/button"
import { X } from "lucide-react"

interface IframeModalProps {
  url: string
  onClose: () => void
}

export function IframeModal({ url, onClose }: IframeModalProps) {
  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-4xl h-[90vh] flex flex-col relative">
        {/* Header with close button */}
        <div className="absolute top-2 right-2 z-10">
          <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full bg-white/80 hover:bg-white">
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Iframe container - takes full height and width */}
        <div className="flex-1 w-full h-full overflow-hidden">
          <iframe
            src={url}
            className="w-full h-full border-0"
            title="Checkout"
            sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
            loading="lazy"
            style={{ minHeight: "100%" }}
          />
        </div>

        {/* No confirm button as requested */}
      </div>
    </div>
  )
}
