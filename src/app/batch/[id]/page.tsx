import { PrismaClient } from '@prisma/client'
import Link from 'next/link'
import { notFound } from 'next/navigation'

const prisma = new PrismaClient()

// Next.js 15: params is a Promise
export default async function BatchDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  // 1. Fetch the Batch AND its Ingredients
  const batch = await prisma.batch.findUnique({
    where: { id },
    include: { 
      product: true,
      ingredients: {
        include: { ingredient: true } // Join to get Ingredient names
      }
    }
  })

  if (!batch) return notFound()

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        
        {/* Breadcrumb */}
        <Link href="/" className="text-sm text-gray-500 hover:text-gray-800 mb-4 inline-block">
          ← Back to Dashboard
        </Link>

        {/* Header Section */}
       {/* Header Section */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 mb-6 flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{batch.product.name}</h1>
            <p className="text-gray-500 font-mono mt-1">{batch.batchCode}</p>
          </div>
          
          <div className="flex gap-3">
             {/* The New Download Button */}
            <a 
              href={`/api/batch/${batch.id}/download`}
              target="_blank"
              className="flex items-center gap-2 bg-gray-900 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-800 transition"
            >
              📄 Download Report
            </a>

            <span className={`px-3 py-2 rounded-full text-sm font-bold flex items-center ${
              batch.status === 'RELEASED' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
            }`}>
              {batch.status}
            </span>
          </div>
        </div>

        {/* Ingredients Section (The "Traceability" Log) */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
            <h2 className="font-semibold text-gray-700">Ingredients Used</h2>
           
           <Link href={`/batch/${batch.id}/add`}>
  <button className="text-sm bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700">
    + Add Ingredient
  </button>
</Link>
          </div>
          
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b border-gray-100 text-xs text-gray-500 uppercase">
              <tr>
                <th className="p-4">Ingredient</th>
                <th className="p-4">Supplier Lot #</th>
                <th className="p-4 text-right">Amount Used</th>
              </tr>
            </thead>
            <tbody>
              {batch.ingredients.map((record) => (
                <tr key={record.id} className="border-b border-gray-50">
                  <td className="p-4 font-medium">{record.ingredient.name}</td>
                  <td className="p-4 text-gray-500">{record.ingredient.lotNumber}</td>
                  <td className="p-4 text-right font-mono">
                    {record.amountUsed} {record.ingredient.unit}
                  </td>
                </tr>
              ))}
              {batch.ingredients.length === 0 && (
                <tr>
                  <td colSpan={3} className="p-8 text-center text-gray-400 italic">
                    No ingredients logged yet. This batch is empty.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  )
}