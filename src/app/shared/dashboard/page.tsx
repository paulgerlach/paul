import { parseSharedUrl, getExpirationInfo } from '@/lib/shareUtils';
import { parseCSVs } from '@/api';
import SharedDashboardWrapper from './SharedDashboardWrapper';
import QueryProvider from '../../QueryProvider';
import { Toaster } from '@/components/Basic/ui/Sonner';

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
    <QueryProvider>
      <div className="h-screen grid grid-rows-[auto_1fr] bg-base-bg">
        {/* Simple Header with Essential Info Only */}
        <div className="bg-white shadow-sm border-b px-6 py-3">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <span className="text-blue-600">📊</span>
              Dashboard Snapshot
            </h1>
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-orange-100 text-orange-700 text-sm font-medium">
              ⏰ Expires in {expirationInfo.hoursRemaining}h
            </div>
          </div>
        </div>

        {/* Dashboard Content - CLEAN ADMIN LAYOUT */}
        <SharedDashboardWrapper 
          filteredData={filteredData || []} 
          filters={{
            startDate: filters.startDate || undefined,
            endDate: filters.endDate || undefined,
            meterIds: filters.meterIds || undefined
          }}
        />
      </div>
      <Toaster />
    </QueryProvider>
  );
}
