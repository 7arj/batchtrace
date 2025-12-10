'use server'

import { PrismaClient } from '@prisma/client'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

const prisma = new PrismaClient()

export async function createBatch(formData: FormData) {
  // 1. Extract data from the form
  const batchCode = formData.get('batchCode') as string
  const productId = formData.get('productId') as string

  // 2. Validation (Basic)
  if (!batchCode || !productId) {
    throw new Error("Missing required fields")
  }

  // 3. Save to Database
  try {
    await prisma.batch.create({
      data: {
        batchCode: batchCode,
        productId: productId,
        status: 'QC_PENDING', // Default status
      },
    })
  } catch (error) {
    // We log the error instead of returning an object
    console.error("Database Error:", error)
    
    // We throw an error so Next.js handles it
    throw new Error("Batch creation failed. The code might already exist.")
  }

  // 4. Update the dashboard automatically
  revalidatePath('/')
  
  // 5. Redirect back home
  redirect('/')
}