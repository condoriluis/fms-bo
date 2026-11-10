import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';

const VIMEO_API = 'https://api.vimeo.com';
const TUS_CHUNK_SIZE = 256 * 1024 * 1024; // 256 MB

function vimeoHeaders(token: string, extra: Record<string, string> = {}) {
  return {
    Authorization: `Bearer ${token}`,
    Accept: 'application/vnd.vimeo.*+json;version=3.4',
    ...extra,
  };
}

export async function POST(req: NextRequest) {
  const session = await auth();

  if (!session?.user) {
    return NextResponse.json(
      { error: 'Debe iniciar sesión para subir archivos' },
      { status: 401 }
    );
  }

  const accessToken = process.env.VIMEO_ACCESS_TOKEN;
  if (!accessToken) {
    return NextResponse.json({ error: 'Falta el ACCESS TOKEN de Vimeo' }, { status: 400 });
  }

  const formData = await req.formData();
  const file = formData.get('file') as File;

  if (!file) {
    return NextResponse.json({ error: 'No file provided' }, { status: 400 });
  }

  if (!file.type.startsWith('video/')) {
    return NextResponse.json(
      { error: 'Vimeo solo acepta archivos de video (MP4, MOV, AVI, MKV, WebM, WMV)' },
      { status: 400 }
    );
  }

  try {
    // Paso 1: crear el video y obtener el link de subida (approach tus)
    const createRes = await fetch(`${VIMEO_API}/me/videos`, {
      method: 'POST',
      headers: vimeoHeaders(accessToken, { 'Content-Type': 'application/json' }),
      body: JSON.stringify({
        name: file.name.replace(/\.[^/.]+$/, ''),
        upload: { approach: 'tus', size: file.size },
      }),
    });

    const created = await createRes.json().catch(() => null);
    if (!createRes.ok) {
      throw new Error(created?.error || 'Error creando el video en Vimeo');
    }

    const uploadLink = created?.upload?.upload_link;
    const videoUrl = created?.link;
    if (!uploadLink || !videoUrl) {
      throw new Error('No se obtuvo el link de subida de Vimeo');
    }

    // Paso 2: enviar los bytes del video con PATCH (protocolo tus, reanudable)
    const buffer = Buffer.from(await file.arrayBuffer());
    let offset = 0;

    while (offset < buffer.length) {
      const end = Math.min(offset + TUS_CHUNK_SIZE, buffer.length);
      const patchRes = await fetch(uploadLink, {
        method: 'PATCH',
        headers: {
          'Tus-Resumable': '1.0.0',
          'Upload-Offset': String(offset),
          'Content-Type': 'application/offset+octet-stream',
        },
        body: buffer.subarray(offset, end),
      });

      if (!patchRes.ok) {
        throw new Error(`Error subiendo el video a Vimeo (HTTP ${patchRes.status})`);
      }

      const confirmed = Number(patchRes.headers.get('upload-offset') ?? end);
      if (confirmed <= offset && end < buffer.length) {
        throw new Error('Vimeo no confirmó los bytes subidos');
      }
      offset = confirmed;
    }

    return NextResponse.json({ url: videoUrl });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Upload failed' },
      { status: 500 }
    );
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

    const accessToken = process.env.VIMEO_ACCESS_TOKEN;
    if (!accessToken) {
      return NextResponse.json({ error: 'Falta el ACCESS TOKEN de Vimeo' }, { status: 400 });
    }

    // El id del video se extrae de la URL guardada (https://vimeo.com/{id})
    const match = String(fileUrl).match(/vimeo\.com\/(?:video\/)?(\d+)/);
    if (!match) {
      return NextResponse.json({ error: 'URL de Vimeo no válida' }, { status: 400 });
    }

    const res = await fetch(`${VIMEO_API}/videos/${match[1]}`, {
      method: 'DELETE',
      headers: vimeoHeaders(accessToken),
    });

    // Un 404 indica que el video remoto ya no existe. En ese caso se puede
    // eliminar con seguridad su registro local para que no quede un archivo huérfano.
    if (!res.ok && res.status !== 404) {
      const data = await res.json().catch(() => null);
      throw new Error(data?.error || 'Error deleting file from Vimeo');
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
