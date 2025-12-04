import { FileText, FileArchive, Music, File } from 'lucide-react';

export const getFileIcon = (extension: string, size: 'sm' | 'md' | 'lg' = 'md') => {
    const ext = extension.toLowerCase().replace('.', '');

    const sizeClasses = {
        sm: 'w-20 h-20',
        md: 'w-24 h-24',
        lg: 'w-32 h-32'
    };

    const iconSize = sizeClasses[size];

    switch (ext) {
        case 'pdf':
            return <FileText className={`${iconSize} text-red-500`} />;
        case 'zip':
            return <FileArchive className={`${iconSize} text-yellow-500`} />;
        case 'txt':
            return <FileText className={`${iconSize} text-gray-500`} />;
        case 'mp3':
        case 'wav':
            return <Music className={`${iconSize} text-purple-500`} />;
        default:
            return <File className={`${iconSize} text-blue-500`} />;
    }
};

export const isImageFile = (extension: string): boolean => {
    return /\.(jpg|jpeg|png|gif|webp)$/i.test(extension);
};