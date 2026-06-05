"use client"

import { useState } from "react"
import Link from "next/link"
import { useSession, signOut } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { LogOut, User, Home } from "lucide-react"
import { toast } from "sonner"

export const Header: React.FC = () => {
  const router = useRouter()
  const { data: session } = useSession()
  const user = session?.user

  const handleLogout = async () => {
    await signOut({ redirect: false })
    toast.success("Sesión cerrada correctamente")
    router.refresh()
  }

  return (
    <header className="w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity cursor-pointer">
            <div className="w-14 h-8 md:w-8 rounded-lg bg-primary/10 flex items-center justify-center">
              <Home className="h-5 w-5 text-primary" />
            </div>
            <div className="text-lg font-bold tracking-tight hidden md:block">File Manager System</div>
          </Link>

          <div className="flex items-center gap-4">
            {user ? (
              <div className="flex items-center gap-4">
                <div className="flex flex-col md:items-end">
                  <span className="text-sm font-medium">{user.name}</span>
                  <span className="text-xs text-muted-foreground">{user.role === 'ADMIN' ? 'Administrador' : 'Usuario'}</span>
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
              <Link href="/login">
                <Button
                  size="sm"
                  variant="default"
                  className="shadow-md hover:shadow-lg transition-all cursor-pointer"
                >
                  <User className="w-4 h-4 mr-2" />
                  Login
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}