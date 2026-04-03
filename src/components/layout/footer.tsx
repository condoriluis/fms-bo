import Link from "next/link";
import { Github, Twitter, Youtube, FolderOpen } from "lucide-react";

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full relative overflow-hidden bg-background border-t border-border/50">
      {/* Decorative gradients */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="container relative mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col items-center text-center max-w-2xl mx-auto mb-10">
          <Link href="/" className="inline-flex items-center gap-3 mb-6 transition-transform hover:scale-105">
            <div className="flex bg-primary/10 p-2.5 rounded-xl ring-1 ring-primary/20">
              <FolderOpen className="w-6 h-6 text-primary" />
            </div>
            <div className="text-left">
              <h3 className="text-xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">
                File Manager System
              </h3>
            </div>
          </Link>

          <p className="text-sm text-muted-foreground leading-relaxed mb-6">
            Plataforma profesional para la gestión, almacenamiento y organización de archivos multimedia. Disfruta de la mejor experiencia con máxima seguridad y un rendimiento excepcional.
          </p>

          <div className="flex items-center justify-center gap-4">
            <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="p-2.5 rounded-xl bg-muted/50 hover:bg-primary/10 hover:text-primary transition-all duration-300 hover:scale-110 ring-1 ring-border/50 hover:ring-primary/30 group">
              <Github className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="p-2.5 rounded-xl bg-muted/50 hover:bg-primary/10 hover:text-primary transition-all duration-300 hover:scale-110 ring-1 ring-border/50 hover:ring-primary/30 group">
              <Twitter className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
            </a>
            <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="p-2.5 rounded-xl bg-muted/50 hover:bg-primary/10 hover:text-primary transition-all duration-300 hover:scale-110 ring-1 ring-border/50 hover:ring-primary/30 group">
              <Youtube className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
            </a>
          </div>
        </div>

        <div className="my-4 border-t border-border/40" />

        <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
          <div className="flex flex-col items-center md:items-start gap-1">
            <div className="flex items-center gap-2 text-sm text-foreground font-medium">
              <span>© {currentYear} File Manager System.</span>
            </div>
            <p className="text-xs text-muted-foreground">Todos los derechos reservados.</p>
          </div>

          <div className="flex items-center gap-3 px-4 py-2 rounded-2xl bg-muted/30 ring-1 ring-border/50">
            <span className="text-xs text-muted-foreground">Tecnologías:</span>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-foreground">Next.js</span>
              <span className="w-1 h-1 rounded-full bg-muted-foreground/30" />
              <span className="text-xs font-semibold text-blue-500">TS</span>
              <span className="w-1 h-1 rounded-full bg-muted-foreground/30" />
              <span className="text-xs font-semibold text-sky-400">Tailwind</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};