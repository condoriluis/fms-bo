import { ServerCrash } from "lucide-react"

export function DbUnavailable() {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center text-muted-foreground space-y-3">
      <ServerCrash className="w-12 h-12 opacity-30" />
      <p className="text-lg font-medium">Archivos no disponibles</p>
      <p className="text-sm max-w-xs">
        El servidor de base de datos no está respondiendo. Intenta de nuevo más tarde.
      </p>
    </div>
  )
}
