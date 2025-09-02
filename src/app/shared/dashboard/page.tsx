import { Suspense } from 'react';
import SharedDashboardClient from './SharedDashboardClient';

export default function SharedDashboardPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="py-6 px-9">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Shared Dashboard</h1>
          <p className="text-gray-600 mt-2">
            Read-only view of consumption data
          </p>
        </div>
        <Suspense fallback={
          <div className="animate-pulse">
            <div className="grid grid-cols-3 gap-2 grid-rows-10">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="bg-gray-200 rounded-2xl h-48"></div>
              ))}
            </div>
          </div>
        }>
          <SharedDashboardClient />
        </Suspense>
      </div>
    </div>
  );
}

