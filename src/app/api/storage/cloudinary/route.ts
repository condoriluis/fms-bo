import { NextRequest, NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';
import { supabaseServer } from '@/lib/supabase/server';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

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

    if (!file) return NextResponse.json({ error: 'No file provided' }, { status: 400 });

    const apiKey = process.env.CLOUDINARY_API_KEY;
    if (!apiKey) return NextResponse.json({ error: 'Falta la API KEY de Cloudinary' }, { status: 400 });

    const buffer = Buffer.from(await file.arrayBuffer());
    const mimeType = file.type;
    const fileName = file.name;

    let resource_type: "image" | "video" | "audio" | "raw" = "raw";

    if (mimeType.startsWith("image/")) {
      resource_type = "image";
    } else if (mimeType.startsWith("video/") || mimeType.startsWith("audio/")) {
      resource_type = "video";
    } else {
      resource_type = "raw";
    }

    const result = await new Promise<{ secure_url: string }>((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream({ folder: 'files', resource_type, public_id: fileName.replace(/\.[^/.]+$/, ""), }, (err, res) => {
        if (err) reject(err);
        else resolve(res as any);
      });
      stream.end(buffer);
    });

    return NextResponse.json({ url: result.secure_url });
  } catch (err) {
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
  }
}

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
    if (!fileUrl) return NextResponse.json({ error: 'No fileUrl provided' }, { status: 400 });

    const apiKey = process.env.CLOUDINARY_API_KEY;
    if (!apiKey) return NextResponse.json({ error: 'Falta la API KEY de Cloudinary' }, { status: 400 });

    const urlParts = fileUrl.split('/');
    const fileNameWithExt = urlParts[urlParts.length - 1];
    const folderName = urlParts[urlParts.length - 2];
    const publicId = `${folderName}/${fileNameWithExt.split('.')[0]}`;

    await cloudinary.uploader.destroy(publicId);

    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: 'Delete failed' }, { status: 500 });
  }
}