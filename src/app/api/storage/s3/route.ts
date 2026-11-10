import { NextRequest, NextResponse } from 'next/server';
import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { auth } from '@/lib/auth';

const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

function sanitizeFileName(name: string) {
  return name
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9.\-_]/g, '');
}

// POST: genera una presigned URL para que el navegador suba directo a S3
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

    const bucket = process.env.AWS_BUCKET_NAME;
    const region = process.env.AWS_REGION;
    const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
    if (!bucket || !region || !accessKeyId) {
      return NextResponse.json({ error: 'Falta la configuración de AWS S3' }, { status: 400 });
    }

    const body = await req.json();
    const fileName = typeof body?.fileName === 'string' ? body.fileName : '';
    const contentType = typeof body?.contentType === 'string' ? body.contentType : '';
    if (!fileName || !contentType) {
      return NextResponse.json({ error: 'Se requiere fileName y contentType' }, { status: 400 });
    }

    const key = `uploads/${Date.now()}-${sanitizeFileName(fileName)}`;

    const uploadUrl = await getSignedUrl(
      s3,
      new PutObjectCommand({
        Bucket: bucket,
        Key: key,
        ContentType: contentType,
        ACL: 'public-read',
      }),
      { expiresIn: 300 }
    );

    const publicUrl = `https://${bucket}.s3.${region}.amazonaws.com/${key}`;

    return NextResponse.json({ uploadUrl, publicUrl });
  } catch {
    return NextResponse.json({ error: 'No se pudo generar la URL de subida' }, { status: 500 });
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

    const bucket = process.env.AWS_BUCKET_NAME;
    if (!bucket) return NextResponse.json({ error: 'Falta la configuración de AWS S3' }, { status: 400 });

    const { fileUrl } = await req.json();
    if (!fileUrl) return NextResponse.json({ error: 'No fileUrl provided' }, { status: 400 });

    const url = new URL(fileUrl);
    const key = url.pathname.substring(1);

    await s3.send(
      new DeleteObjectCommand({
        Bucket: bucket,
        Key: key,
      })
    );

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Delete failed' }, { status: 500 });
  }
}
