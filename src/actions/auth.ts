'use server'

import bcrypt from 'bcryptjs'
import { z } from 'zod'
import { loginSchema, registerSchema } from '@/lib/validations/auth'
import { signIn } from '@/lib/auth'
import { db } from '@/lib/db'
import { AuthError } from 'next-auth'

/**
 * Verifica si ya existe un admin en la base de datos
 */
export async function hasExistingAdmin() {
  const admin = await db.user.findFirst({
    where: { role: 'ADMIN' },
  })
  return !!admin
}

/**
 * Inicia sesión de un usuario
 */
export async function loginAction(values: z.infer<typeof loginSchema>) {
  const validatedFields = loginSchema.safeParse(values)
  if (!validatedFields.success) {
    return { error: 'Campos inválidos' }
  }

  try {
    const result = await signIn('credentials', {
      email: validatedFields.data.email,
      password: validatedFields.data.password,
      redirect: false,
    })

    if (result?.error) {
      return { error: 'Credenciales incorrectas' }
    }

    return { success: true }
  } catch (error) {
    if (error instanceof AuthError) {
      return { error: 'Credenciales incorrectas' }
    }
    return { error: 'Ocurrió un error' }
  }
}

/**
 * Registra un nuevo usuario (solo permitido si no hay admin todavía)
 */
export async function registerAction(values: z.infer<typeof registerSchema>) {
  const validatedFields = registerSchema.safeParse(values)
  if (!validatedFields.success) {
    return { error: 'Campos inválidos' }
  }

  // Verifica si ya hay un admin
  const existingAdmin = await hasExistingAdmin()
  if (existingAdmin) {
    return { error: 'Ya existe un administrador registrado' }
  }

  // Verifica si el email ya está en uso
  const existingUser = await db.user.findFirst({
    where: { email: validatedFields.data.email },
  })
  if (existingUser) {
    return { error: 'Este email ya está en uso' }
  }

  try {
    const hashedPassword = await bcrypt.hash(validatedFields.data.password, 10)

    // Crea el primer y único admin
    await db.user.create({
      data: {
        name: validatedFields.data.name,
        email: validatedFields.data.email,
        password: hashedPassword,
        role: 'ADMIN',
        active: true,
      },
    })

    // Inicia sesión automáticamente
    const loginResult = await signIn('credentials', {
      email: validatedFields.data.email,
      password: validatedFields.data.password,
      redirect: false,
    })

    if (loginResult?.error) {
      return { error: 'Registro exitoso, pero no se pudo iniciar sesión' }
    }

    return { success: true }
  } catch (error) {
    return { error: 'Ocurrió un error al crear el usuario' }
  }
}