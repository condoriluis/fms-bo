import { NextResponse } from "next/server";
import { FileService } from "./FileService";
import { supabaseServer } from "@/lib/supabase/server";

// GET: ver archivos (público)
export async function GET() {
  try {
    const files = await FileService.getFiles();
    return NextResponse.json(files);
  } catch (error) {
    return NextResponse.json({ error: "Error al obtener archivos" }, { status: 500 });
  }
}

// POST: crear archivo
export async function POST(req: Request) {
  const supabase = await supabaseServer();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "No autorizado" }, { status: 403 });
  }

  const body = await req.json();
  if (!body.name_file || !body.name_folder_file || !body.extension_file || !body.type_file || !body.size_file || !body.url_file) {
    return NextResponse.json({ error: "Faltan campos requeridos" }, { status: 400 });
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
    );

    const newFile = await FileService.getFileById(newFileId.id_file);
    return NextResponse.json(newFile, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Error al crear archivo" }, { status: 500 });
  }
}

// PATCH: actualizar nombre archivo
export async function PATCH(req: Request) {
  const supabase = await supabaseServer();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "No autorizado" }, { status: 403 });
  }

  const { id_file, name_file } = await req.json();
  if (!id_file || !name_file) return NextResponse.json({ error: "Faltan campos" }, { status: 400 });

  try {
    await FileService.updateFileName(Number(id_file), name_file);
    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json({ error: "Error al actualizar" }, { status: 500 });
  }
}

// DELETE: eliminar archivo
export async function DELETE(req: Request) {
  const supabase = await supabaseServer();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "No autorizado" }, { status: 403 });
  }

  const { id_file } = await req.json();
  if (!id_file) return NextResponse.json({ error: "Faltan campos" }, { status: 400 });

  try {
    await FileService.deleteFile(Number(id_file));
    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json({ error: "Error al eliminar archivo" }, { status: 500 });
  }
}
