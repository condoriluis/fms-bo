import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import bcrypt from "bcryptjs"
import { db } from "./db"
import { loginSchema } from "./validations/auth"
import { authConfig } from "./auth.config"

export const { handlers, signIn, signOut, auth } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      async authorize(credentials) {
        const parsed = loginSchema.safeParse(credentials)
        if (!parsed.success) return null

        const { email, password } = parsed.data

        const user = await db.user.findUnique({
          where: { email },
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
            active: true,
            password: true,
          },
        })

        if (!user || !user.active) return null

        const valid = await bcrypt.compare(password, user.password)
        if (!valid) return null

        return {
          id: String(user.id),
          name: user.name,
          email: user.email,
          role: user.role,
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (trigger === "update") {
        if (session?.name) token.name = session.name
        const userId = token.id || token.sub
        if (userId) {
          const updatedUser = await db.user.findUnique({
            where: { id: Number(userId) },
            select: { name: true, role: true }
          })
          if (updatedUser) {
            token.name = updatedUser.name
            token.role = updatedUser.role
          }
        }
      }
      if (user) {
        token.id = user.id
        token.name = user.name
        token.role = (user as { role?: string }).role
      }
      return token
    },
    session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string
        session.user.name = token.name as string
        session.user.role = token.role as string
      }
      return session
    },
  },
})
