'use client';

import { Copy, Trash, Search, Plus, Play, LayoutGrid, LayoutList } from 'lucide-react';
import { Button, Input, Badge, Checkbox, RadioGroup, RadioGroupItem, Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose, Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui';
import { useFilesPage } from './hooks/useFilesPage';
import { toast } from 'sonner';

import { useState, useEffect } from 'react';
import { supabaseClient } from '@/lib/supabase/client';
import { LoginModal } from '@/components/auth/LoginModal';
import { FileTable } from './components/FileTable';
import { FileGrid } from './components/FileGrid';
import { getFileIcon, isImageFile } from './utils/fileIcons';

export default function FilesPage() {

  const [user, setUser] = useState<any>(null);
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');

  useEffect(() => {
    supabaseClient.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    const { data: { subscription } } = supabaseClient.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const handleUpdateFileName = async (file: any, newName: string) => {
    if (!user) {
      toast.warning('Debe iniciar sesión para cambiar el nombre del archivo');
      return;
    }

    if (!file.url_file || !newName || newName === file.__originalName) {
      return;
    }

    try {
      const res = await fetch('/api/archivos', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id_file: file.id_file, name_file: newName }),
      });

      if (!res.ok) throw new Error('Error actualizando nombre');

      setFiles(prev =>
        prev.map(f => f.id_file === file.id_file ? { ...f, __originalName: newName } : f)
      );

      toast.success('Nombre actualizado correctamente');
    } catch (err) {
      toast.error('No se pudo actualizar el nombre');
    }
  };

  const getFolderInfo = (folderName: string) => {
    const info = {
      'Server': {
        title: 'Almacenamiento Server',
        description: 'Todos los formatos permitidos',
        formats: 'JPG, PNG, GIF, WebP, PDF, ZIP, TXT, MP3, WAV'
      },
      'AWS S3': {
        title: 'Amazon S3',
        description: 'Almacenamiento universal en la nube',
        formats: 'Todos los formatos sin restricción'
      },
      'Cloudinary': {
        title: 'Cloudinary CDN',
        description: 'Optimizado para multimedia',
        formats: 'Imágenes, Videos, Audio, PDF, ZIP'
      },
      'Mailchimp': {
        title: 'Mailchimp',
        description: 'Solo archivos de marketing (máx 10MB)',
        formats: 'Imágenes, PDF, TXT, ZIP (No videos)'
      }
    };
    return info[folderName as keyof typeof info];
  };

  const getUniqueFileTypes = () => {
    const types = new Set<string>();
    combinedFiles.forEach(file => {
      if (file.type_file) {
        const normalizedType = file.type_file === 'application/x-zip-compressed'
          ? 'application/zip'
          : file.type_file;
        types.add(normalizedType);
      }
    });
    return Array.from(types).sort();
  };

  const {
    search, setSearch,
    visibleCount, setVisibleCount,
    selectedFiles, uploading, folder, setFolder,
    filterBy, setFilterBy,
    sortBy, setSortBy,
    isDragging, setIsDragging,
    folderList, folderFilters, setFolderFilters,
    combinedFiles, displayedFiles,
    handleCopy, handleAddFiles, handleFileChange, handleUpload, handleDelete,
    setSelectedFiles, setFiles,
  } = useFilesPage();

  return (
    <>
      <main className="container mx-auto py-6 space-y-6">
        <div className="rounded-lg shadow-md border-1 dark:bg-neutral-900">
          <div className="p-4 space-y-4">

            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="flex items-center gap-2 w-full md:w-1/2">
                <Input
                  placeholder="Search Files"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="flex-1"
                />
                <Button variant="outline" className="px-3 py-2">
                  <Search className="w-4 h-4" />
                </Button>
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                {user && (
                  <Button
                    className="bg-green-600 hover:bg-green-700 dark:bg-green-50 dark:hover:bg-green-600 dark:hover:text-white"
                    onClick={handleAddFiles}
                  >
                    <Plus className="w-4 h-4" /> Add Files
                  </Button>
                )}
                <Button
                  className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:text-white dark:hover:bg-blue-800 dark:hover:text-white"
                  onClick={() => {
                    if (!user) {
                      setIsLoginOpen(true);
                      toast.info('Debe iniciar sesión para subir archivos');
                    } else {
                      handleUpload();
                    }
                  }}
                  disabled={uploading || selectedFiles.length === 0}
                >
                  <Play className="w-4 h-4" /> {uploading ? 'Subiendo...' : 'Start Up'}
                </Button>
              </div>
            </div>

            <input
              type="file"
              multiple
              accept=".jpg, .jpeg, .png, .gif, .webp, .mp3, .wav, .pdf, .zip, .txt"
              id="file-input"
              onChange={handleFileChange}
              className="hidden"
            />

            <div className="flex flex-wrap items-center justify-between gap-4">

              <div className="flex items-center gap-4 flex-wrap">
                {selectedFiles.length > 0 ? (
                  <TooltipProvider>
                    <RadioGroup
                      value={folder}
                      onValueChange={(value: 'Server' | 'AWS S3' | 'Cloudinary' | 'Mailchimp') =>
                        setFolder(value)
                      }
                      className="flex flex-wrap gap-2 sm:gap-4"
                    >
                      {folderList.map(f => (
                        <Tooltip key={f}>
                          <TooltipTrigger asChild>
                            <label className="flex items-center gap-1 cursor-pointer">
                              <RadioGroupItem value={f} className="w-4 h-4 sm:w-5 sm:h-5" />
                              <span className="text-sm">{f}</span>
                            </label>
                          </TooltipTrigger>
                          <TooltipContent side="bottom" className="max-w-xs">
                            <div className="space-y-1">
                              <p className="font-semibold text-sm">{getFolderInfo(f).title}</p>
                              <p className="text-xs text-muted-foreground">{getFolderInfo(f).description}</p>
                              <p className="text-xs mt-2">
                                <span className="font-medium">Formatos:</span> {getFolderInfo(f).formats}
                              </p>
                            </div>
                          </TooltipContent>
                        </Tooltip>
                      ))}
                    </RadioGroup>
                  </TooltipProvider>
                ) : (
                  <TooltipProvider>
                    {folderList.map(f => (
                      <Tooltip key={f}>
                        <TooltipTrigger asChild>
                          <label className="flex items-center gap-1 cursor-pointer">
                            <Checkbox
                              checked={folderFilters[f]}
                              onCheckedChange={(checked) =>
                                setFolderFilters(prev => ({ ...prev, [f]: checked as boolean }))
                              }
                              className="w-6 h-6"
                            />
                            <span className="text-sm">{f}</span>
                          </label>
                        </TooltipTrigger>
                        <TooltipContent side="bottom" className="max-w-xs">
                          <div className="space-y-1">
                            <p className="font-semibold text-sm">{getFolderInfo(f).title}</p>
                            <p className="text-xs text-muted-foreground">{getFolderInfo(f).description}</p>
                            <p className="text-xs mt-2">
                              <span className="font-medium">Formatos:</span> {getFolderInfo(f).formats}
                            </p>
                          </div>
                        </TooltipContent>
                      </Tooltip>
                    ))}
                  </TooltipProvider>
                )}
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                <div className="relative">
                  <select
                    className="h-9 w-[150px] appearance-none rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                    value={filterBy}
                    onChange={(e) => setFilterBy(e.target.value)}
                  >
                    <option value="all">Filter By</option>
                    <option value="all">All</option>
                    {getUniqueFileTypes().map(type => (
                      <option key={type} value={type}>
                        {type}
                      </option>

                    ))}
                  </select>
                </div>

                <div className="relative">
                  <select
                    className="h-9 w-[150px] appearance-none rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                  >
                    <option value="newest">Sort By</option>
                    <option value="newest">Newest First</option>
                    <option value="oldest">Oldest First</option>
                    <option value="largest">Largest First</option>
                    <option value="smallest">Smallest First</option>
                    <option value="a-z">A-Z</option>
                    <option value="z-a">Z-A</option>
                  </select>
                </div>

                <div className="flex items-center rounded-md border border-input bg-background p-1 h-9">
                  <Button
                    variant={viewMode === 'list' ? 'secondary' : 'ghost'}
                    size="icon"
                    className="h-7 w-7 rounded-sm"
                    onClick={() => setViewMode('list')}
                  >
                    <LayoutList className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={viewMode === 'grid' ? 'secondary' : 'ghost'}
                    size="icon"
                    className="h-7 w-7 rounded-sm"
                    onClick={() => setViewMode('grid')}
                  >
                    <LayoutGrid className="h-4 w-4" />
                  </Button>
                </div>

              </div>
            </div>

            {user && (
              <div
                className={`border-2 border-dashed rounded-lg p-10 text-center ${isDragging ? 'border-blue-500 bg-blue-500 hover:border-blue-400 hover:bg-blue-50 dark:hover:border-blue-400 dark:hover:bg-blue-900' : 'border-gray-300 bg-white dark:bg-neutral-900'
                  }`}
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDragging(true);
                }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={(e) => {
                  e.preventDefault();
                  setIsDragging(false);
                  const files = Array.from(e.dataTransfer.files);
                  const fakeEvent = { target: { files } } as unknown as React.ChangeEvent<HTMLInputElement>;
                  handleFileChange(fakeEvent);
                }}
              >
                <span className={`text-gray-600 dark:text-gray-300 text-lg font-medium`}>
                  {isDragging ? '¡Suelte los archivos para subir!' : 'Arrastre los archivos aquí'}
                </span>
              </div>
            )}

            <div className={`grid grid-cols-1 gap-4 md:hidden ${viewMode === 'grid' ? 'hidden' : ''}`}>
              {displayedFiles.length === 0 ? (
                <div className="text-center py-10 text-muted-foreground italic bg-muted/30 rounded-lg border border-dashed">
                  No hay archivos disponibles en este momento.
                </div>
              ) : (
                displayedFiles.map(file => (
                  <div key={file.id_file || file.id_temp} className="bg-card text-card-foreground p-4 rounded-lg border shadow-sm flex flex-col gap-4">
                    <div className="flex gap-4">
                      <div className="flex-shrink-0">
                        {isImageFile(file.extension_file) ? (
                          <img
                            src={file.preview}
                            alt={file.name_file}
                            className="w-20 h-20 object-cover rounded-md border bg-muted"
                          />
                        ) : (
                          getFileIcon(file.extension_file, 'sm')
                        )}
                      </div>
                      <div className="flex-1 min-w-0 flex flex-col gap-2">
                        <div className="flex gap-2">
                          <Input
                            type="text"
                            value={file.name_file}
                            readOnly={!user || (file.selected && !file.url_file)}
                            onChange={(e) => {
                              if (!user) return;
                              const newName = e.target.value;
                              setFiles((prev) =>
                                prev.map((f) => (f.id_file === file.id_file ? { ...f, name_file: newName } : f))
                              );
                            }}
                            onBlur={(e) => {
                              const newName = e.target.value.trim();
                              handleUpdateFileName(file, newName);
                            }}
                            className={`h-8 text-sm ${!user ? 'cursor-not-allowed opacity-60' : ''}`}
                          />
                        </div>
                        <div className="flex flex-wrap gap-2 items-center text-xs text-muted-foreground">
                          <Badge variant="secondary" className="h-5 px-1.5">{file.extension_file}</Badge>
                          <span>{file.size_file_display}</span>
                          <span>•</span>
                          <span>{new Date(file.date_updated_file).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-xs">{file.name_folder_file}</Badge>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t gap-3">
                      <div className="flex-1 min-w-0 text-sm">
                        {file.selected && file.__originalFile ? (
                          uploading ? (
                            <span className="text-blue-600 font-medium animate-pulse flex items-center gap-1 text-xs">
                              Subiendo...
                            </span>
                          ) : (
                            <span className="text-muted-foreground italic text-xs">Listo para subir</span>
                          )
                        ) : file.url_file ? (
                          <a
                            href={file.url_file}
                            target="_blank"
                            rel="noreferrer"
                            className="text-primary hover:underline truncate block text-xs"
                          >
                            {file.url_file}
                          </a>
                        ) : null}
                      </div>

                      <div className="flex items-center gap-1">
                        {file.selected && file.__originalFile ? (
                          uploading ? (
                            <div className="flex items-center justify-center">
                              <svg className="w-4 h-4 animate-spin text-blue-600" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8h4l-3 3 3 3h-4z"></path>
                              </svg>
                            </div>
                         ) : (
                            <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setSelectedFiles(prev =>
                                prev.filter(f => f.__originalFile !== file.__originalFile)
                              );
                            }}
                            className="h-8 px-2 text-destructive hover:text-destructive"
                          >
                            X Clear
                          </Button>
                          )
                        ) : (
                          <>
                            <Button
                              size="icon"
                              variant="ghost"
                              className="h-8 w-8"
                              onClick={() => handleCopy(file.url_file)}
                            >
                              <Copy className="w-4 h-4" />
                            </Button>

                            {user ? (
                              <Dialog>
                                <DialogTrigger asChild>
                                  <Button size="icon" variant="ghost" className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10">
                                    <Trash className="w-4 h-4" />
                                  </Button>
                                </DialogTrigger>
                                <DialogContent>
                                  <DialogHeader>
                                    <DialogTitle>¿Eliminar archivo?</DialogTitle>
                                    <DialogDescription>
                                      Esta acción eliminará el archivo de {file.name_folder_file} y no se podrá recuperar.
                                    </DialogDescription>
                                  </DialogHeader>
                                  <DialogFooter>
                                    <DialogClose asChild>
                                      <Button variant="outline">Cancelar</Button>
                                    </DialogClose>
                                    <Button
                                      variant="destructive"
                                      onClick={() => handleDelete(file)}
                                    >
                                      Eliminar
                                    </Button>
                                  </DialogFooter>
                                </DialogContent>
                              </Dialog>
                            ) : (
                              <Button
                                size="icon"
                                variant="ghost"
                                className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                                onClick={() => {
                                  toast.warning('Debe iniciar sesión para eliminar archivos');
                                }}
                              >
                                <Trash className="w-4 h-4" />
                              </Button>
                            )}
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div>
              {viewMode === 'list' ? (
                <FileTable
                  displayedFiles={displayedFiles}
                  user={user}
                  setFiles={setFiles}
                  handleUpdateFileName={handleUpdateFileName}
                  uploading={uploading}
                  setSelectedFiles={setSelectedFiles}
                  handleCopy={handleCopy}
                  handleDelete={handleDelete}
                />
              ) : (
                <FileGrid
                  displayedFiles={displayedFiles}
                  user={user}
                  setFiles={setFiles}
                  handleUpdateFileName={handleUpdateFileName}
                  uploading={uploading}
                  setSelectedFiles={setSelectedFiles}
                  handleCopy={handleCopy}
                  handleDelete={handleDelete}
                />
              )}
            </div>

            {visibleCount < combinedFiles.length && (
              <div className="flex justify-center mt-4">
                <Button
                  variant="default"
                  onClick={() => setVisibleCount(visibleCount + 10)}
                  className="hover:bg-gray-400 cursor-pointer"
                >
                  Mostrar más archivos
                </Button>
              </div>
            )}
          </div>
        </div>
      </main>
      <LoginModal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />
    </>
  );
}