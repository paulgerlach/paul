import { parseCSVs } from "@/api";
import { parseSharedUrl, getExpirationInfo, validateShareUrl } from "@/lib/shareUtils";
import SharedDashboardWrapper from "./SharedDashboardWrapper";

interface SharedDashboardPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function SharedDashboardPage({ searchParams }: SharedDashboardPageProps) {
  const urlSearchParams = new URLSearchParams();
  const resolvedSearchParams = await searchParams;
  
  // Convert searchParams to URLSearchParams
  Object.entries(resolvedSearchParams).forEach(([key, value]) => {
    if (value) {
      const stringValue = Array.isArray(value) ? value[0] : value;
      urlSearchParams.set(key, stringValue);
    }
  });

  // SECURITY: Validate URL checksum first
  if (!validateShareUrl(urlSearchParams)) {
    return (
      <div className="py-6 px-9 flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Invalid Share Link</h1>
          <p className="text-gray-600">This share link has been tampered with or is invalid.</p>
        </div>
      </div>
    );
  }

  // SECURITY: Parse and validate shared URL parameters
  let filters;
  let expirationInfo;
  try {
    filters = parseSharedUrl(urlSearchParams);
    expirationInfo = getExpirationInfo(filters.expiry);
  } catch (error) {
    return (
      <div className="py-6 px-9 flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Invalid Share Link</h1>
          <p className="text-gray-600">The share link appears to be malformed or corrupted.</p>
        </div>
      </div>
    );
  }

  // SECURITY: Check if link has expired
  if (expirationInfo.isExpired) {
    return (
      <div className="py-6 px-9 flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Share Link Expired</h1>
          <p className="text-gray-600">
            This share link expired on {expirationInfo.expiryDate?.toLocaleString()}
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Please request a new share link from the dashboard owner.
          </p>
        </div>
      </div>
    );
  }

  // Fetch all data (same as admin dashboard)
  const parsedData = await parseCSVs();
  
  if (!parsedData?.data) {
    return (
      <div className="py-6 px-9 flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Data Unavailable</h1>
          <p className="text-gray-600">Unable to load dashboard data at this time.</p>
        </div>
      </div>
    );
  }

  // Filter out header rows
  let filteredData = parsedData?.data?.filter((item: any) => item["Device Type"] !== "Device Type");
  
  // Debug: Log the data before filtering
  console.log('Before meter filtering:', {
    totalData: filteredData?.length || 0,
    filterMeterIds: filters.meterIds
  });
  
  // Only filter by meter IDs if they are specified in the URL
  // If no meter IDs, show ALL data (property owner shared everything)
  if (filters.meterIds && filters.meterIds.length > 0) {
    const beforeLength = filteredData?.length || 0;
    filteredData = filteredData?.filter((item: any) =>
      filters.meterIds!.includes(item["ID"]) ||
      filters.meterIds!.includes(item["Access Number"]?.toString())
    );
    
    console.log('After meter filtering:', {
      beforeLength,
      afterLength: filteredData?.length || 0
    });
  } else {
    console.log('No meter filtering - showing all data');
  }

  // NOTE: Following main dashboard pattern - no date filtering
  // The main dashboard shows all available data, so shared dashboard should too
  // Date filtering is handled by the individual chart components if needed
  console.log('Following main dashboard pattern - no server-side date filtering applied');

  // DEVELOPMENT METRICS: Server-side logging (build time)
  console.log('Share Dashboard Access:', {
    timestamp: new Date().toISOString(),
    meterCount: filters.meterIds?.length || 0,
    dateRange: filters.startDate && filters.endDate ? `${filters.startDate} to ${filters.endDate} (URL params only)` : 'All dates',
    dataPoints: filteredData?.length || 0,
    expiresAt: expirationInfo.expiryDate?.toISOString(),
    note: 'Following main dashboard pattern - charts handle their own date filtering'
  });

  // Create header info
  const meterCount = filters.meterIds?.length || 0;
  const headerTitle = meterCount > 0 
    ? `Tenant View (${meterCount} meter${meterCount === 1 ? '' : 's'})`
    : "Tenant View";

  return (
    <div className="min-h-screen bg-gray-50 max-md:bg-gray-100">
      {/* Simple Header with Essential Info Only */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 max-md:px-3 py-3 max-md:py-2">
            <div className="flex items-center justify-between max-md:flex-col max-md:items-start max-md:gap-2">
                <h1 className="text-xl max-md:text-lg font-bold text-gray-900 flex items-center gap-2">
                    <span className="text-blue-600">📊</span>
                    {headerTitle}
                </h1>
                {expirationInfo.expiryDate && (
                    <div className="inline-flex items-center px-3 py-1 rounded-full bg-orange-100 text-orange-700 text-sm max-md:text-xs font-medium">
                    ⏰ Expires: {expirationInfo.expiryDate.toLocaleDateString()}
                    </div>
                )}
            </div>
        </div>
      </div>

      {/* Dashboard Content - Compact View */}
      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 max-md:px-0 py-2 max-md:py-1 overflow-x-hidden max-md:max-w-full">
        <SharedDashboardWrapper 
            filteredData={filteredData || []} 
            filters={{
            startDate: filters.startDate || undefined,
            endDate: filters.endDate || undefined,
            meterIds: filters.meterIds || undefined
            }}
        />
      </div>
    </div>
  );
}

