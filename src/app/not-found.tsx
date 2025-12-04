'use client';

import Link from 'next/link';
import { Home, Search, ArrowLeft, FileQuestion } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function NotFound() {
    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-background via-background to-muted/20">
            <div className="container mx-auto px-4 py-16">
                <div className="max-w-2xl mx-auto text-center space-y-8">

                    <div className="relative">
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-64 h-64 bg-primary/5 rounded-full blur-3xl animate-pulse" />
                        </div>
                        <div className="relative flex flex-col items-center gap-4">
                            <div className="w-24 h-24 rounded-2xl bg-primary/10 flex items-center justify-center ring-1 ring-primary/20 backdrop-blur-sm">
                                <FileQuestion className="w-12 h-12 text-primary" />
                            </div>
                            <div className="space-y-2">
                                <h1 className="text-8xl md:text-9xl font-bold bg-gradient-to-br from-foreground to-muted-foreground bg-clip-text text-transparent">
                                    404
                                </h1>
                                <div className="h-1 w-32 mx-auto bg-gradient-to-r from-transparent via-primary to-transparent rounded-full" />
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
                            Página no encontrada
                        </h2>
                        <p className="text-lg text-muted-foreground max-w-md mx-auto leading-relaxed">
                            Lo sentimos, la página que estás buscando no existe o ha sido movida.
                        </p>
                    </div>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                        <Button
                            asChild
                            size="lg"
                            className="w-full sm:w-auto shadow-lg hover:shadow-xl transition-all group"
                        >
                            <Link href="/" className="flex items-center gap-2">
                                <Home className="w-5 h-5 group-hover:scale-110 transition-transform" />
                                Volver al Inicio
                            </Link>
                        </Button>

                        <Button
                            asChild
                            variant="outline"
                            size="lg"
                            className="w-full sm:w-auto group"
                        >
                            <Link href="/" className="flex items-center gap-2">
                                <Search className="w-5 h-5 group-hover:scale-110 transition-transform" />
                                Buscar Archivos
                            </Link>
                        </Button>
                    </div>

                    <div className="pt-8 border-t border-border">
                        <p className="text-sm text-muted-foreground">
                            ¿Necesitas ayuda? Regresa a la{' '}
                            <Link
                                href="/"
                                className="text-primary hover:underline underline-offset-4 font-medium transition-colors"
                            >
                                página principal
                            </Link>
                            {' '}o contacta con soporte.
                        </p>
                    </div>

                    <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
                        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-pulse" />
                        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-pulse delay-1000" />
                    </div>
                </div>
            </div>
        </div>
    );
}
