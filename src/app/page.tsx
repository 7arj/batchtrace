import { PrismaClient } from '@prisma/client'
import Link from 'next/link'

// Initialize the database client
const prisma = new PrismaClient()

// This is a Server Component (fetches data directly on the server)
export default async function Dashboard() {
  // 1. Fetch the 5 most recent batches
  const recentBatches = await prisma.batch.findMany({
    take: 5,
    orderBy: { producedAt: 'desc' },
    include: { product: true } // Join with the Product table to get the name
  })

  // 2. Calculate some quick stats
  const pendingCount = recentBatches.filter(b => b.status === 'QC_PENDING').length

  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-5xl mx-auto">
        
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
  <h1 className="text-3xl font-bold text-gray-900">BatchTrace Dashboard</h1>
  <div className="flex gap-3">
    <Link href="/recall">
      <button className="bg-white border border-red-200 text-red-600 px-4 py-2 rounded-lg hover:bg-red-50 transition">
        🚨 Recall Search
      </button>
    </Link>
    
    <Link href="/new-batch">
      <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition">
        + New Batch
      </button>
    </Link>
  </div>
</div>

        {/* KPI Cards (Key Performance Indicators) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h3 className="text-gray-500 text-sm font-medium uppercase">Active Batches</h3>
            <p className="text-3xl font-bold text-gray-900 mt-2">{recentBatches.length}</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h3 className="text-gray-500 text-sm font-medium uppercase">Pending QC</h3>
            <p className="text-3xl font-bold text-orange-600 mt-2">{pendingCount}</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h3 className="text-gray-500 text-sm font-medium uppercase">Compliance</h3>
            <p className="text-3xl font-bold text-green-600 mt-2">100%</p>
          </div>
        </div>

        {/* The Data Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
            <h2 className="font-semibold text-gray-700">Recent Production Runs</h2>
          </div>
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-100 text-sm text-gray-500">
                <th className="p-4 font-medium">Batch Code</th>
                <th className="p-4 font-medium">Product Name</th>
                <th className="p-4 font-medium">Production Date</th>
                <th className="p-4 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {recentBatches.map((batch) => (
                <tr key={batch.id} className="border-b border-gray-100 hover:bg-gray-50 transition">
                  <td className="p-4 font-mono text-blue-600 font-medium">
  <Link href={`/batch/${batch.id}`} className="hover:underline">
    {batch.batchCode}
  </Link>
</td>
                  <td className="p-4 text-gray-800">
                    {batch.product.name}
                  </td>
                  <td className="p-4 text-gray-600">
                    {batch.producedAt.toLocaleDateString()}
                  </td>
                  <td className="p-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      batch.status === 'RELEASED' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {batch.status}
                    </span>
                  </td>
                </tr>
              ))}
              {recentBatches.length === 0 && (
                <tr>
                  <td colSpan={4} className="p-8 text-center text-gray-500">
                    No batches found. Create your first one!
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

      </div>
    </main>
  )
}