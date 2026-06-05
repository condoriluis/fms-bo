"use client"

import { useEffect } from "react"
import { toast } from "sonner"

export function DbErrorToast() {
  useEffect(() => {
    toast.error("Base de datos no disponible", {
      description: "No se pudo conectar al servidor de base de datos. Algunos contenidos pueden no estar disponibles.",
      duration: 8000,
    })
  }, [])

  return null
}
