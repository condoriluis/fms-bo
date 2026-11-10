import type { File as FileModel } from "@prisma/client"
import { db, withRetry } from "@/lib/db"
import { fetchVimeoThumbnail, parseVimeoId } from "@/lib/vimeo"

/**
 * Completa la miniatura de los archivos de Vimeo que no la tienen:
 * Vimeo la genera al terminar de transcodificar (1-5 min tras la subida),
 * por lo que se hidrata al listar en lugar de bloquear la subida con polling.
 * Persiste el resultado en la BD para no repetir la consulta a la API.
 */
async function hydrateVimeoThumbnails(files: FileModel[]): Promise<FileModel[]> {
  const targets = files
    .filter((f) => f.thumbnail_vimeo_file === null)
    .map((f) => ({ file: f, videoId: parseVimeoId(f.url_file) }))
    .filter((t): t is { file: FileModel; videoId: string } => t.videoId !== null)

  if (targets.length === 0) return files

  const results = await Promise.allSettled(
    targets.map(async ({ file, videoId }) => {
      const thumbnail = await fetchVimeoThumbnail(videoId)
      if (!thumbnail) return null

      await withRetry(() =>
        db.file.update({
          where: { id_file: file.id_file },
          data: { thumbnail_vimeo_file: thumbnail },
        })
      )
      return { idFile: file.id_file, thumbnail }
    })
  )

  const byId = new Map<number, string>()
  for (const result of results) {
    if (result.status === "fulfilled" && result.value) {
      byId.set(result.value.idFile, result.value.thumbnail)
    }
  }

  return files.map((f) =>
    f.thumbnail_vimeo_file === null && byId.has(f.id_file)
      ? { ...f, thumbnail_vimeo_file: byId.get(f.id_file) ?? null }
      : f
  )
}

export const getFiles = async () => {
  const files = await withRetry(() =>
    db.file.findMany({
      orderBy: { date_created_file: "desc" },
    })
  )
  const hydrated = await hydrateVimeoThumbnails(files)
  return hydrated.map((f) => ({
    ...f,
    id_file: Number(f.id_file),
    size_file: f.size_file !== null ? Number(f.size_file) : null,
    id_mailchimp: f.id_mailchimp !== null ? Number(f.id_mailchimp) : null,
  }))
}

export type FileRecord = Awaited<ReturnType<typeof getFiles>>[number]
