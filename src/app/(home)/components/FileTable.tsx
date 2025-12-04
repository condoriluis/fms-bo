import { Copy, Trash } from 'lucide-react';
import { Button, Input, Badge, Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from '@/components/ui';
import { toast } from 'sonner';
import { getFileIcon, isImageFile } from '../utils/fileIcons';

interface FileTableProps {
    displayedFiles: any[];
    user: any;
    setFiles: React.Dispatch<React.SetStateAction<any[]>>;
    handleUpdateFileName: (file: any, newName: string) => void;
    uploading: boolean;
    setSelectedFiles: React.Dispatch<React.SetStateAction<any[]>>;
    handleCopy: (link: string) => void;
    handleDelete: (file: any) => void;
}

export function FileTable({
    displayedFiles,
    user,
    setFiles,
    handleUpdateFileName,
    uploading,
    setSelectedFiles,
    handleCopy,
    handleDelete
}: FileTableProps) {
    return (
        <div className="hidden md:block overflow-x-auto rounded-lg border-1 bg-white dark:bg-neutral-900">
            <table className="min-w-full table-auto border-collapse">
                <thead className="border-b">
                    <tr>
                        <th className="px-4 py-2 text-left">Preview</th>
                        <th className="px-4 py-2 text-left">Name</th>
                        <th className="px-4 py-2 text-left">Size</th>
                        <th className="px-4 py-2 text-left">Folder</th>
                        <th className="px-4 py-2 text-left">Link</th>
                        <th className="px-4 py-2 text-left">Modified</th>
                        <th className="px-4 py-2 text-left">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {displayedFiles.length === 0 ? (
                        <tr>
                            <td colSpan={7} className="text-center py-6 text-gray-500 italic">
                                No hay archivos disponibles en este momento.
                            </td>
                        </tr>
                    ) : (
                        displayedFiles.map(file => (
                            <tr key={file.id_file || file.id_temp}>
                                <td className="px-4 py-2">
                                    <div className="flex items-center gap-3">
                                        <div className="group flex-shrink-0 flex items-center justify-center w-24 h-24 rounded-lg border border-gray-200 dark:border-neutral-700 shadow-sm bg-muted overflow-hidden">
                                            {isImageFile(file.extension_file) ? (
                                                <img
                                                    src={file.preview}
                                                    alt={file.name_file}
                                                    className="w-full h-full object-cover rounded-lg transition-transform duration-300 group-hover:scale-110"
                                                />
                                            ) : (
                                                <div className="transition-transform duration-300 group-hover:scale-110">
                                                    {getFileIcon(file.extension_file, 'md')}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </td>
                                <td className="px-4 py-2">
                                    <div className="flex flex-1 gap-1 min-w-0">
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
                                            className={`flex-1 min-w-0 text-sm md:text-base truncate ${!user ? 'cursor-not-allowed opacity-60' : ''
                                                }`}
                                        />
                                        <Button
                                            type="button"
                                            variant="outline"
                                            className="flex-shrink-0 px-2 py-1 text-gray-400 text-sm md:text-base"
                                        >
                                            {file.extension_file}
                                        </Button>
                                    </div>
                                </td>

                                <td className="px-4 py-2">{file.size_file_display}</td>
                                <td className="px-4 py-2"><Badge>{file.name_folder_file}</Badge></td>

                                <td className="px-4 py-2">
                                    {file.selected && file.__originalFile ? (
                                        uploading ? (
                                            <span className="text-blue-600 font-semibold animate-pulse flex items-center gap-1">
                                                <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24">
                                                    <circle
                                                        className="opacity-25"
                                                        cx="12"
                                                        cy="12"
                                                        r="10"
                                                        stroke="currentColor"
                                                        strokeWidth="4"
                                                    ></circle>
                                                    <path
                                                        className="opacity-75"
                                                        fill="currentColor"
                                                        d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8h4l-3 3 3 3h-4z"
                                                    ></path>
                                                </svg>
                                                Subiendo archivo...
                                            </span>
                                        ) : (
                                            <span className="text-gray-500 italic font-medium">Listo para subir</span>
                                        )
                                    ) : file.url_file ? (
                                        <a
                                            href={file.url_file}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="text-blue-600 hover:underline truncate max-w-[200px] block"
                                            title={file.url_file}
                                        >
                                            {file.url_file.length > 30 ? file.url_file.slice(0, 30) + "..." : file.url_file}
                                        </a>
                                    ) : null}
                                </td>

                                <td className="px-4 py-2">
                                    {new Date(file.date_updated_file).toLocaleString('sv-SE', {
                                        year: 'numeric',
                                        month: '2-digit',
                                        day: '2-digit',
                                        hour: '2-digit',
                                        minute: '2-digit',
                                        second: '2-digit',
                                        hour12: false,
                                    }).replace('T', ' ')}
                                </td>

                                <td className="px-2 py-4 flex">

                                    {file.selected && file.__originalFile ? (
                                        uploading ? (
                                            <div className="flex items-center justify-center mt-4">
                                                <svg className="w-6 h-6 animate-spin text-blue-600" viewBox="0 0 24 24">
                                                    <circle
                                                        className="opacity-25"
                                                        cx="12"
                                                        cy="12"
                                                        r="10"
                                                        stroke="currentColor"
                                                        strokeWidth="4"
                                                    ></circle>
                                                    <path
                                                        className="opacity-75"
                                                        fill="currentColor"
                                                        d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8h4l-3 3 3 3h-4z"
                                                    ></path>
                                                </svg>
                                            </div>
                                        ) : (
                                            <Button
                                                variant="default"
                                                onClick={() => {
                                                    setSelectedFiles(prev =>
                                                        prev.filter(f => f.__originalFile !== file.__originalFile)
                                                    );
                                                }}
                                                className='mt-4'
                                            >
                                                <span>X Clear</span>
                                            </Button>
                                        )
                                    ) : (
                                        <>
                                            <Button
                                                size="icon"
                                                variant="secondary"
                                                onClick={() => handleCopy(file.url_file)}
                                                className="mr-2 mt-4 h-8 w-8 rounded-full cursor-pointer"
                                            >
                                                <Copy className="w-4 h-4" />
                                            </Button>

                                            {user ? (
                                                <Dialog>
                                                    <DialogTrigger asChild>
                                                        <Button
                                                            size="icon"
                                                            variant="secondary"
                                                            className="mt-4 h-8 w-8 rounded-full cursor-pointer"
                                                        >
                                                            <Trash className="w-4 h-4 text-destructive" />
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
                                                    variant="secondary"
                                                    onClick={() => {
                                                        toast.warning('Debe iniciar sesión para eliminar archivos');
                                                    }}
                                                    className="mt-4 h-8 w-8 rounded-full cursor-pointer"
                                                >
                                                    <Trash className="w-4 h-4 text-destructive" />
                                                </Button>
                                            )}
                                        </>
                                    )}
                                </td>

                            </tr>
                        ))
                    )}
                </tbody>

            </table>
        </div>
    );
}
