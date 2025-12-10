import { PrismaClient } from '@prisma/client'
import { createBatch } from '@/app/actions/create-batch'

const prisma = new PrismaClient()

export default async function NewBatchPage() {
  // Fetch products so the user can select one from a dropdown
  const products = await prisma.product.findMany()

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md border border-gray-200">
        <h1 className="text-2xl font-bold mb-6 text-gray-800">Start Production Run</h1>
        
        {/* The Form */}
        <form action={createBatch} className="space-y-4">
          
          {/* Batch Code Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Batch Code</label>
            <input 
              name="batchCode"
              type="text" 
              placeholder="e.g. BATCH-2025-002"
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none text-black"
              required
            />
            <p className="text-xs text-gray-500 mt-1">Must be unique per run.</p>
          </div>

          {/* Product Dropdown */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Select Product</label>
            <select 
              name="productId" 
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none text-black bg-white"
              required
            >
              <option value="" disabled selected>-- Choose a product --</option>
              {products.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} ({p.sku})
                </option>
              ))}
            </select>
          </div>

          {/* Submit Button */}
          <button 
            type="submit" 
            className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 transition"
          >
            Create Batch Record
          </button>
        </form>

        <a href="/" className="block text-center text-sm text-gray-500 mt-4 hover:underline">
          Cancel & Go Back
        </a>
      </div>
    </div>
  )
}