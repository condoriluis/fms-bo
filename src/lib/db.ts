import { PrismaClient } from "@prisma/client"

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient }

export const db =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  })

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = db

/**
 * Retries a database operation with exponential backoff.
 * Handles transient connection failures common in serverless + managed DB setups.
 */
export async function withRetry<T>(
  fn: () => Promise<T>,
  retries = 3,
  delayMs = 2000
): Promise<T> {
  let lastError: unknown
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      return await fn()
    } catch (err) {
      lastError = err
      if (attempt < retries) {
        console.warn(`[db] attempt ${attempt}/${retries} failed — retrying in ${delayMs}ms`)
        await new Promise((res) => setTimeout(res, delayMs))
        delayMs = Math.floor(delayMs * 1.5)
      }
    }
  }
  throw lastError
}

