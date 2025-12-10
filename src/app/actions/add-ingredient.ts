'use server'

import { PrismaClient } from '@prisma/client'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

const prisma = new PrismaClient()

export async function addIngredientToBatch(batchId: string, formData: FormData) {
  const ingredientId = formData.get('ingredientId') as string
  const amount = parseFloat(formData.get('amount') as string)

  if (!ingredientId || !amount) {
    throw new Error("Missing data")
  }

  try {
    // TRANSACTION: Do both steps or fail both (Safety First)
    await prisma.$transaction(async (tx) => {
      
      // 1. Check if we have enough stock (Optional but smart)
      const ingredient = await tx.ingredient.findUnique({ where: { id: ingredientId } })
      if (!ingredient || ingredient.quantity < amount) {
        throw new Error(`Not enough stock! You only have ${ingredient?.quantity} left.`)
      }

      // 2. Subtract from Inventory
      await tx.ingredient.update({
        where: { id: ingredientId },
        data: { quantity: { decrement: amount } }
      })

      // 3. Add to Batch Log
      await tx.batchIngredient.create({
        data: {
          batchId: batchId,
          ingredientId: ingredientId,
          amountUsed: amount
        }
      })
    })

  } catch (error) {
    console.error(error)
    throw new Error("Failed to add ingredient")
  }

  // Refresh the batch page to show the new list
  revalidatePath(`/batch/${batchId}`)
  redirect(`/batch/${batchId}`)
}