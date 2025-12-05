"use client";

import * as React from "react";
import Link from "next/link";
import { Button } from "../ui/button";
import { LoginModal } from "@/components/auth/LoginModal";
import { supabaseClient } from "@/lib/supabase/client";
import { User } from "@supabase/supabase-js";
import { LogOut, User as UserIcon } from "lucide-react";
import { toast } from "sonner";

export const Header: React.FC = () => {
	const [isLoginOpen, setIsLoginOpen] = React.useState(false);
	const [user, setUser] = React.useState<User | null>(null);

	React.useEffect(() => {
		let isMounted = true;

		supabaseClient.auth.getSession().then(({ data: { session } }) => {
			if (isMounted) setUser(session?.user ?? null);
		});

		const { data: { subscription } } = supabaseClient.auth.onAuthStateChange((_event, session) => {
			if (isMounted) setUser(session?.user ?? null);
		});

		return () => {
			isMounted = false;
			subscription.unsubscribe();
		};
	}, []);

	const handleLogout = async () => {
		const { error } = await supabaseClient.auth.signOut();
		if (error) {
			toast.error("Error al cerrar sesión");
		} else {
			setUser(null);
			toast.success("Sesión cerrada correctamente");
		}
	};

	return (
		<header className="w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="h-16 flex items-center justify-between">
					<Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity cursor-pointer">
						<div className="w-14 h-8 md:w-8 rounded-lg bg-primary/10 flex items-center justify-center">
							<span className="font-bold text-primary block md:hidden">FMS</span>
							<span className="font-bold text-primary hidden md:block">FM</span>
						</div>
						<div className="text-lg font-bold tracking-tight hidden md:block">File Manager System</div>
					</Link>

					<div className="flex items-center gap-4">

						{user ? (
							<div className="flex items-center gap-4">
								<div className="flex flex-col md:items-end">
									<span className="text-sm font-medium">{user.email}</span>
									<span className="text-xs text-muted-foreground">Administrador</span>
								</div>
								<Button
									size="sm"
									variant="ghost"
									className="dark:text-destructive text-muted-foreground hover:text-destructive transition-colors cursor-pointer"
									onClick={handleLogout}
								>
									<LogOut className="w-4 h-4 mr-2" />
									Salir
								</Button>
							</div>
						) : (
							<Button
								size="sm"
								variant="default"
								className="shadow-md hover:shadow-lg transition-all cursor-pointer"
								onClick={() => setIsLoginOpen(true)}
							>
								<UserIcon className="w-4 h-4 mr-2" />
								Login
							</Button>
						)}
					</div>
				</div>
			</div>

			<LoginModal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />
		</header>
	);
};
