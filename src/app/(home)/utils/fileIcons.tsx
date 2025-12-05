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
            return <img src="assets/images/icons/pdf.png" className="w-18 h-22" alt={ext} />;
        case 'zip':
            return <img src="assets/images/icons/zip.png" className="w-18 h-22" alt={ext} />;
        case 'txt':
            return <img src="assets/images/icons/txt.png" className="w-18 h-22" alt={ext} />;
        case 'mp3':
        case 'wav':
            return <img src="assets/images/icons/mpeg.png" className="w-18 h-22" alt={ext} />;
        default:
            return <img src="assets/images/icons/default.png" className="w-18 h-22" alt={ext} />;
    }
};

export const isImageFile = (extension: string): boolean => {
    return /\.(jpg|jpeg|png|gif|webp)$/i.test(extension);
};