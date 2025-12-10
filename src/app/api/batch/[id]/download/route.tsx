import { PrismaClient } from '@prisma/client'
import { renderToStream } from '@react-pdf/renderer'
import { BatchPdfDocument } from '@/components/BatchPdf'
import { NextResponse } from 'next/server'

const prisma = new PrismaClient()

export async function GET(
  request: Request, 
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params

  // 1. Fetch the full batch data
  const batch = await prisma.batch.findUnique({
    where: { id },
    include: { 
      product: true,
      ingredients: { include: { ingredient: true } }
    }
  })

  if (!batch) {
    return NextResponse.json({ error: 'Batch not found' }, { status: 404 })
  }

  // 2. Generate the PDF stream
  const stream = await renderToStream(<BatchPdfDocument batch={batch} />)
  
  // 3. Convert stream to a buffer for the response
  // (Standard Node.js stream handling)
  const chunks: Uint8Array[] = []
  for await (const chunk of stream) {
    chunks.push(chunk)
  }
  const pdfBuffer = Buffer.concat(chunks)

  // 4. Return the PDF file
  return new NextResponse(pdfBuffer, {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="Batch-${batch.batchCode}.pdf"`,
    },
  })
}