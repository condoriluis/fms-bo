import type { UploadFile } from '@/lib/constants/typeFile';

export type StorageFolder = 'Server' | 'AWS S3' | 'Cloudinary' | 'Mailchimp' | 'Vimeo';

export interface UploadResult {
  url: string;
  mailchimpId?: number;
}

export type ProgressCallback = (percent: number) => void;

interface CloudinarySignature {
  signature: string;
  timestamp: number;
  apiKey: string;
  cloudName: string;
  publicId: string;
  resourceType: 'image' | 'video' | 'raw';
}

interface S3PresignedUpload {
  uploadUrl: string;
  publicUrl: string;
}

interface VimeoUploadTicket {
  uploadLink: string;
  url: string;
}

function sendWithProgress(
  method: string,
  url: string,
  body: FormData | File,
  headers: Record<string, string> = {},
  onProgress?: ProgressCallback
): Promise<string> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open(method, url);
    Object.entries(headers).forEach(([key, value]) => xhr.setRequestHeader(key, value));

    xhr.upload.onprogress = (event) => {
      if (onProgress && event.lengthComputable) {
        onProgress(Math.round((event.loaded / event.total) * 100));
      }
    };

    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        resolve(xhr.responseText);
        return;
      }

      let message = `Error ${xhr.status}: ${xhr.statusText}`;
      try {
        const parsed = JSON.parse(xhr.responseText);
        if (parsed?.error) message = parsed.error;
      } catch {
        // respuesta sin JSON
      }
      reject(new Error(message));
    };

    xhr.onerror = () => reject(new Error('Error de red'));
    xhr.send(body);
  });
}

async function postJson<T>(url: string, body: unknown): Promise<T> {
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  const data = await res.json().catch(() => null);
  if (!res.ok) {
    throw new Error(data?.error || `Error ${res.status} al contactar ${url}`);
  }
  return data as T;
}

// Server y Mailchimp: el archivo pasa por la API (archivos pequeños)
async function uploadViaApi(
  endpoint: string,
  file: File,
  onProgress?: ProgressCallback
): Promise<UploadResult> {
  const formData = new FormData();
  formData.append('file', file);

  const response = await sendWithProgress('POST', endpoint, formData, {}, onProgress);
  const data = JSON.parse(response);
  if (!data?.url) throw new Error('No se obtuvo la URL del archivo subido');
  return { url: data.url, mailchimpId: data.id };
}

// Cloudinary: nuestra API firma los parámetros, el navegador sube directo
async function uploadToCloudinary(
  file: File,
  mimeType: string,
  onProgress?: ProgressCallback
): Promise<UploadResult> {
  const sig = await postJson<CloudinarySignature>('/api/storage/cloudinary', {
    fileName: file.name,
    mimeType,
  });

  const formData = new FormData();
  formData.append('file', file);
  formData.append('api_key', sig.apiKey);
  formData.append('timestamp', String(sig.timestamp));
  formData.append('folder', 'files');
  formData.append('public_id', sig.publicId);
  formData.append('signature', sig.signature);

  const response = await sendWithProgress(
    'POST',
    `https://api.cloudinary.com/v1_1/${sig.cloudName}/${sig.resourceType}/upload`,
    formData,
    {},
    onProgress
  );

  const data = JSON.parse(response);
  if (!data.secure_url) throw new Error('No se obtuvo la URL de Cloudinary');
  return { url: data.secure_url };
}

// AWS S3: nuestra API genera una presigned URL, el navegador hace PUT directo
async function uploadToS3(file: File, onProgress?: ProgressCallback): Promise<UploadResult> {
  const presigned = await postJson<S3PresignedUpload>('/api/storage/s3', {
    fileName: file.name,
    contentType: file.type,
  });

  await sendWithProgress(
    'PUT',
    presigned.uploadUrl,
    file,
    {
      'Content-Type': file.type,
      'x-amz-acl': 'public-read',
    },
    onProgress
  );

  return { url: presigned.publicUrl };
}

// Vimeo: nuestra API crea el video y devuelve el ticket tus (autenticado por
// sí mismo), el navegador envía los bytes con PATCH. El token nunca se expone.
async function uploadToVimeo(
  file: File,
  name: string,
  onProgress?: ProgressCallback
): Promise<UploadResult> {
  const ticket = await postJson<VimeoUploadTicket>('/api/storage/vimeo', {
    name,
    size: file.size,
  });

  await sendWithProgress(
    'PATCH',
    ticket.uploadLink,
    file,
    {
      'Tus-Resumable': '1.0.0',
      'Upload-Offset': '0',
      'Content-Type': 'application/offset+octet-stream',
    },
    onProgress
  );

  // Verificación tus (paso 3 de la documentación de Vimeo): el upload está
  // completo solo cuando Upload-Offset alcanzó a Upload-Length
  const head = await fetch(ticket.uploadLink, {
    method: 'HEAD',
    headers: { 'Tus-Resumable': '1.0.0' },
  });
  const uploadedBytes = Number(head.headers.get('upload-offset'));
  if (!head.ok || uploadedBytes !== file.size) {
    throw new Error('Vimeo no confirmó la subida completa del video');
  }

  if (!ticket.url) throw new Error('No se obtuvo la URL de Vimeo');
  return { url: ticket.url };
}

export async function uploadToStorage(
  folder: StorageFolder,
  file: UploadFile,
  onProgress?: ProgressCallback
): Promise<UploadResult> {
  const original = file.__originalFile;
  if (!original) throw new Error('El archivo original no está disponible');

  switch (folder) {
    case 'Server':
      return uploadViaApi('/api/storage/server', original, onProgress);
    case 'AWS S3':
      return uploadToS3(original, onProgress);
    case 'Cloudinary':
      return uploadToCloudinary(original, file.type_file ?? '', onProgress);
    case 'Mailchimp':
      return uploadViaApi('/api/storage/mailchimp', original, onProgress);
    case 'Vimeo':
      return uploadToVimeo(original, file.name_file.replace(/\.[^/.]+$/, ''), onProgress);
  }
}
