import { createClient } from '@supabase/supabase-js';
import { MeterReadingType } from '@/api';

/**
 * Fetches meter data for shared dashboards using the SERVICE_ROLE_KEY.
 * This bypasses RLS, allowing unauthenticated customers to view shared data.
 * 
 * APPROACH:
 * The share link contains local_meters.id values. However, parsed_data.local_meter_id
 * linkage is sometimes broken (especially for auto-generated heat meters).
 * 
 * To ensure we get ALL device types, we:
 * 1. Look up meter_number from local_meters for the share link IDs
 * 2. Query parsed_data by device_id matching those meter numbers
 * 
 * This bypasses the broken local_meter_id linkage and fetches data reliably.
 * 
 * SECURITY:
 * - Should only be called AFTER validating checksum and expiration
 * - Only fetches meters specified in the meterIds array
 * - Never exposes service role key to client
 */
export async function fetchSharedDashboardData(
  meterIds: string[],
  startDate?: string,
  endDate?: string
): Promise<{
  data: MeterReadingType[];
  errors: string[];
}> {
  console.log('[SharedDashboard] Starting data fetch for meters:', meterIds.length, 'dateRange:', startDate, 'to', endDate);
  
  // Safety check: if no meters specified, return empty
  if (!meterIds || meterIds.length === 0) {
    console.log('[SharedDashboard] No meter IDs provided');
    return {
      data: [],
      errors: ['No meters specified in share link']
    };
  }

  // Get service role key for bypassing RLS
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    console.error('[SharedDashboard] Missing Supabase configuration!');
    return {
      data: [],
      errors: ['Server configuration error - missing env vars']
    };
  }

  try {
    // Create Supabase client with SERVICE ROLE KEY (bypasses RLS)
    const supabase = createClient(supabaseUrl, serviceRoleKey);

    // STEP 1: Get apartment IDs (local_id) from the share link's meter IDs
    // Then get ALL meters for those apartments to ensure we include all device types
    console.log('[SharedDashboard] Looking up apartments for', meterIds.length, 'meter IDs');
    
    const { data: shareMeters, error: metersError } = await supabase
      .from('local_meters')
      .select('id, meter_number, meter_type, local_id')
      .in('id', meterIds);

    if (metersError) {
      console.error('[SharedDashboard] Error fetching local_meters:', metersError);
      return {
        data: [],
        errors: [metersError.message]
      };
    }

    if (!shareMeters || shareMeters.length === 0) {
      console.log('[SharedDashboard] No meters found for provided IDs');
      return {
        data: [],
        errors: ['No meters found for the specified IDs']
      };
    }

    // Get unique apartment IDs from the shared meters
    const apartmentIds = [...new Set(
      shareMeters
        .map(m => m.local_id)
        .filter((id): id is string => id !== null && id !== undefined)
    )];
    
    console.log('[SharedDashboard] Found', shareMeters.length, 'meters from', apartmentIds.length, 'apartments');
    
    // Log meter type breakdown from share link
    const shareMeterTypes = shareMeters.reduce((acc, m) => {
      const type = m.meter_type || 'unknown';
      acc[type] = (acc[type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    console.log('[SharedDashboard] Meter types in share link:', shareMeterTypes);

    // STEP 1b: Get ALL meters for those apartments (including Water, Heat, etc.)
    const { data: allApartmentMeters, error: allMetersError } = await supabase
      .from('local_meters')
      .select('id, meter_number, meter_type')
      .in('local_id', apartmentIds);

    if (allMetersError) {
      console.error('[SharedDashboard] Error fetching all apartment meters:', allMetersError);
      // Fall back to just the share link meters
    }

    // Combine: use all apartment meters if available, otherwise use share link meters
    const localMeters = allApartmentMeters || shareMeters;
    
    // Extract meter numbers (serial numbers) and filter out nulls
    const meterNumbers = localMeters
      .map(m => m.meter_number)
      .filter((num): num is string => num !== null && num !== undefined && num !== '');

    // Also get all meter IDs for the local_meter_id query
    const allMeterIds = localMeters.map(m => m.id);

    console.log('[SharedDashboard] Expanded to', localMeters.length, 'total meters,', meterNumbers.length, 'with serial numbers');
    
    // Log meter type breakdown for all meters
    const meterTypeBreakdown = localMeters.reduce((acc, m) => {
      const type = m.meter_type || 'unknown';
      acc[type] = (acc[type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    console.log('[SharedDashboard] ALL meter types for apartments:', meterTypeBreakdown);

    if (meterNumbers.length === 0) {
      console.log('[SharedDashboard] No valid meter numbers found');
      return {
        data: [],
        errors: ['No meter serial numbers found']
      };
    }

    // STEP 2: Query parsed_data using HYBRID approach
    // - Some meters (like Heat) have broken local_meter_id linkage, so we query by device_id
    // - Some meters (like Water) have working local_meter_id linkage
    // We query BOTH ways and combine results to catch all cases
    
    // CRITICAL FIX: Adjust start date -7 days to get baseline readings for consumption calculation
    // This matches what useChartData.ts does for the main dashboard
    // Without this, consumption = current - previous will be incorrect due to missing baseline
    let adjustedStartDate = startDate;
    if (startDate) {
      const date = new Date(startDate);
      date.setDate(date.getDate() - 7);
      adjustedStartDate = date.toISOString().split('T')[0];
    }
    
    console.log('[SharedDashboard] Querying parsed_data with triple-hybrid approach:');
    console.log('  - device_ids (meter_numbers):', meterNumbers.length);
    console.log('  - local_meter_ids (all apartment meters):', allMeterIds.length);
    console.log('  - adjustedStartDate:', adjustedStartDate, '(original:', startDate, ')');
    
    // Query each device type separately using RPC to ensure we get all data
    // This avoids issues with Supabase's row limits affecting which types are returned
    const deviceTypesToFetch = [
      ['Water', 'Kaltwasserzähler'],
      ['WWater', 'Warmwasserzähler'],
      ['Elec', 'Stromzähler'],
      ['Heat', 'WMZ Rücklauf', 'Heizkostenverteiler', 'Wärmemengenzähler']
    ];

    let allRpcData: any[] = [];
    
    for (const deviceTypes of deviceTypesToFetch) {
      const { data, error } = await supabase.rpc('get_dashboard_data', {
        p_local_meter_ids: allMeterIds,
        p_device_types: deviceTypes,
        p_start_date: adjustedStartDate || null,
        p_end_date: endDate || null
      });
      
      if (error) {
        console.error(`[SharedDashboard] RPC error for ${deviceTypes[0]}:`, error.message);
      } else {
        console.log(`[SharedDashboard] RPC ${deviceTypes[0]} - rows:`, data?.length || 0);
        allRpcData = [...allRpcData, ...(data || [])];
      }
    }
    
    console.log('[SharedDashboard] Total RPC rows:', allRpcData.length);
    
    // Log RPC device types
    const rpcDeviceTypes = allRpcData.reduce((acc: Record<string, number>, record: any) => {
      const type = record.device_type || 'unknown';
      acc[type] = (acc[type] || 0) + 1;
      return acc;
    }, {});
    console.log('[SharedDashboard] RPC device types:', rpcDeviceTypes);

    // Query 2: By device_id matching meter_number (backup for meters with broken local_meter_id)
    // CRITICAL: Must use same date filter as RPC query to avoid fetching extra historical data
    let backupQuery = supabase
      .from('parsed_data')
      .select('id, local_meter_id, frame_type, manufacturer, device_id, version, device_type, access_number, status, encryption, parsed_data, updated_at')
      .in('device_id', meterNumbers);
    
    // Apply same date filters as RPC query
    if (adjustedStartDate) {
      backupQuery = backupQuery.gte('updated_at', adjustedStartDate);
    }
    if (endDate) {
      backupQuery = backupQuery.lte('updated_at', endDate + 'T23:59:59');
    }
    
    const { data: dataByDeviceId, error: error1 } = await backupQuery.limit(10000);

    if (error1) {
      console.error('[SharedDashboard] Query by device_id error:', error1);
    }
    console.log('[SharedDashboard] Query by device_id - rows:', dataByDeviceId?.length || 0);

    // Combine RPC results + device_id results and deduplicate by id
    const allData = [...allRpcData, ...(dataByDeviceId || [])];
    const seenIds = new Set<string>();
    const parsedData = allData.filter(record => {
      if (seenIds.has(record.id)) return false;
      seenIds.add(record.id);
      return true;
    });

    console.log('[SharedDashboard] Combined unique rows:', parsedData.length);

    // Check if we got any data
    if (!parsedData || parsedData.length === 0) {
      console.log('[SharedDashboard] No data returned from queries');
      return {
        data: [],
        errors: ['No data found for the specified meters']
      };
    }

    // Log raw device type breakdown
    const rawDeviceTypeBreakdown = parsedData.reduce((acc, record) => {
      const type = record.device_type || 'unknown';
      acc[type] = (acc[type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    console.log('[SharedDashboard] Device types in RAW data:', rawDeviceTypeBreakdown);

    // Transform database records to match the expected MeterReadingType format
    // Same transformation as /api/dashboard-data/route.ts
    const transformedData: MeterReadingType[] = (parsedData || []).map((record: any) => {
      const parsedDataJson = record.parsed_data || {};

      return {
        'Frame Type': record.frame_type || parsedDataJson['Frame Type'] || '',
        'Manufacturer': record.manufacturer || parsedDataJson['Manufacturer'] || '',
        'ID': record.device_id,
        'Version': record.version || parsedDataJson['Version'] || '',
        'Device Type': record.device_type,
        'TPL-Config': parsedDataJson['TPL-Config'] || '',
        'Access Number': record.access_number || parsedDataJson['Access Number'] || 0,
        'Status': record.status || parsedDataJson['Status'] || '',
        'Encryption': record.encryption || parsedDataJson['Encryption'] || 0,
        ...parsedDataJson
      } as MeterReadingType;
    });

    // Filter by valid device types and ensure date exists
    // Same logic as /api/dashboard-data/route.ts
    const validDeviceTypes = [
      // OLD format device types
      'Heat', 'Water', 'WWater', 'Elec',
      // NEW Engelmann format device types
      'Stromzähler', 'Kaltwasserzähler', 'Warmwasserzähler', 
      'WMZ Rücklauf', 'Heizkostenverteiler', 'Wärmemengenzähler'
    ];
    const filteredData = transformedData.filter(item =>
      validDeviceTypes.includes(item['Device Type']) &&
      (item['IV,0,0,0,,Date/Time'] || item['Actual Date'] || item['Raw Date'])
    );
    
    // Log device type breakdown for debugging
    const deviceTypeBreakdown = filteredData.reduce((acc, item) => {
      const type = item['Device Type'] || 'unknown';
      acc[type] = (acc[type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    console.log('[SharedDashboard] Device types AFTER filtering:', deviceTypeBreakdown);
    console.log('[SharedDashboard] Total records:', filteredData.length);

    return {
      data: filteredData,
      errors: []
    };

  } catch (error: any) {
    console.error('Shared dashboard data error:', error);
    return {
      data: [],
      errors: [error.message || 'Unknown error']
    };
  }
}

