import { Copy, Trash } from 'lucide-react';
import { Button, Input, Badge, Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from '@/components/ui';
import { toast } from 'sonner';
import { getFileIcon, isImageFile } from '../utils/fileIcons';

interface FileGridProps {
    displayedFiles: any[];
    user: any;
    setFiles: React.Dispatch<React.SetStateAction<any[]>>;
    handleUpdateFileName: (file: any, newName: string) => void;
    uploading: boolean;
    setSelectedFiles: React.Dispatch<React.SetStateAction<any[]>>;
    handleCopy: (link: string) => void;
    handleDelete: (file: any) => void;
}

export function FileGrid({
    displayedFiles,
    user,
    setFiles,
    handleUpdateFileName,
    uploading,
    setSelectedFiles,
    handleCopy,
    handleDelete
}: FileGridProps) {
    return (
        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
            {displayedFiles.length === 0 ? (
                <div className="col-span-full text-center py-10 text-muted-foreground italic bg-muted/30 rounded-lg border border-dashed">
                    No hay archivos disponibles en este momento.
                </div>
            ) : (
                displayedFiles.map(file => (
                    <div key={file.id_file || file.id_temp} className="group relative bg-card text-card-foreground rounded-lg border shadow-sm hover:shadow-md transition-all duration-200 flex flex-col overflow-hidden">
                        <div className="aspect-square w-full relative bg-muted/50 overflow-hidden flex items-center justify-center">
                            {isImageFile(file.extension_file) ? (
                                <img
                                    src={file.preview}
                                    alt={file.name_file}
                                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                                />
                            ) : (
                                getFileIcon(file.extension_file, 'md')
                            )}
                 
                            {file.url_file && (
                            <div className="absolute top-2 left-2">
                                <Badge variant="secondary" className="backdrop-blur-md bg-background/80 shadow-sm">
                                    <a
                                    href={file.url_file}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-primary hover:text-primary/80 transition-colors"
                                    title="Abrir archivo"
                                    >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="w-4 h-4"
                                        viewBox="0 0 24 24"
                                        fill="currentColor"
                                    >
                                        <path d="m21.707 11.293-8-8A1 1 0 0 0 12 4v3.545A11.015 11.015 0 0 0 2 18.5V20a1 1 0 0 0 1.784.62 11.46 11.46 0 0 1 7.887-4.049c.05-.006.175-.016.329-.026V20a1 1 0 0 0 1.707.707l8-8a1 1 0 0 0 0-1.414M14 17.586V15.5a1 1 0 0 0-1-1c-.255 0-1.296.05-1.562.085a14 14 0 0 0-7.386 2.948A9.013 9.013 0 0 1 13 9.5a1 1 0 0 0 1-1V6.414L19.586 12Z" />
                                    </svg>
                                    </a>
                                </Badge>
                            
                            </div>
                            )}

                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 pointer-events-none">
                            {file.url_file && (
                                <Button
                                size="icon"
                                variant="secondary"
                                className="h-8 w-8 rounded-full cursor-pointer pointer-events-auto"
                                onClick={() => handleCopy(file.url_file)}
                                >
                                <Copy className="w-4 h-4" />
                                </Button>
                            )}
                            </div>

                            <div className="absolute top-2 right-2">
                            <Badge variant="secondary" className="backdrop-blur-md bg-background/80 shadow-sm">
                                {file.extension_file}
                            </Badge>
                            </div>
                           
                        </div>

                        <div className="p-3 flex flex-col gap-2 flex-1">
                            <div className="flex gap-1">
                                <Input
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
                                    className="h-7 text-sm px-2 font-medium border-transparent hover:border-input focus:border-input transition-colors bg-transparent"
                                />
                            </div>

                            <div className="flex items-center justify-between text-xs text-muted-foreground px-1">
                                <span>{file.size_file_display}</span>
                                <span>{new Date(file.date_updated_file).toLocaleDateString()}</span>
                            </div>

                            <div className="mt-auto pt-2 flex items-center justify-between border-t px-1">
                                <Badge variant="outline" className="text-[10px] h-5">{file.name_folder_file}</Badge>

                                {file.selected && file.__originalFile ? (
                                    uploading ? (
                                        <div className="flex items-center justify-center">
                                            <svg className="w-4 h-4 animate-spin text-blue-600" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8h4l-3 3 3 3h-4z"></path>
                                            </svg>
                                        </div>
                                    ) : (
                                        <Button variant="ghost" size="sm" className="h-6 text-xs text-destructive hover:text-destructive p-0 cursor-pointer" onClick={() => setSelectedFiles(prev => prev.filter(f => f.__originalFile !== file.__originalFile))}>
                                            X Clear
                                        </Button>
                                    )
                                ) : user ? (
                                    <Dialog>
                                        <DialogTrigger asChild>
                                            <Button variant="secondary" size="icon" className="h-6 w-6 text-muted-foreground hover:text-destructive cursor-pointer">
                                                <Trash className="w-3 h-3 text-destructive" />
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
                                                <Button variant="destructive" onClick={() => handleDelete(file)}>
                                                    Eliminar
                                                </Button>
                                            </DialogFooter>
                                        </DialogContent>
                                    </Dialog>
                                ) : (
                                    <Button
                                        variant="secondary"
                                        size="icon"
                                        className="h-6 w-6 text-muted-foreground hover:text-destructive cursor-pointer"
                                        onClick={() => toast.warning('Debe iniciar sesión para eliminar archivos')}
                                    >
                                        <Trash className="w-3 h-3 text-destructive" />
                                    </Button>
                                )}
                            </div>
                        </div>
                    </div>
                ))
            )}
        </div>
    );
}
