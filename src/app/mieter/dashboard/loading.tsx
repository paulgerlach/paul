export default function DashboardLoading() {
  return (
    <div className="min-h-screen bg-gray-50 max-md:bg-gray-100">
      {/* Header Skeleton */}
      <div className="bg-white shadow-sm border-b border-black/15">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 max-md:px-3 py-3 max-md:py-2">
          <div className="flex items-center justify-between">
            <div className="h-7 w-48 bg-gray-200 rounded animate-pulse"></div>
            <div className="flex items-center gap-3">
              <div className="h-10 w-40 bg-gray-200 rounded-lg animate-pulse"></div>
              <div className="h-10 w-24 bg-gray-200 rounded-lg animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Dashboard Skeleton */}
      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 max-md:px-3 py-6 max-md:py-3">
        <div className="rounded-2xl max-md:rounded-none px-4 max-md:px-0 border-y-[16px] max-md:border-y-0 border-[#EFEEEC] bg-[#EFEEEC] max-md:bg-transparent w-full">
          <div className="grid gap-3 grid-cols-3 max-lg:grid-cols-2 max-md:grid-cols-1 max-md:gap-2 max-md:p-3">
            {/* Column 1 */}
            <div className="flex flex-col gap-3">
              <div className="h-[280px] max-md:h-[200px] bg-white rounded-xl animate-pulse"></div>
              <div className="h-[247px] max-md:h-[180px] bg-white rounded-xl animate-pulse"></div>
            </div>
            
            {/* Column 2 */}
            <div className="flex flex-col gap-3">
              <div className="h-[265px] max-md:h-[180px] bg-white rounded-xl animate-pulse"></div>
              <div className="h-[318px] max-md:h-[200px] bg-white rounded-xl animate-pulse"></div>
            </div>
            
            {/* Column 3 */}
            <div className="flex flex-col gap-3 max-lg:col-span-2 max-md:col-span-1">
              <div className="h-[360px] max-md:h-[250px] bg-white rounded-xl animate-pulse"></div>
              <div className="h-[220px] max-md:h-[180px] bg-white rounded-xl animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
