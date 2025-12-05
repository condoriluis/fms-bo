"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Loader2, Lock, Mail, LogIn, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
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

            if (error) {
                throw error;
            }

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
        if (!open) {
            onClose();
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={handleOpenChange}>
            <DialogContent className="sm:max-w-[400px] overflow-hidden border border-border shadow-2xl rounded-xl bg-background">
                <DialogHeader className="mb-6 space-y-0 text-center">
                    <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-2 ring-1 ring-primary/20">
                        <LogIn className="w-6 h-6 text-primary" />
                    </div>
                    <DialogTitle className="text-2xl font-bold tracking-tight text-foreground text-center">Iniciar Sesión</DialogTitle>
                    <DialogDescription className="text-muted-foreground">
                        Ingrese sus credenciales para acceder al sistema.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <div className="space-y-2">
                        <div className="relative">
                            <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="usuario@correo.com"
                                type="email"
                                className="pl-9 bg-background border-input focus:border-primary transition-colors"
                                {...form.register("email")}
                            />
                        </div>
                        {form.formState.errors.email && (
                            <p className="text-xs text-destructive ml-1">{form.formState.errors.email.message}</p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <div className="relative">
                            <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="••••••••"
                                type={showPassword ? "text" : "password"}
                                className="pl-9 pr-10 bg-background border-input focus:border-primary transition-colors"
                                {...form.register("password")}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-3 text-muted-foreground hover:text-foreground transition-colors"
                            >
                                {showPassword ? (
                                    <EyeOff className="h-4 w-4" />
                                ) : (
                                    <Eye className="h-4 w-4" />
                                )}
                            </button>
                        </div>
                        {form.formState.errors.password && (
                            <p className="text-xs text-destructive ml-1">{form.formState.errors.password.message}</p>
                        )}
                    </div>

                    <div className="flex items-center space-x-2 py-2">
                        <Checkbox
                            className="w-5 h-5"
                            id="remember"
                            checked={form.watch("remember")}
                            onCheckedChange={(checked) => form.setValue("remember", checked as boolean)}
                        />
                        <label
                            htmlFor="remember"
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-muted-foreground cursor-pointer"
                        >
                            Recordar mi correo
                        </label>
                    </div>

                    <div className="flex flex-row gap-3 pt-2">
                        <Button
                            type="button"
                            variant="outline"
                            className="w-1/2"
                            onClick={onClose}
                            disabled={isLoading}
                        >
                            Cancelar
                        </Button>
                        <Button
                            type="submit"
                            className="w-1/2 font-semibold shadow-md hover:shadow-lg transition-all"
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Autenticando...
                                </>
                            ) : (
                                "Ingresar"
                            )}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
};
