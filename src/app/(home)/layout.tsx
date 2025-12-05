import { Header, Footer } from '@/components/layout';
import { ThemeSwitch } from "@/components/ui/theme-switch";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
      <div className="fixed bottom-4 left-4 z-50">
        <ThemeSwitch />
      </div>
    </div>
  );
}