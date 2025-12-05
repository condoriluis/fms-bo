import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { supabaseServer } from '@/lib/supabase/server';

function sanitizeFileName(name: string) {
  return name
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9.\-_]/g, '');
}

export async function POST(req: NextRequest) {
  try {

    const supabase = await supabaseServer();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Debe iniciar sesión para subir archivos' },
        { status: 401 }
      );
    }

    const formData = await req.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json(
        { error: 'No se proporcionó ningún archivo' },
        { status: 400 }
      );
    }

    const allowedTypes = [
      'application/zip',
      'text/plain',
      'audio/mpeg',
      'application/pdf',
    ];
    const isImage = file.type.startsWith('image/');
    const isAllowed = allowedTypes.includes(file.type);

    if (!isImage && !isAllowed) {
      return NextResponse.json(
        { error: 'Solo se permiten archivos de imagen, zip, txt, mp3 o pdf' },
        { status: 400 }
      );
    }

    const uploadDir = path.join(process.cwd(), 'public', 'assets', 'images');
    if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const safeFileName = sanitizeFileName(file.name);
    const filePath = path.join(uploadDir, safeFileName);
    fs.writeFileSync(filePath, buffer);

    const url = `${process.env.NEXT_PUBLIC_SITE_URL}/assets/images/${safeFileName}`;
    return NextResponse.json({ url });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Error al subir el archivo' }, { status: 500 });
  }
}

// ================= DELETE =================
export async function DELETE(req: NextRequest) {
  try {

    const supabase = await supabaseServer();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Debe iniciar sesión para eliminar archivos' },
        { status: 401 }
      );
    }

    const { fileUrl } = await req.json();

    if (!fileUrl) {
      return NextResponse.json({ error: 'No se proporcionó fileUrl' }, { status: 400 });
    }

    const fileName = path.basename(fileUrl);
    const filePath = path.join(process.cwd(), 'public', 'assets', 'images', fileName);

    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: 'Error al eliminar el archivo' }, { status: 500 });
  }
}
