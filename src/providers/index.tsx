import * as React from 'react';
import { ThemeProvider } from 'next-themes';
import { SessionProvider } from 'next-auth/react';

import { Toaster } from '@/components/ui/sonner';

export const RootProvider: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  return (
    <SessionProvider>
      <ThemeProvider attribute='class' defaultTheme='system' enableSystem>
        {children}
        <Toaster />
      </ThemeProvider>
    </SessionProvider>
  );
};
