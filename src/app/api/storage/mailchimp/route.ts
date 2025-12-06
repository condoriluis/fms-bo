import { NextRequest, NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabase/server';

export async function POST(req: NextRequest) {

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
    return NextResponse.json({ error: 'No file provided' }, { status: 400 });
  }

  const apiKey = process.env.MAILCHIMP_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: 'Falta la API KEY de Mailchimp' }, { status: 400 });
  }

  const serverPrefix = apiKey.split('-')[1];

  const arrayBuffer = await file.arrayBuffer();
  const base64File = Buffer.from(arrayBuffer).toString('base64');

  const payload = {
    name: file.name,
    file_data: base64File,
  };

  try {
    const res = await fetch(`https://${serverPrefix}.api.mailchimp.com/3.0/file-manager/files`, {
      method: 'POST',
      headers: {
        Authorization: `Basic ${Buffer.from(`anystring:${apiKey}`).toString('base64')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.detail || 'Error uploading file to Mailchimp');
    }

    return NextResponse.json({ id: data.id, url: data.full_size_url });
   
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : 'Unknown error' }, { status: 500 });
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

    const { idMailchimp } = await req.json();
    if (!idMailchimp) return NextResponse.json({ error: 'idMailchimp no proporcionado' }, { status: 400 });

    const apiKey = process.env.MAILCHIMP_API_KEY;
    if (!apiKey) return NextResponse.json({ error: 'Falta la API KEY de Mailchimp' }, { status: 400 });

    const serverPrefix = apiKey.split('-')[1];

    const res = await fetch(`https://${serverPrefix}.api.mailchimp.com/3.0/file-manager/files/${idMailchimp}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Basic ${Buffer.from(`anystring:${apiKey}`).toString('base64')}`,
      },
    });

    if (!res.ok) {
      const data = await res.json();
      throw new Error(data.detail || 'Error deleting file from Mailchimp');
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: err instanceof Error ? err.message : 'Unknown error' }, { status: 500 });
  }
}