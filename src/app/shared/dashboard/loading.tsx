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
    <div className="min-h-screen bg-gray-50 max-medium:bg-gray-100">
      {/* Header Skeleton - matches actual header exactly */}
      <div className="bg-white shadow-sm border-b border-black/15">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 max-medium:px-3 py-3 max-medium:py-2">
          <div className="flex items-center justify-between max-medium:flex-col max-medium:items-start max-medium:gap-2">
            <div className="flex items-center gap-2">
              <Skeleton className="w-6 h-6 rounded" />
              <Skeleton className="h-7 w-32" />
            </div>
            <Skeleton className="h-7 w-44 rounded-full" />
          </div>
        </div>
      </div>

      {/* Dashboard Content Skeleton - matches SharedDashboardWrapper layout exactly */}
      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 max-medium:px-0 py-2 max-medium:py-1 overflow-x-hidden max-medium:max-w-full">
        <div className="max-w-[1440px] max-2xl:max-w-[1200px] max-xl:max-w-5xl max-medium:w-full max-medium:mx-0 rounded-2xl max-medium:rounded-none px-4 max-medium:px-0 border-y-[16px] max-medium:border-y-0 border-[#EFEEEC] bg-[#EFEEEC] max-medium:bg-transparent w-full mt-6 max-xl:mt-4 max-medium:mt-0 mx-auto pb-2 max-medium:pb-0">
          <div className="grid gap-3 grid-cols-3 max-large:grid-cols-2 max-medium:grid-cols-1 max-medium:gap-2 max-medium:p-3">
            
            {/* Column 1 - Kaltwasser + Warmwasser (exact heights from SharedDashboardWrapper) */}
            <div className="flex flex-col gap-3 max-medium:gap-2 max-medium:w-full">
              <div className="h-[280px] max-medium:h-[200px]">
                <ChartCardSkeleton />
              </div>
              <div className="h-[247px] max-medium:h-[180px]">
                <ChartCardSkeleton />
              </div>
            </div>

            {/* Column 2 - Stromverbrauch + Heizkosten (exact heights from SharedDashboardWrapper) */}
            <div className="flex flex-col gap-3 max-medium:gap-2 max-medium:w-full">
              <div className="h-[265px] max-medium:h-[180px]">
                <ChartCardSkeleton />
              </div>
              <div className="h-[318px] max-medium:h-[200px]">
                <ChartCardSkeleton />
              </div>
            </div>

            {/* Column 3 - Benachrichtigungen + Einsparung (exact heights from SharedDashboardWrapper) */}
            <div className="flex flex-col gap-3 max-medium:gap-2 max-medium:w-full">
              <div className="h-[360px] max-medium:h-[250px]">
                <ChartCardSkeleton />
              </div>
              <div className="h-[220px] max-medium:h-[180px]">
                <ChartCardSkeleton />
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
