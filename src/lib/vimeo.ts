const VIMEO_API = "https://api.vimeo.com"

export function vimeoHeaders(token: string, extra: Record<string, string> = {}) {
  return {
    Authorization: `Bearer ${token}`,
    Accept: "application/vnd.vimeo.*+json;version=3.4",
    ...extra,
  }
}

/**
 * Extrae el id numérico de un enlace de Vimeo
 * (https://vimeo.com/{id} o https://player.vimeo.com/video/{id})
 */
export function parseVimeoId(url: string): string | null {
  const match = String(url).match(/vimeo\.com\/(?:video\/)?(\d+)/)
  return match?.[1] ?? null
}

/**
 * Devuelve la miniatura en mayor calidad de un video de Vimeo,
 * o null si Vimeo aún no la generó (transcodificación en curso),
 * si el token no está configurado o si falla la petición.
 */
export async function fetchVimeoThumbnail(videoId: string): Promise<string | null> {
  const accessToken = process.env.VIMEO_ACCESS_TOKEN
  if (!accessToken) return null

  try {
    const res = await fetch(`${VIMEO_API}/videos/${videoId}?fields=pictures.sizes`, {
      headers: vimeoHeaders(accessToken),
      signal: AbortSignal.timeout(5000),
      cache: "no-store",
    })
    if (!res.ok) return null

    const data: unknown = await res.json().catch(() => null)
    const sizes = (data as { pictures?: { sizes?: Array<{ link?: unknown }> } } | null)?.pictures
      ?.sizes
    if (!Array.isArray(sizes) || sizes.length === 0) return null

    // Vimeo ordena los tamaños de menor a mayor
    const largest = sizes[sizes.length - 1]
    return typeof largest?.link === "string" ? largest.link : null
  } catch {
    return null
  }
}
