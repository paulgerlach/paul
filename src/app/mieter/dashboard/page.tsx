"use client";

import { useState, useEffect, Suspense, useMemo } from "react";
import { useRouter } from "next/navigation";
import SharedDashboardWrapper from "@/app/shared/dashboard/SharedDashboardWrapper";
import TimeFrameSelector from "./TimeFrameSelector";

// Loading component matching shared dashboard style
function DashboardLoading() {
  return (
    <div className="min-h-screen bg-gray-50 max-md:bg-gray-100">
      {/* Header Skeleton */}
      <div className="bg-white shadow-sm border-b border-black/15">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 max-md:px-3 py-3 max-md:py-2">
          <div className="flex items-center justify-between">
            <div className="h-7 w-48 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-8 w-32 bg-gray-200 rounded animate-pulse"></div>
          </div>
        </div>
      </div>
      
      {/* Dashboard Skeleton */}
      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 max-md:px-0 py-6 max-md:py-3">
        <div className="grid gap-4 grid-cols-3 max-lg:grid-cols-2 max-md:grid-cols-1">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-64 bg-white rounded-xl shadow-sm animate-pulse"></div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Main dashboard content
function DashboardContent() {
  const router = useRouter();
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dashboardData, setDashboardData] = useState<any[]>([]);
  const [tenantInfo, setTenantInfo] = useState<{ email: string; name?: string } | null>(null);
  
  // Time frame state
  const [timeFrame, setTimeFrame] = useState<string>("30days");
  
  // Calculate date range based on time frame
  const dateRange = useMemo(() => {
    const now = new Date();
    const endDate = now.toISOString().split('T')[0];
    let startDate: string;
    
    switch (timeFrame) {
      case "7days":
        const sevenDaysAgo = new Date(now);
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        startDate = sevenDaysAgo.toISOString().split('T')[0];
        break;
      case "30days":
        const thirtyDaysAgo = new Date(now);
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        startDate = thirtyDaysAgo.toISOString().split('T')[0];
        break;
      case "3months":
        const threeMonthsAgo = new Date(now);
        threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);
        startDate = threeMonthsAgo.toISOString().split('T')[0];
        break;
      case "year":
        const oneYearAgo = new Date(now);
        oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
        startDate = oneYearAgo.toISOString().split('T')[0];
        break;
      default:
        const defaultAgo = new Date(now);
        defaultAgo.setDate(defaultAgo.getDate() - 30);
        startDate = defaultAgo.toISOString().split('T')[0];
    }
    
    return { startDate, endDate };
  }, [timeFrame]);

  // Check session and fetch data
  useEffect(() => {
    async function checkSessionAndFetchData() {
      try {
        // Check session first
        const sessionRes = await fetch('/api/tenant/session');
        const sessionData = await sessionRes.json();
        
        if (!sessionRes.ok || !sessionData.authenticated) {
          router.push('/mieter/login');
          return;
        }
        
        setTenantInfo(sessionData.tenant);
        
        // Fetch dashboard data
        const dataRes = await fetch(`/api/tenant/dashboard-data?start=${dateRange.startDate}&end=${dateRange.endDate}`);
        const data = await dataRes.json();
        
        if (!dataRes.ok) {
          throw new Error(data.error || 'Fehler beim Laden der Daten');
        }
        
        setDashboardData(data.data || []);
        setError(null);
      } catch (err: any) {
        console.error('Dashboard error:', err);
        setError(err.message || 'Ein Fehler ist aufgetreten');
      } finally {
        setLoading(false);
      }
    }
    
    checkSessionAndFetchData();
  }, [router, dateRange]);

  // Handle logout
  const handleLogout = async () => {
    try {
      await fetch('/api/tenant/logout', { method: 'POST' });
      router.push('/');
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  // Loading state
  if (loading) {
    return <DashboardLoading />;
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full text-center">
          <div className="text-red-500 text-5xl mb-4">⚠️</div>
          <h1 className="text-xl font-bold text-gray-800 mb-2">Fehler</h1>
          <p className="text-gray-600 mb-6">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-green text-white rounded-lg hover:bg-green/90 transition-colors"
          >
            Erneut versuchen
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 max-md:bg-gray-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-black/15">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 max-md:px-3 py-3 max-md:py-2">
          <div className="flex items-center justify-between max-md:flex-col max-md:items-start max-md:gap-3">
            {/* Left: Title */}
            <div className="flex items-center gap-3">
              <h1 className="text-xl max-md:text-lg font-bold text-gray-900 flex items-center gap-2">
                <span className="text-blue-600">📊</span>
                Mein Verbrauch
              </h1>
              {tenantInfo?.email && (
                <span className="text-sm text-gray-500 max-md:hidden">
                  ({tenantInfo.email})
                </span>
              )}
            </div>
            
            {/* Right: Time selector + Logout */}
            <div className="flex items-center gap-3 max-md:w-full max-md:justify-between">
              <TimeFrameSelector 
                value={timeFrame} 
                onChange={setTimeFrame} 
              />
              <button
                onClick={handleLogout}
                className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
              >
                Abmelden
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Dashboard Content */}
      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 max-md:px-0 py-2 max-md:py-1 overflow-x-hidden max-md:max-w-full">
        {dashboardData.length > 0 ? (
          <SharedDashboardWrapper 
            filteredData={dashboardData} 
            filters={{
              startDate: dateRange.startDate,
              endDate: dateRange.endDate,
              meterIds: undefined
            }}
          />
        ) : (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="text-5xl mb-4">📭</div>
              <h2 className="text-xl font-semibold text-gray-700 mb-2">Keine Daten verfügbar</h2>
              <p className="text-gray-500">
                Für den ausgewählten Zeitraum sind keine Verbrauchsdaten vorhanden.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Page component with Suspense wrapper
export default function MieterDashboardPage() {
  return (
    <Suspense fallback={<DashboardLoading />}>
      <DashboardContent />
    </Suspense>
  );
}
