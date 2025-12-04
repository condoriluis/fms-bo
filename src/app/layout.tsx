import type { Metadata } from 'next';

import '@/styles/globals.css';
import { RootProvider } from '@/providers';
import { fontVariables } from '@/lib/fonts';
import { cn } from '@/lib/utils';

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL!),
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
    url: process.env.NEXT_PUBLIC_SITE_URL!,
    type: 'website',
    title: 'File Manager System',
    description: 'File Manager System',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='es' suppressHydrationWarning>
      <body className={cn(fontVariables, 'antialiased')}>
        <RootProvider>
          {children}
        </RootProvider>
      </body>
    </html>
  );
}
