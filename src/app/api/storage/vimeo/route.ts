import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';

const VIMEO_API = 'https://api.vimeo.com';

function vimeoHeaders(token: string, extra: Record<string, string> = {}) {
  return {
    Authorization: `Bearer ${token}`,
    Accept: 'application/vnd.vimeo.*+json;version=3.4',
    ...extra,
  };
}

// POST: crea el video en Vimeo y devuelve el upload_link para que el
// navegador suba los bytes directo con tus PATCH
// (las functions de Vercel tienen límite de 4.5MB en el body, el archivo no debe pasar por aquí)
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

  const body = await req.json().catch(() => ({}));
  const name = body.name as string | undefined;
  const size = Number(body.size);

  if (!name || !Number.isFinite(size) || size <= 0) {
    return NextResponse.json({ error: 'Se requiere name y size del video' }, { status: 400 });
  }

  try {
    const createRes = await fetch(`${VIMEO_API}/me/videos`, {
      method: 'POST',
      headers: vimeoHeaders(accessToken, { 'Content-Type': 'application/json' }),
      body: JSON.stringify({
        name,
        upload: { approach: 'tus', size },
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

    // El upload_link se autentica solo (ticket firmado); el token NO se expone al navegador
    return NextResponse.json({ uploadLink, url: videoUrl });
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
