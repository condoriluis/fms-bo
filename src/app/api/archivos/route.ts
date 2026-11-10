import { NextResponse } from "next/server"
import { FileService } from "./FileService"
import { auth } from "@/lib/auth"

function isValidFileId(value: unknown): value is number {
  return typeof value === "number" && Number.isSafeInteger(value) && value > 0
}

// GET: ver archivos (público)
export async function GET() {
  try {
    const files = await FileService.getFiles()
    return NextResponse.json(files)
  } catch {
    return NextResponse.json({ error: "Error al obtener archivos" }, { status: 500 })
  }
}

// POST: crear archivo (solo admin)
export async function POST(req: Request) {
  const session = await auth()
  
  if (!session?.user || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "No autorizado" }, { status: 403 })
  }

  const body = await req.json()
  if (!body.name_file || !body.name_folder_file || !body.extension_file || !body.type_file || typeof body.size_file !== "number" || body.size_file < 0 || !body.url_file) {
    return NextResponse.json({ error: "Faltan campos requeridos" }, { status: 400 })
  }

  try {
    const newFileId = await FileService.createFile(
      body.name_file,
      body.name_folder_file,
      body.extension_file,
      body.type_file,
      body.size_file,
      body.url_file,
      body.id_mailchimp ?? null
    )

    const newFile = await FileService.getFileById(Number(newFileId.id_file))
    return NextResponse.json(newFile, { status: 201 })
  } catch {
    return NextResponse.json({ error: "Error al crear archivo" }, { status: 500 })
  }
}

// PATCH: actualizar nombre archivo (solo admin)
export async function PATCH(req: Request) {
  const session = await auth()
  
  if (!session?.user || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "No autorizado" }, { status: 403 })
  }

  const { id_file, name_file } = await req.json()
  const numId = Number(id_file)
  if (!isValidFileId(numId) || typeof name_file !== "string" || !name_file.trim()) return NextResponse.json({ error: "Datos inválidos" }, { status: 400 })

  try {
    await FileService.updateFileName(numId, name_file.trim())
    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ error: "Error al actualizar" }, { status: 500 })
  }
}

// DELETE: eliminar archivo (solo admin)
export async function DELETE(req: Request) {
  const session = await auth()
  
  if (!session?.user || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "No autorizado" }, { status: 403 })
  }

  const { id_file } = await req.json()
  const numId = Number(id_file)
  if (!isValidFileId(numId)) return NextResponse.json({ error: "ID de archivo inválido" }, { status: 400 })

  try {
    await FileService.deleteFile(numId)
    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ error: "Error al eliminar archivo" }, { status: 500 })
  }
}
