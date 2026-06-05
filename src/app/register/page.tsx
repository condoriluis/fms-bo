import { redirect, notFound } from 'next/navigation'
import RegisterForm from './RegisterForm'
import { hasExistingAdmin } from '@/actions/auth'
import { auth } from '@/lib/auth'

export default async function RegisterPage() {
  // Verifica si ya hay un admin
  const hasAdmin = await hasExistingAdmin()
  if (hasAdmin) {
    notFound() // Muestra 404 si ya existe un admin
  }

  // Verifica si el usuario ya está autenticado
  const session = await auth()
  if (session?.user) {
    redirect('/')
  }

  return <RegisterForm />
}