"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui"
import { getFileIcon, isImageFile } from "../utils/fileIcons"
import { Download, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui"
import type { UploadFile } from "@/lib/constants/typeFile"

interface FilePreviewDialogProps {
  file: UploadFile | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function FilePreviewDialog({ file, open, onOpenChange }: FilePreviewDialogProps) {
  if (!file) return null

  const ext = (file.extension_file || "").toLowerCase().replace(".", "")
  const isImage = isImageFile(file.extension_file)
  const isPdf = ext === "pdf"
    const isVideo = file.type_file?.startsWith("video/")
    const isVimeo = /vimeo\.com\/(?:video\/)?(\d+)/.test(file.url_file ?? "")
    const vimeoId = file.url_file?.match(/vimeo\.com\/(?:video\/)?(\d+)/)?.[1]
  const isAudio = file.type_file?.startsWith("audio/")
  const isText = ext === "txt"

  const renderPreview = () => {
    if (isImage && file.preview) {
      return (
        <div className="flex items-center justify-center w-full h-full max-h-[70vh] p-2">
          <img
            src={file.preview}
            alt={file.name_file}
            className="max-w-full max-h-[70vh] object-contain rounded-md"
          />
        </div>
      )
    }

    if (isPdf && file.url_file) {
      return (
        <iframe
          src={file.url_file}
          className="w-full h-[70vh] rounded-md border"
          title={file.name_file}
        />
      )
    }

    if (isVimeo && vimeoId) {
      return (
        <div className="flex items-center justify-center w-full p-2">
          <iframe
            src={`https://player.vimeo.com/video/${vimeoId}`}
            className="w-full aspect-video max-h-[70vh] rounded-md border"
            allow="autoplay; fullscreen; picture-in-picture"
            allowFullScreen
            title={file.name_file}
          />
        </div>
      )
    }

    if (isVideo && file.url_file) {
      return (
        <div className="flex items-center justify-center w-full p-2">
          <video
            src={file.url_file}
            controls
            className="max-w-full max-h-[70vh] rounded-md"
          />
        </div>
      )
    }

    if (isAudio && file.url_file) {
      return (
        <div className="flex flex-col items-center justify-center gap-6 py-10">
          <div className="w-24 h-24 flex items-center justify-center">
            {getFileIcon(file.extension_file, "lg")}
          </div>
          <audio src={file.url_file} controls className="w-full max-w-md" />
        </div>
      )
    }

    if (isText && file.url_file) {
      return (
        <iframe
          src={file.url_file}
          className="w-full h-[70vh] rounded-md border bg-white"
          title={file.name_file}
        />
      )
    }

    return (
      <div className="flex flex-col items-center justify-center gap-4 py-10">
        <div className="w-24 h-24 flex items-center justify-center">
          {getFileIcon(file.extension_file, "lg")}
        </div>
        <p className="text-sm text-muted-foreground text-center">
          Vista previa no disponible para este tipo de archivo.
        </p>
      </div>
    )
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl lg:max-w-4xl max-h-[90vh] overflow-hidden flex flex-col p-0">
        <DialogHeader className="px-6 pt-6 pb-2">
          <DialogTitle className="truncate text-base">{file.name_file}{file.extension_file}</DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-auto px-6 pb-2">
          {renderPreview()}
        </div>

        <div className="flex items-center justify-between px-6 py-3 border-t bg-muted/30">
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <span className="font-mono">{file.size_file_display}</span>
            <span>·</span>
            <span>{new Date(file.date_updated_file).toLocaleDateString()}</span>
          </div>
          <div className="flex items-center gap-2">
            {file.url_file && (
              <>
                <Button variant="outline" size="sm" asChild>
                  <a href={file.url_file} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="w-3.5 h-3.5 mr-1.5" />
                    Abrir
                  </a>
                </Button>
                <Button variant="outline" size="sm" asChild>
                  <a href={file.url_file} download={file.name_file + file.extension_file}>
                    <Download className="w-3.5 h-3.5 mr-1.5" />
                    Descargar
                  </a>
                </Button>
              </>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
