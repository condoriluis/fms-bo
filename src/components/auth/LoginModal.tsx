"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Loader2, Lock, Mail, ShieldCheck, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogTitle,
} from "@/components/ui/dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { supabaseClient } from "@/lib/supabase/client";

const formSchema = z.object({
    email: z.string().email({ message: "Ingrese un correo electrónico válido." }),
    password: z.string().min(6, { message: "La contraseña debe tener al menos 6 caracteres." }),
    remember: z.boolean(),
});

type LoginFormValues = z.infer<typeof formSchema>;

interface LoginModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose }) => {
    const [isLoading, setIsLoading] = React.useState(false);
    const [showPassword, setShowPassword] = React.useState(false);

    const form = useForm<LoginFormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
            password: "",
            remember: false,
        },
    });

    React.useEffect(() => {
        if (isOpen) {
            const rememberedEmail = localStorage.getItem("fms_remember_email");
            if (rememberedEmail) {
                form.setValue("email", rememberedEmail);
                form.setValue("remember", true);
            }
        }
    }, [isOpen, form]);

    const onSubmit = async (values: LoginFormValues) => {
        setIsLoading(true);
        try {
            const { error } = await supabaseClient.auth.signInWithPassword({
                email: values.email,
                password: values.password,
            });

            if (error) throw error;

            if (values.remember) {
                localStorage.setItem("fms_remember_email", values.email);
            } else {
                localStorage.removeItem("fms_remember_email");
            }

            toast.success("Bienvenido al sistema", {
                description: "Has iniciado sesión correctamente.",
            });
            onClose();
        } catch (error: any) {
            toast.error("Error de autenticación", {
                description: error.message || "Credenciales inválidas. Por favor intente nuevamente.",
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleOpenChange = (open: boolean) => {
        if (!open) onClose();
    };

    return (
        <Dialog open={isOpen} onOpenChange={handleOpenChange}>
            <DialogContent
                className="p-0 gap-0 overflow-hidden border border-blue-500/30 dark:border-blue-500/20 shadow-2xl shadow-blue-900/10 rounded-2xl max-w-[380px]"
                onOpenAutoFocus={(e) => e.preventDefault()}
            >
                <VisuallyHidden>
                    <DialogTitle>Iniciar Sesión</DialogTitle>
                </VisuallyHidden>

                <div className="px-8 pt-8 pb-8 space-y-6">
                    {/* Icon + Title */}
                    <div className="flex flex-col items-center gap-3 text-center">
                        <div className="w-14 h-14 rounded-2xl bg-blue-50 dark:bg-blue-950/40 flex items-center justify-center ring-1 ring-blue-100 dark:ring-blue-900">
                            <ShieldCheck className="w-7 h-7 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold tracking-tight text-foreground">
                                Acceso al Sistema
                            </h2>
                            <p className="text-xs text-muted-foreground mt-1">
                                Ingresa tus credenciales
                            </p>
                        </div>
                    </div>

                    {/* Form */}
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">

                        {/* Email */}
                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                                Correo electrónico
                            </label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/60" />
                                <Input
                                    placeholder="admin@empresa.com"
                                    type="email"
                                    autoComplete="email"
                                    tabIndex={-1}
                                    className="pl-9 h-11 bg-slate-50 dark:bg-neutral-900 border-slate-200 dark:border-neutral-800 focus-visible:ring-blue-500 transition-all"
                                    {...form.register("email")}
                                />
                            </div>
                            {form.formState.errors.email && (
                                <p className="text-[11px] text-destructive flex items-center gap-1 ml-1">
                                    {form.formState.errors.email.message}
                                </p>
                            )}
                        </div>

                        {/* Password */}
                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                                Contraseña
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/60" />
                                <Input
                                    placeholder="••••••••••"
                                    type={showPassword ? "text" : "password"}
                                    autoComplete="current-password"
                                    className="pl-9 pr-10 h-11 bg-slate-50 dark:bg-neutral-900 border-slate-200 dark:border-neutral-800 focus-visible:ring-blue-500 transition-all"
                                    {...form.register("password")}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                                >
                                    {showPassword ? (
                                        <EyeOff className="h-4 w-4" />
                                    ) : (
                                        <Eye className="h-4 w-4" />
                                    )}
                                </button>
                            </div>
                            {form.formState.errors.password && (
                                <p className="text-[11px] text-destructive ml-1">
                                    {form.formState.errors.password.message}
                                </p>
                            )}
                        </div>

                        {/* Remember */}
                        <div className="flex items-center gap-2 pt-1">
                            <Checkbox
                                id="remember"
                                className="w-4 h-4 rounded border-slate-300 dark:border-neutral-700 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                                checked={form.watch("remember")}
                                onCheckedChange={(checked) => form.setValue("remember", checked as boolean)}
                            />
                            <label
                                htmlFor="remember"
                                className="text-xs text-muted-foreground cursor-pointer select-none"
                            >
                                Recordar mi correo en este dispositivo
                            </label>
                        </div>

                        {/* Divider */}
                        <div className="h-px bg-slate-100 dark:bg-neutral-800" />

                        {/* Actions */}
                        <div className="flex gap-3">
                            <Button
                                type="button"
                                variant="ghost"
                                className="flex-1 h-11 text-sm font-medium text-muted-foreground hover:text-foreground border border-slate-200 dark:border-neutral-800 hover:bg-slate-50 dark:hover:bg-neutral-900"
                                onClick={onClose}
                                disabled={isLoading}
                            >
                                Cancelar
                            </Button>
                            <Button
                                type="submit"
                                className="flex-1 h-11 text-sm font-semibold bg-blue-600 hover:bg-blue-700 text-white shadow-md hover:shadow-lg transition-all dark:bg-blue-600 dark:hover:bg-blue-700"
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Verificando...
                                    </>
                                ) : (
                                    "Ingresar"
                                )}
                            </Button>
                        </div>
                    </form>

                </div>
            </DialogContent>
        </Dialog>
    );
};
