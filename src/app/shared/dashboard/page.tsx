import { parseSharedUrl, getExpirationInfo } from '@/lib/shareUtils';
import { parseCSVs } from '@/api';
import EinsparungChart from "@/components/Basic/Charts/EinsparungChart";
import GaugeChart from "@/components/Basic/Charts/GaugeChart";
import HeatingCosts from "@/components/Basic/Charts/HeatingCosts";
import NotificationsChart from "@/components/Basic/Charts/NotificationsChart";
import WaterChart from "@/components/Basic/Charts/WaterChart";

export default async function SharedDashboard({ searchParams }: { searchParams: { [key: string]: string | string[] | undefined } }) {
  // Fetch data server-side like other dashboards
  const parsedData = await parseCSVs();
  
  // Convert URLSearchParams-like object to URLSearchParams
  const urlSearchParams = new URLSearchParams();
  Object.entries(searchParams).forEach(([key, value]) => {
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
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">📤 Shared Dashboard</h1>
        <div className="text-gray-600 space-y-1">
          <p>🔒 Read-only view - data snapshot shared by dashboard owner</p>
          <div className="bg-blue-50 p-3 rounded-lg">
            <h3 className="font-medium text-blue-800">Applied Filters:</h3>
            <div className="text-sm text-blue-600">
              {filters.startDate && filters.endDate ? (
                <p>📅 Date Range: {filters.startDate} to {filters.endDate}</p>
              ) : (
                <p>📅 All dates (no date filter applied)</p>
              )}
              {filters.meterIds && filters.meterIds.length > 0 ? (
                <p>📊 Specific meters: {filters.meterIds.length} selected</p>
              ) : (
                <p>📊 All meters (no meter filter applied)</p>
              )}
              {expirationInfo.expiresAt && (
                <p className="text-orange-600 font-medium">
                  ⏰ Link expires in {expirationInfo.hoursRemaining} hour{expirationInfo.hoursRemaining !== 1 ? 's' : ''} 
                  ({expirationInfo.expiresAt.toLocaleString()})
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-3 gap-2 grid-rows-10 max-h-[90vh]">
        <WaterChart csvText={filteredData?.filter((item: any) => item["Device Type"] === "Water")} color="#6083CC" title="Kaltwasser" chartType="cold" />
        <GaugeChart />
        <NotificationsChart />
        <HeatingCosts csvText={filteredData?.filter((item: any) => item["Device Type"] === "Heat")} />
        <WaterChart csvText={filteredData?.filter((item: any) => item["Device Type"] === "WWater")} color="#E74B3C" title="Warmwasser" chartType="hot" />
        <EinsparungChart />
      </div>
    </div>
  );
}
