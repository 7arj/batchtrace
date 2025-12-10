import { PrismaClient } from '@prisma/client'
import { addIngredientToBatch } from '@/app/actions/add-ingredient'

const prisma = new PrismaClient()

// We need to know WHICH batch we are adding to, so we grab params
export default async function AddIngredientPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  
  // Fetch ingredients so user can pick from a list
  const ingredients = await prisma.ingredient.findMany({
    where: { quantity: { gt: 0 } } // Only show ingredients currently in stock
  })

  // We need a version of the action that already knows the batch ID
  const addWithId = addIngredientToBatch.bind(null, id)

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md border border-gray-200">
        <h1 className="text-xl font-bold mb-6 text-gray-800">Add Ingredient to Batch</h1>
        
        <form action={addWithId} className="space-y-4">
          
          {/* Ingredient Selector */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Select Raw Material</label>
            <select 
              name="ingredientId" 
              className="w-full p-2 border border-gray-300 rounded-md bg-white text-black"
              required
            >
              {ingredients.map((ing) => (
                <option key={ing.id} value={ing.id}>
                  {ing.name} (Lot: {ing.lotNumber}) - {ing.quantity} {ing.unit} available
                </option>
              ))}
            </select>
          </div>

          {/* Amount Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Amount Used</label>
            <div className="flex gap-2">
              <input 
                name="amount"
                type="number" 
                step="0.01"
                placeholder="0.00"
                className="w-full p-2 border border-gray-300 rounded-md text-black"
                required
              />
            </div>
          </div>

          <button 
            type="submit" 
            className="w-full bg-green-600 text-white font-bold py-3 rounded-lg hover:bg-green-700 transition"
          >
            Confirm & Deduct Stock
          </button>
        </form>

        <a href={`/batch/${id}`} className="block text-center text-sm text-gray-500 mt-4 hover:underline">
          Cancel
        </a>
      </div>
    </div>
  )
}