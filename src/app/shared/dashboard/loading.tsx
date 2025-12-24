import { Skeleton } from "@/components/Basic/ui/Skeleton";

function ChartCardSkeleton() {
  return (
    <div className="w-full h-full bg-white rounded-xl p-4 flex flex-col gap-3 shadow-sm">
      <Skeleton className="h-5 w-32" />
      <div className="flex-1 relative">
        <Skeleton className="absolute inset-0 rounded-lg" />
      </div>
    </div>
  );
}

export default function Loading() {
  return (
    <div className="min-h-screen bg-gray-50 max-md:bg-gray-100">
      {/* Header Skeleton - matches actual header exactly */}
      <div className="bg-white shadow-sm border-b border-black/15">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 max-md:px-3 py-3 max-md:py-2">
          <div className="flex items-center justify-between max-md:flex-col max-md:items-start max-md:gap-2">
            <div className="flex items-center gap-2">
              <Skeleton className="w-6 h-6 rounded" />
              <Skeleton className="h-7 w-32" />
            </div>
            <Skeleton className="h-7 w-44 rounded-full" />
          </div>
        </div>
      </div>

      {/* Dashboard Content Skeleton - matches SharedDashboardWrapper layout exactly */}
      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 max-md:px-0 py-2 max-md:py-1 overflow-x-hidden max-md:max-w-full">
        <div className="max-w-[1440px] max-2xl:max-w-[1200px] max-xl:max-w-5xl max-md:w-full max-md:mx-0 rounded-2xl max-md:rounded-none px-4 max-md:px-0 border-y-[16px] max-md:border-y-0 border-[#EFEEEC] bg-[#EFEEEC] max-md:bg-transparent w-full mt-6 max-xl:mt-4 max-md:mt-0 mx-auto pb-2 max-md:pb-0">
          <div className="grid gap-3 grid-cols-3 max-lg:grid-cols-2 max-md:grid-cols-1 max-md:gap-2 max-md:p-3">
            
            {/* Column 1 - Kaltwasser + Warmwasser (exact heights from SharedDashboardWrapper) */}
            <div className="flex flex-col gap-3 max-md:gap-2 max-md:w-full">
              <div className="h-[280px] max-md:h-[200px]">
                <ChartCardSkeleton />
              </div>
              <div className="h-[247px] max-md:h-[180px]">
                <ChartCardSkeleton />
              </div>
            </div>

            {/* Column 2 - Stromverbrauch + Heizkosten (exact heights from SharedDashboardWrapper) */}
            <div className="flex flex-col gap-3 max-md:gap-2 max-md:w-full">
              <div className="h-[265px] max-md:h-[180px]">
                <ChartCardSkeleton />
              </div>
              <div className="h-[318px] max-md:h-[200px]">
                <ChartCardSkeleton />
              </div>
            </div>

            {/* Column 3 - Benachrichtigungen + Einsparung (exact heights from SharedDashboardWrapper) */}
            <div className="flex flex-col gap-3 max-md:gap-2 max-md:w-full">
              <div className="h-[360px] max-md:h-[250px]">
                <ChartCardSkeleton />
              </div>
              <div className="h-[220px] max-md:h-[180px]">
                <ChartCardSkeleton />
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
