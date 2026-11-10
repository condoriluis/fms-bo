import { NextRequest, NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';
import { auth } from '@/lib/auth';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// POST: firma los parámetros para que el navegador suba directo a Cloudinary
// (las functions de Vercel tienen límite de 4.5MB en el body, el archivo no debe pasar por aquí)
export async function POST(req: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json(
        { error: 'Debe iniciar sesión para subir archivos' },
        { status: 401 }
      );
    }

    const apiKey = process.env.CLOUDINARY_API_KEY;
    const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
    const apiSecret = process.env.CLOUDINARY_API_SECRET;
    if (!apiKey || !cloudName || !apiSecret) {
      return NextResponse.json({ error: 'Faltan las credenciales de Cloudinary' }, { status: 400 });
    }

    const body = await req.json();
    const fileName = body.fileName as string | undefined;
    const mimeType = body.mimeType as string | undefined;
    if (!fileName) return NextResponse.json({ error: 'No fileName provided' }, { status: 400 });

    let resource_type: 'image' | 'video' | 'raw' = 'raw';

    if (mimeType?.startsWith('image/')) {
      resource_type = 'image';
    } else if (mimeType?.startsWith('video/') || mimeType?.startsWith('audio/')) {
      resource_type = 'video';
    }

    const public_id = fileName.replace(/\.[^/.]+$/, '');
    const timestamp = Math.round(Date.now() / 1000);

    // Solo los parámetros enviados en el FormData (excepto file, api_key y cloud_name) se firman
    const signature = cloudinary.utils.api_sign_request(
      { folder: 'files', public_id, timestamp },
      apiSecret
    );

    return NextResponse.json({
      signature,
      timestamp,
      apiKey,
      cloudName,
      publicId: public_id,
      resourceType: resource_type,
    });
  } catch {
    return NextResponse.json({ error: 'Signature failed' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user) {
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
  } catch {
    return NextResponse.json({ error: 'Delete failed' }, { status: 500 });
  }
}
