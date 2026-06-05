import type { Metadata } from 'next';

import '@/styles/globals.css';
import { RootProvider } from '@/providers';
import { fontVariables } from '@/lib/fonts';
import { cn } from '@/lib/utils';

export async function generateMetadata(): Promise<Metadata> {
  try {
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
    
    return {
      metadataBase: new URL(siteUrl),
      alternates: {
        canonical: '/',
      },
      title: {
        template: '%s | File Manager System',
        default: 'File Manager System',
      },
      description: 'File Manager System',
      creator: 'developer',
      authors: [{ name: 'developer' }],
      openGraph: {
        url: siteUrl,
        type: 'website',
        title: 'File Manager System',
        description: 'File Manager System',
      },
    };
  } catch {
    return {
      metadataBase: new URL('http://localhost:3000'),
      title: {
        template: '%s | File Manager System',
        default: 'File Manager System',
      },
      description: 'File Manager System',
    };
  }
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='es' suppressHydrationWarning>
      <body className={cn(fontVariables, 'antialiased')} suppressHydrationWarning>
        <RootProvider>
          {children}
        </RootProvider>
      </body>
    </html>
  );
}
