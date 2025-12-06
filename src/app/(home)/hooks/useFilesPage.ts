'use client';

import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { UploadFile } from '@/lib/constants/typeFile';

export function useFilesPage() {
  const [files, setFiles] = useState<UploadFile[]>([]);
  const [search, setSearch] = useState('');
  const [visibleCount, setVisibleCount] = useState(10);

  const [selectedFiles, setSelectedFiles] = useState<UploadFile[]>([]);
  const [uploading, setUploading] = useState(false);
  const [folder, setFolder] = useState<'Server' | 'AWS S3' | 'Cloudinary' | 'Mailchimp'>('Server');
  const [filterBy, setFilterBy] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [, setChoosingFolder] = useState(false);
  const [, setUploadingProgress] = useState<Record<string, number>>({});
  const [isDragging, setIsDragging] = useState(false);

  const folderList = ['Server', 'AWS S3', 'Cloudinary', 'Mailchimp'];
  const [folderFilters, setFolderFilters] = useState<Record<string, boolean>>(
    Object.fromEntries(folderList.map(f => [f, true]))
  );

  useEffect(() => {
    const fetchFiles = async () => {
      try {

        const res = await fetch('/api/archivos');
        if (!res.ok) throw new Error('Error al obtener archivos');

        const data: UploadFile[] = await res.json();

        const adapted = data.map((f: any) => ({
          id_file: f.id_file,
          name_file: f.name_file,
          name_folder_file: f.name_folder_file,
          extension_file: `.${f.extension_file}`,
          type_file: f.type_file,
          size_file: f.size_file,
          size_file_display: formatBytes(f.size_file),
          url_file: f.url_file,
          id_mailchimp: f.id_mailchimp,
          date_updated_file: f.date_updated_file,

          __originalName: f.name_file,
          preview: f.url_file,
        }));

        setFiles(adapted);

      } catch (err) {
        toast.error('No se pudieron cargar los archivos');
      }
    };

    fetchFiles();
  }, []);

  const formatBytes = (bytes: number) => {
    if (!bytes) return '0 MB';
    const mb = bytes / (1024 * 1024);
    return mb.toFixed(2) + ' MB';
  };

  const combinedFiles: UploadFile[] = [
    ...selectedFiles.map((file, i) => ({
      id_file: 0,
      id_temp: file.id_temp ?? crypto.randomUUID(),
      name_file: file.name_file.replace(/\.[^/.]+$/, ''),
      name_folder_file: folder,
      extension_file: '.' + file.name_file.split('.').pop(),
      size_file: file.size_file,
      size_file_display: (file.size_file / 1024 / 1024).toFixed(2) + ' MB',
      type_file: file.type_file,
      url_file: file.__originalFile ? URL.createObjectURL(file.__originalFile) : '',
      date_updated_file: new Date(),
      selected: true,
      __originalName: file.name_file.replace(/\.[^/.]+$/, ''),
      __originalFile: file.__originalFile,
      preview: file.__originalFile ? URL.createObjectURL(file.__originalFile) : '',
    })),
    ...files.map(f => ({
      ...f,
      id_temp: f.id_temp ?? crypto.randomUUID(),
    })),
  ];

  const displayedFiles = combinedFiles
    .filter(file => {
      const matchesSearch = file.name_file.toLowerCase().includes(search.toLowerCase());

      const safeFilter = filterBy ?? 'all';
      const normalizedFileType = file.type_file === 'application/x-zip-compressed' ? 'application/zip' : file.type_file;
      const matchesFilter = safeFilter === 'all' ? true : normalizedFileType === safeFilter;
      const matchesFolder = selectedFiles.length === 0 ? folderFilters[file.name_folder_file] : true;

      return matchesSearch && matchesFilter && matchesFolder;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.date_updated_file).getTime() - new Date(a.date_updated_file).getTime();
        case 'oldest':
          return new Date(a.date_updated_file).getTime() - new Date(b.date_updated_file).getTime();
        case 'largest':
          return b.size_file - a.size_file;
        case 'smallest':
          return a.size_file - b.size_file;
        case 'a-z':
          return a.name_file.localeCompare(b.name_file);
        case 'z-a':
          return b.name_file.localeCompare(a.name_file);
        default:
          return 0;
      }
    })
    .slice(0, visibleCount);

  const handleCopy = (link: string) => {
    navigator.clipboard.writeText(link);
    toast.success('Link copiado al portapapeles');
  };

  const handleAddFiles = () => {
    document.getElementById('file-input')?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;

    const filesArray = Array.from(e.target.files);
    const allowedTypes = [
      'image/png', 'image/jpeg', 'image/jpg', 'image/webp', 'image/gif',
      'audio/mpeg', 'audio/wav',
      'application/pdf',
      'application/zip', 'application/x-zip-compressed',
      'text/plain'
    ];

    const validFiles = filesArray.filter(file => allowedTypes.includes(file.type));
    const invalidFiles = filesArray.filter(file => !allowedTypes.includes(file.type));

    if (validFiles.length > 0) {
      setSelectedFiles(prev => {
        const combined = [
          ...prev,
          ...validFiles.map(file => ({
            id_file: 0,
            id_temp: crypto.randomUUID(),
            name_file: file.name,
            name_folder_file: folder,
            extension_file: '.' + file.name.split('.').pop(),
            type_file: file.type,
            size_file: file.size,
            url_file: '',
            date_updated_file: new Date(),
            preview: URL.createObjectURL(file),
            __originalName: file.name,
            __originalFile: file,
          }))
        ];

        const uniqueFiles = combined.filter(
          (file, index, self) =>
            index === self.findIndex(f =>
              f.name_file === file.name_file &&
              f.size_file === file.size_file
            )
        );

        return uniqueFiles;
      });

      setChoosingFolder(true);

      const newProgress: Record<string, number> = {};
      validFiles.forEach(file => {
        newProgress[file.name] = 0;
      });
      setUploadingProgress(prev => ({ ...prev, ...newProgress }));
    }

    if (invalidFiles.length > 0) {
      toast.error(`Formato no permitido: ${invalidFiles.map(f => f.name).join(', ')}`);
    }

    e.target.value = '';
  };

  const handleUpload = async () => {
    if (!selectedFiles.length) return toast.error('Selecciona archivos primero');
    setUploading(true);

    const urls: string[] = [];

    try {

      const uploadedFiles: UploadFile[] = [];

      for (const file of selectedFiles) {
        setUploadingProgress(prev => ({ ...prev, [file.name_file]: 0 }));

        const formData = new FormData();
        if (!file.__originalFile) continue;
        formData.append('file', file.__originalFile as Blob);

        const uploadFile = (endpoint: string): Promise<{ url: string; mailchimpId?: string }> => {
          return new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            xhr.open('POST', endpoint);

            xhr.upload.onprogress = (event) => {
              if (event.lengthComputable) {
                const percent = Math.round((event.loaded / event.total) * 100);
                setUploadingProgress(prev => ({ ...prev, [file.name_file]: percent }));
              }
            };

            xhr.onload = () => {
              if (xhr.status >= 200 && xhr.status < 300) {
                const response = JSON.parse(xhr.responseText);

                if (folder === 'Mailchimp') {
                  const url = response.data?.full_size_url;
                  const mailchimpId = response.data?.id;
                  if (!url || !mailchimpId) reject('No se obtuvo URL o ID de Mailchimp');
                  resolve({ url, mailchimpId });
                } else {
                  resolve({ url: response.url });
                }

              } else {

                try {
                  const errorResponse = JSON.parse(xhr.responseText);
                  reject(errorResponse.error || 'Error al subir el archivo');
                } catch {
                  reject(`Error ${xhr.status}: ${xhr.statusText}`);
                }
              }
            };

            xhr.onerror = () => reject('Error de red');
            xhr.send(formData);
          });
        };

        const folderApiMap: Record<string, string> = {
          Server: 'server',
          'AWS S3': 's3',
          Cloudinary: 'cloudinary',
          Mailchimp: 'mailchimp',
        };

        const apiEndpoint = `/api/storage/${folderApiMap[folder]}`;

        const result = await uploadFile(
          folder === 'Mailchimp' ? '/api/storage/mailchimp' : apiEndpoint
        );

        const createResponse = await fetch('/api/archivos', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name_file: file.name_file.replace(/\.[^/.]+$/, ''),
            name_folder_file: folder,
            extension_file: file.name_file.split('.').pop(),
            type_file: file.type_file,
            size_file: file.size_file,
            url_file: result.url,
            id_mailchimp: result.mailchimpId ? Number(result.mailchimpId) : null,
            date_updated_file: new Date(),
          }),
        });

        const createdFile = await createResponse.json();

        const adaptedFile: UploadFile = {
          id_file: createdFile.id_file,
          name_file: createdFile.name_file,
          name_folder_file: createdFile.name_folder_file,
          extension_file: `.${createdFile.extension_file}`,
          type_file: createdFile.type_file,
          size_file: createdFile.size_file,
          size_file_display: formatBytes(createdFile.size_file),
          url_file: createdFile.url_file,
          id_mailchimp: createdFile.id_mailchimp,
          date_updated_file: createdFile.date_updated_file,
          __originalName: createdFile.name_file,
          preview: createdFile.url_file,
        };
        uploadedFiles.push(adaptedFile);
        setUploadingProgress(prev => ({ ...prev, [file.name_file]: 100 }));

      }

      toast.success('Archivos subidos correctamente');

      setFiles(prev => [...uploadedFiles, ...prev])
      setSelectedFiles([]);
      setChoosingFolder(false);
      setUploadingProgress({});
    } catch (err) {
      const errorMessage = typeof err === 'string' ? err : 'Error al subir los archivos';
      toast.error(errorMessage);
    }

    setUploading(false);
  };

  const handleDelete = async (file: UploadFile) => {
    try {
      let endpoint = '';
      switch (file.name_folder_file) {
        case 'Server': endpoint = '/api/storage/server'; break;
        case 'AWS S3': endpoint = '/api/storage/s3'; break;
        case 'Cloudinary': endpoint = '/api/storage/cloudinary'; break;
        case 'Mailchimp': endpoint = '/api/storage/mailchimp'; break;
      }

      await fetch(endpoint, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fileUrl: file.url_file, idMailchimp: file.id_mailchimp }),
      });

      await fetch(`/api/archivos`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id_file: file.id_file }),
      });

      setFiles(prev => prev.filter(f => f.id_file !== file.id_file));
      toast.success('Archivo eliminado correctamente');

    } catch (err) {
      console.error(err);
      toast.error('Error eliminando archivo');
    }
  };

  return {
    // state
    files, search, visibleCount, selectedFiles, uploading, folder,
    filterBy, sortBy, isDragging, folderList, folderFilters,
    combinedFiles, displayedFiles,

    // setters
    setFiles, setSearch, setVisibleCount, setSelectedFiles, setFolder,
    setFilterBy, setSortBy, setIsDragging, setFolderFilters,

    // handlers
    handleCopy, handleAddFiles, handleFileChange, handleUpload, handleDelete,
  };
}
