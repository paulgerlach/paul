import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import {
  verifySessionToken,
  getTenantMeterIds,
  TENANT_SESSION_COOKIE,
} from '@/lib/tenantAuth';
import { fetchSharedDashboardData } from '@/lib/sharedDashboardData';

/**
 * GET /api/tenant/dashboard-data
 * Fetch meter data for authenticated tenant
 */
export async function GET(request: NextRequest) {
  try {
    // Check authentication
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get(TENANT_SESSION_COOKIE);

    if (!sessionCookie?.value) {
      return NextResponse.json(
        { success: false, error: 'Nicht authentifiziert' },
        { status: 401 }
      );
    }

    const session = verifySessionToken(sessionCookie.value);

    if (!session) {
      return NextResponse.json(
        { success: false, error: 'Sitzung abgelaufen' },
        { status: 401 }
      );
    }

    // Get query parameters
    const { searchParams } = new URL(request.url);
    const startDate = searchParams.get('start') || undefined;
    const endDate = searchParams.get('end') || undefined;

    // Get tenant's meter IDs
    const meterIds = await getTenantMeterIds(session.tenantId);

    if (!meterIds || meterIds.length === 0) {
      return NextResponse.json({
        success: true,
        data: [],
        message: 'Keine Zähler gefunden',
      });
    }

    // Fetch dashboard data using the shared function
    const { data, errors } = await fetchSharedDashboardData(
      meterIds,
      startDate,
      endDate
    );

    if (errors.length > 0) {
      console.error('Tenant dashboard data errors:', errors);
    }

    return NextResponse.json({
      success: true,
      data,
      meterCount: meterIds.length,
    });

  } catch (error) {
    console.error('Tenant dashboard data error:', error);
    return NextResponse.json(
      { success: false, error: 'Ein Fehler ist aufgetreten' },
      { status: 500 }
    );
  }
}
