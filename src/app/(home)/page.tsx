import { FilesClient } from "./FilesClient"
import { getFiles, type FileRecord } from "@/lib/file-service"
import { DbUnavailable } from "@/components/ui/db-unavailable"
import { DbErrorToast } from "@/components/ui/db-error-toast"

export const dynamic = 'force-dynamic'

export default async function HomePage() {
  let initialFiles: FileRecord[] = []
  let dbError = false

  try {
    initialFiles = await getFiles()
  } catch (error) {
    console.error("Error loading files:", error)
    dbError = true
  }

  if (dbError) {
    return (
      <div className="container mx-auto py-6">
        <DbErrorToast />
        <DbUnavailable />
      </div>
    )
  }

  return <FilesClient initialFiles={initialFiles} />
}
