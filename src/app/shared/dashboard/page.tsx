import { parseSharedUrl, getExpirationInfo } from '@/lib/shareUtils';
import { parseCSVs } from '@/api';
import EinsparungChart from "@/components/Basic/Charts/EinsparungChart";
import GaugeChart from "@/components/Basic/Charts/GaugeChart";
import HeatingCosts from "@/components/Basic/Charts/HeatingCosts";
import NotificationsChart from "@/components/Basic/Charts/NotificationsChart";
import WaterChart from "@/components/Basic/Charts/WaterChart";

export default async function SharedDashboard({ 
  searchParams 
}: { 
  searchParams: Promise<{ [key: string]: string | string[] | undefined }> 
}) {
  const params = await searchParams;
  // Fetch data server-side like other dashboards
  const parsedData = await parseCSVs();
  
  // Convert URLSearchParams-like object to URLSearchParams
  const urlSearchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value) {
      urlSearchParams.set(key, Array.isArray(value) ? value[0] : value);
    }
  });
  
  const filters = parseSharedUrl(urlSearchParams);
  const expirationInfo = getExpirationInfo(filters.expiry);
  
  // Check if link is expired
  if (expirationInfo.isExpired) {
    return (
      <div className="p-6 bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="bg-red-50 border border-red-200 rounded-xl p-8 max-w-md text-center">
          <div className="text-6xl mb-4">⏰</div>
          <h1 className="text-2xl font-bold text-red-800 mb-2">Share Link Expired</h1>
          <p className="text-red-600 mb-4">
            This dashboard share link expired on {expirationInfo.expiresAt?.toLocaleString()}
          </p>
          <p className="text-sm text-red-500">
            Please request a new share link from the dashboard owner.
          </p>
        </div>
      </div>
    );
  }

  const filteredData = parsedData?.data?.filter((item: any) => item["Device Type"] !== "Device Type");
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Clean Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <span className="text-blue-600">📊</span>
                Dashboard Snapshot
              </h1>
              <p className="text-sm text-gray-500 mt-1">Read-only view • Shared dashboard</p>
            </div>
            <div className="text-right">
              <div className="inline-flex items-center px-3 py-1 rounded-full bg-orange-100 text-orange-700 text-sm font-medium">
                ⏰ Expires in {expirationInfo.hoursRemaining}h
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Info Panel */}
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
            <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
            Applied Filters
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="flex items-center gap-2">
              <span className="text-blue-600">📅</span>
              <span className="font-medium text-gray-700">Date Range:</span>
              <span className="text-gray-600">
                {filters.startDate && filters.endDate 
                  ? `${filters.startDate} to ${filters.endDate}`
                  : 'All dates'
                }
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-green-600">📊</span>
              <span className="font-medium text-gray-700">Meters:</span>
              <span className="text-gray-600">
                {filters.meterIds && filters.meterIds.length > 0 
                  ? `${filters.meterIds.length} selected`
                  : 'All meters'
                }
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-purple-600">🔗</span>
              <span className="font-medium text-gray-700">Expires:</span>
              <span className="text-gray-600">
                {expirationInfo.expiresAt?.toLocaleDateString()} at {expirationInfo.expiresAt?.toLocaleTimeString()}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Dashboard Content */}
      <div className="max-w-7xl mx-auto px-6 pb-8">
        <div className="grid grid-cols-3 gap-6 auto-rows-fr">
          <div className="bg-white rounded-lg shadow-sm p-4">
            <WaterChart 
              csvText={filteredData?.filter((item: any) => item["Device Type"] === "Water")} 
              color="#6083CC" 
              title="Kaltwasser" 
              chartType="cold" 
            />
          </div>
          <div className="bg-white rounded-lg shadow-sm p-4">
            <GaugeChart />
          </div>
          <div className="bg-white rounded-lg shadow-sm p-4">
            <NotificationsChart />
          </div>
          <div className="bg-white rounded-lg shadow-sm p-4">
            <HeatingCosts csvText={filteredData?.filter((item: any) => item["Device Type"] === "Heat")} />
          </div>
          <div className="bg-white rounded-lg shadow-sm p-4">
            <WaterChart 
              csvText={filteredData?.filter((item: any) => item["Device Type"] === "WWater")} 
              color="#E74B3C" 
              title="Warmwasser" 
              chartType="hot" 
            />
          </div>
          <div className="bg-white rounded-lg shadow-sm p-4">
            <EinsparungChart />
          </div>
        </div>
      </div>
    </div>
  );
}
