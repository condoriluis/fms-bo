'use client'

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { toast } from 'sonner'
import { Mail, Lock, Eye, EyeOff, Loader2, FolderOpen } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'

import { loginSchema, type LoginInput } from '@/lib/validations/auth'
import { loginAction, hasExistingAdmin } from '@/actions/auth'

const STORAGE_KEY = 'fms_remembered_email'

export default function LoginPage() {
  const router = useRouter()
  const { update } = useSession()
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [rememberEmail, setRememberEmail] = useState(false)

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  useEffect(() => {
    const savedEmail = localStorage.getItem(STORAGE_KEY)
    if (savedEmail) {
      setValue('email', savedEmail)
      setRememberEmail(true)
    }
  }, [setValue])

  const onSubmit = async (data: LoginInput) => {
    setIsLoading(true)

    if (rememberEmail) {
      localStorage.setItem(STORAGE_KEY, data.email)
    } else {
      localStorage.removeItem(STORAGE_KEY)
    }

    const result = await loginAction(data)

    if (result.error) {
      toast.error(result.error)
    } else if (result.success) {
      toast.success('Inicio de sesión exitoso')
      await update()
      router.push('/')
    }

    setIsLoading(false)
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-background via-background to-muted/30 p-4">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-primary/5 blur-[100px]" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full bg-primary/5 blur-[100px]" />
      </div>

      <div className="absolute top-8 left-1/2 -translate-x-1/2 flex items-center gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-primary/10 ring-1 ring-primary/20 flex items-center justify-center">
            <FolderOpen className="w-5 h-5 text-primary" />
          </div>
          <span className="text-lg font-bold tracking-tight hidden sm:block">
            File Manager System
          </span>
        </div>
      </div>

      <Card className="relative w-full max-w-sm animate-in fade-in slide-in-from-bottom-4 duration-700">
        <CardHeader className="space-y-1.5 pb-6 pt-8">
          <CardTitle className="text-2xl font-bold tracking-tight text-center">
            Iniciar sesión
          </CardTitle>
          <p className="text-sm text-muted-foreground text-center">
            Ingresa tus credenciales para acceder
          </p>
        </CardHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <CardContent className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                <Input
                  id="email"
                  type="email"
                  placeholder="tu@email.com"
                  className="h-11 pl-10"
                  disabled={isLoading}
                  autoComplete="email"
                  autoFocus
                  {...register('email')}
                />
              </div>
              {errors.email && (
                <p className="text-xs text-destructive flex items-center gap-1.5 pt-1">
                  <span className="inline-block w-1 h-1 rounded-full bg-destructive" />
                  {errors.email.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Contraseña</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  className="h-11 pl-10 pr-10"
                  disabled={isLoading}
                  autoComplete="current-password"
                  {...register('password')}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  tabIndex={-1}
                  aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {errors.password && (
                <p className="text-xs text-destructive flex items-center gap-1.5 pt-1">
                  <span className="inline-block w-1 h-1 rounded-full bg-destructive" />
                  {errors.password.message}
                </p>
              )}
            </div>

            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={rememberEmail}
                onChange={(e) => setRememberEmail(e.target.checked)}
                className="peer sr-only"
                disabled={isLoading}
              />
              <div className="w-4 h-4 rounded border border-input bg-background peer-checked:bg-primary peer-checked:border-primary peer-checked:text-primary-foreground peer-focus-visible:ring-2 peer-focus-visible:ring-ring/50 peer-focus-visible:ring-offset-1 transition-all flex items-center justify-center">
                {rememberEmail && (
                  <svg viewBox="0 0 12 12" className="w-3 h-3 fill-current">
                    <path d="M3.5 6.5L5 8l4-4" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </div>
              <span className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Recordar email
              </span>
            </label>
          </CardContent>

          <CardFooter className="flex-col gap-4 pb-8 pt-0 border-0 bg-transparent">
            <Button type="submit" className="w-full h-11 text-base" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isLoading ? 'Ingresando...' : 'Ingresar'}
            </Button>

            <div className="text-center text-sm">
              <CheckRegisterLink />
            </div>
          </CardFooter>
        </form>
      </Card>

      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-center">
        <p className="text-xs text-muted-foreground">
          &copy; {new Date().getFullYear()} File Manager System. Todos los derechos reservados.
        </p>
      </div>
    </div>
  )
}

function CheckRegisterLink() {
  const [hasAdmin, setHasAdmin] = useState<boolean | null>(null)

  useEffect(() => {
    async function check() {
      const exists = await hasExistingAdmin()
      setHasAdmin(exists)
    }
    check()
  }, [])

  if (hasAdmin === null) {
    return <span className="text-muted-foreground">Cargando...</span>
  }

  if (!hasAdmin) {
    return (
      <span className="text-muted-foreground">
        ¿No tienes cuenta?{' '}
        <Link href="/register" className="text-primary hover:underline font-medium">
          Regístrate
        </Link>
      </span>
    )
  }

  return null
}
