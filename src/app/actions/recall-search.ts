'use server'

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function searchRecall(formData: FormData) {
  const lotNumber = formData.get('lotNumber') as string

  if (!lotNumber) return null

  // Find EVERY batch that used this specific ingredient lot
  // This uses a "Nested Filter" in Prisma
  const impactedBatches = await prisma.batch.findMany({
    where: {
      ingredients: {
        some: {
          ingredient: {
            lotNumber: { equals: lotNumber } // Exact match
          }
        }
      }
    },
    include: {
      product: true,
      ingredients: {
        include: { ingredient: true }
      }
    }
  })

  return impactedBatches
}