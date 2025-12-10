'use client'

import { useState } from 'react'
import { searchRecall } from '@/app/actions/recall-search'

// Define a type for the data we get back
// (In a real app, you'd export this from Prisma)
type BatchResult = {
  id: string
  batchCode: string
  status: string
  product: { name: string }
  ingredients: any[]
}

export default function RecallPage() {
  const [results, setResults] = useState<BatchResult[] | null>(null)
  const [searched, setSearched] = useState(false)

  async function handleSearch(formData: FormData) {
    const data = await searchRecall(formData)
    setResults(data as BatchResult[])
    setSearched(true)
  }

  return (
    <div className="min-h-screen bg-red-50 p-8">
      <div className="max-w-4xl mx-auto">
        
        <h1 className="text-3xl font-bold text-red-800 mb-2">🚨 Emergency Recall Search</h1>
        <p className="text-red-600 mb-8">
          Enter a Supplier Lot Number to find all impacted production runs immediately.
        </p>

        {/* Search Bar */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-red-100 mb-8">
          <form action={handleSearch} className="flex gap-4">
            <input 
              name="lotNumber"
              type="text" 
              placeholder="Enter Supplier Lot # (e.g. LAV-99)"
              className="flex-1 p-3 border border-gray-300 rounded-lg text-lg text-black outline-none focus:ring-2 focus:ring-red-500"
              required
            />
            <button 
              type="submit"
              className="bg-red-600 text-white font-bold px-6 py-3 rounded-lg hover:bg-red-700 transition"
            >
              Trace Contamination
            </button>
          </form>
        </div>

        {/* Results Area */}
        {searched && results && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-gray-800">
              Found {results.length} Impacted Batches
            </h2>

            {results.map(batch => (
              <div key={batch.id} className="bg-white p-6 rounded-lg shadow border-l-4 border-red-500 flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-bold text-gray-900">{batch.product.name}</h3>
                  <p className="text-gray-500 font-mono">Batch Code: {batch.batchCode}</p>
                  <p className="text-sm text-gray-400 mt-1">Status: {batch.status}</p>
                </div>
                <a 
                  href={`/batch/${batch.id}`}
                  className="text-red-600 font-medium hover:underline"
                >
                  View Record →
                </a>
              </div>
            ))}

            {results.length === 0 && (
              <div className="p-8 text-center bg-green-100 text-green-800 rounded-lg border border-green-200">
                ✅ No batches found using this Lot Number. You are safe.
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  )
}