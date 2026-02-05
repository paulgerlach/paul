import { parseSharedUrl, getExpirationInfo, validateShareUrl, validateVerifiedToken } from "@/lib/shareUtils";
import { fetchSharedDashboardData } from "@/lib/sharedDashboardData";
import SharedDashboardWrapper from "./SharedDashboardWrapper";
import { redirect } from "next/navigation";

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

  // SECURITY: Check for valid verified token (PIN verification)
  const verifiedToken = urlSearchParams.get('vt');
  const isVerified = validateVerifiedToken(urlSearchParams, verifiedToken);
  
  if (!isVerified) {
    // Redirect to PIN entry page - preserve original params exactly
    // Only include params that exist (don't add empty ones)
    const verifyParams = new URLSearchParams();
    const meters = urlSearchParams.get('meters');
    const start = urlSearchParams.get('start');
    const end = urlSearchParams.get('end');
    const exp = urlSearchParams.get('exp');
    const c = urlSearchParams.get('c');
    
    if (meters) verifyParams.set('meters', meters);
    if (start) verifyParams.set('start', start);
    if (end) verifyParams.set('end', end);
    if (exp) verifyParams.set('exp', exp);
    if (c) verifyParams.set('c', c);
    
    redirect(`/shared/verify?${verifyParams.toString()}`);
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

  // Fetch data using service role key (bypasses RLS)
  // This allows unauthenticated customers to view shared dashboard data
  // SECURITY: Only fetches meters specified in the validated share link
  const parsedData = await fetchSharedDashboardData(
    filters.meterIds || [],
    filters.startDate,
    filters.endDate
  );
  
  if (!parsedData?.data || parsedData.data.length === 0) {
    return (
      <div className="py-6 px-9 flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Data Unavailable</h1>
          <p className="text-gray-600">Unable to load dashboard data at this time.</p>
          {parsedData.errors.length > 0 && (
            <p className="text-sm text-gray-400 mt-2">Error: {parsedData.errors[0]}</p>
          )}
        </div>
      </div>
    );
  }

  // Filter out header rows (meter ID filtering now done at database level)
  let filteredData = parsedData?.data?.filter((item: any) => item["Device Type"] !== "Device Type");
  
  console.log('Data loaded from database:', {
    totalData: filteredData?.length || 0,
    requestedMeterIds: filters.meterIds?.length || 0
  });

  // Note: Date range filtering is handled by the chart components themselves
  // The charts (WaterChart, HeatingCosts, etc.) filter data based on the dates
  // passed via useChartStore. We don't filter here to avoid double-filtering
  // or filtering out data with different date field formats.
  // The filters.startDate and filters.endDate are passed to SharedDashboardWrapper
  // which sets them in useChartStore for the charts to use.

  // DEVELOPMENT METRICS: Server-side logging (build time)
  console.log('Share Dashboard Access:', {
    timestamp: new Date().toISOString(),
    meterCount: filters.meterIds?.length || 0,
    dateRange: filters.startDate && filters.endDate ? `${filters.startDate} to ${filters.endDate}` : 'All dates',
    dataPoints: filteredData?.length || 0,
    expiresAt: expirationInfo.expiryDate?.toISOString()
  });

  // Create header info
  const headerTitle = "Mieteransicht";

  return (
    <div className="min-h-screen bg-gray-50 max-medium:bg-gray-100">
      {/* Simple Header with Essential Info Only */}
      <div className="bg-white shadow-sm border-b border-black/15">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 max-medium:px-3 py-3 max-medium:py-2">
            <div className="flex items-center justify-between max-medium:flex-col max-medium:items-start max-medium:gap-2">
                <h1 className="text-xl max-medium:text-lg font-bold text-gray-900 flex items-center gap-2">
                    <span className="text-blue-600">📊</span>
                    {headerTitle}
                </h1>
                {expirationInfo.expiryDate && (
                    <div className="inline-flex items-center px-3 py-1 rounded-full bg-orange-100 text-orange-700 text-sm max-medium:text-xs font-medium">
                    ⏰ Läuft ab: {expirationInfo.expiryDate.toLocaleDateString()}
                    </div>
                )}
            </div>
        </div>
      </div>

      {/* Dashboard Content - Compact View */}
      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 max-medium:px-0 py-2 max-medium:py-1 overflow-x-hidden max-medium:max-w-full">
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

