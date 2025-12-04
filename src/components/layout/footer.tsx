import Link from "next/link";
import { FileText, Github, Twitter, Youtube, Heart } from "lucide-react";

export const Footer: React.FC = () => {
  return (
    <footer className="w-full border-t border-border bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">

          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-4">

              <div>
                <h3 className="text-xl font-bold tracking-tight">File Manager System</h3>
                <p className="text-xs text-muted-foreground">Gestión inteligente de archivos</p>
              </div>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-md">
              Plataforma profesional para la gestión, almacenamiento y organización de archivos multimedia.
              Soporta múltiples proveedores de almacenamiento en la nube.
            </p>
          </div>

          <div>
            <h4 className="text-sm font-semibold mb-4 text-foreground">Enlaces Rápidos</h4>
            <ul className="space-y-3 text-sm">
              <li>
                <Link
                  href="/"
                  className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-2 group"
                >
                  <FileText className="w-4 h-4 group-hover:scale-110 transition-transform" />
                  Inicio
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold mb-4 text-foreground">Conectar</h4>
            <div className="flex gap-3">
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-lg bg-muted hover:bg-primary/10 flex items-center justify-center transition-all hover:scale-110 group"
                aria-label="GitHub"
              >
                <Github className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-lg bg-muted hover:bg-primary/10 flex items-center justify-center transition-all hover:scale-110 group"
                aria-label="Twitter"
              >
                <Twitter className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-lg bg-muted hover:bg-primary/10 flex items-center justify-center transition-all hover:scale-110 group"
                aria-label="YouTube"
              >
                <Youtube className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
              </a>
            </div>
          </div>
        </div>

        <div className="my-8 border-t border-border" />

        <div className="flex flex-col items-center justify-between gap-4 text-sm md:flex-row">
          <div className="flex items-center gap-2 text-muted-foreground">
            <span>© {new Date().getFullYear()} File Manager System.</span>
            <span className="hidden sm:inline">Todos los derechos reservados.</span>
          </div>

          <div className="flex items-center gap-2 text-muted-foreground">
            <span className="flex items-center gap-1">
              Hecho con <Heart className="w-4 h-4 text-red-500 fill-red-500 animate-pulse" /> por
            </span>
            <span className="font-medium text-foreground">Powered</span>
          </div>
        </div>

        <div className="mt-2 text-center">
          <p className="text-xs text-muted-foreground">
            Desarrollado con{" "}
            <span className="font-medium text-foreground">Next.js</span>
            {" • "}
            <span className="font-medium text-foreground">TypeScript</span>
            {" • "}
            <span className="font-medium text-foreground">Tailwind CSS</span>
            {" • "}
            <a
              href="https://ui.shadcn.com"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-primary hover:underline underline-offset-4 transition-colors"
            >
              Shadcn UI
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
};