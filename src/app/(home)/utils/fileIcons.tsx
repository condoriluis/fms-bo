export const getFileIcon = (extension: string, size: 'sm' | 'md' | 'lg' = 'md') => {
    const ext = extension.toLowerCase().replace('.', '');

    const sizeClasses = {
        sm: 'w-20 h-20',
        md: 'w-18 h-22',
        lg: 'w-24 h-24'
    };

    const iconSize = sizeClasses[size];

    switch (ext) {
        case 'pdf':
            return <img src="assets/images/icons/pdf.png" className={iconSize} alt={ext} />;
        case 'zip':
            return <img src="assets/images/icons/zip.png" className={iconSize} alt={ext} />;
        case 'txt':
            return <img src="assets/images/icons/txt.png" className={iconSize} alt={ext} />;
        case 'mp3':
        case 'wav':
            return <img src="assets/images/icons/mpeg.png" className={iconSize} alt={ext} />;
        default:
            return <img src="assets/images/icons/default.png" className={iconSize} alt={ext} />;
    }
};

export const isImageFile = (extension: string): boolean => {
    return /\.(jpg|jpeg|png|gif|webp)$/i.test(extension);
};