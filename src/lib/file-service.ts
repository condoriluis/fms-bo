import { db } from "@/lib/db"

export const getFiles = async () => {
    const files = await db.file.findMany({
        orderBy: { date_created_file: "desc" }
    })
    return files.map(f => ({
        ...f,
        id_file: Number(f.id_file),
        size_file: f.size_file !== null ? Number(f.size_file) : null,
        id_mailchimp: f.id_mailchimp !== null ? Number(f.id_mailchimp) : null,
    }))
}

export type FileRecord = Awaited<ReturnType<typeof getFiles>>[number]
