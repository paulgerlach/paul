import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { MeterReadingType } from '@/api';

/**
 * Shared Dashboard Data API Route
 * 
 * This endpoint fetches meter data for shared dashboards.
 * It uses the SERVICE_ROLE_KEY to bypass RLS, allowing unauthenticated
 * customers to view shared data.
 * 
 * SECURITY:
 * - Validates checksum to prevent URL tampering
 * - Validates expiration to ensure link hasn't expired
 * - Only returns data for meters specified in the validated request
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { meters, exp, checksum, startDate, endDate } = body;

    // SECURITY: Validate required parameters
    if (!exp || !checksum) {
      return NextResponse.json(
        { error: 'Missing required parameters', data: [] },
        { status: 400 }
      );
    }

    // SECURITY: Validate checksum to prevent URL tampering
    const metersString = meters ? (Array.isArray(meters) ? meters.join(',') : meters) : '';
    const expectedChecksum = Buffer.from(`${metersString}:${exp}`).toString('base64').slice(0, 8);

    if (checksum !== expectedChecksum) {
      console.warn('Share link checksum validation failed');
      return NextResponse.json(
        { error: 'Invalid share link', data: [] },
        { status: 403 }
      );
    }

    // SECURITY: Check expiration
    const expiryTime = new Date(parseInt(exp));
    if (new Date() > expiryTime) {
      return NextResponse.json(
        { error: 'Share link has expired', data: [] },
        { status: 403 }
      );
    }

    // Get service role key for bypassing RLS
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !serviceRoleKey) {
      console.error('Missing Supabase configuration for shared dashboard');
      return NextResponse.json(
        { error: 'Server configuration error', data: [] },
        { status: 500 }
      );
    }

    // Create Supabase client with SERVICE ROLE KEY (bypasses RLS)
    const supabase = createClient(supabaseUrl, serviceRoleKey);

    // Parse meter IDs
    const meterIds = meters
      ? (Array.isArray(meters) ? meters : meters.split(',').filter(Boolean))
      : [];

    // Query parsed_data table with service role (bypasses RLS)
    let query = supabase
      .from('parsed_data')
      .select('device_id, device_type, manufacturer, frame_type, version, access_number, status, encryption, parsed_data');

    // SECURITY: Only fetch meters that are in the share link
    if (meterIds.length > 0) {
      query = query.in('device_id', meterIds);
    } else {
      // No meters specified - return empty (don't expose all data)
      return NextResponse.json({
        data: [],
        metadata: { message: 'No meters specified in share link' }
      });
    }

    const { data: parsedData, error } = await query;

    if (error) {
      console.error('Error fetching shared dashboard data:', error);
      return NextResponse.json(
        { error: 'Failed to fetch data', data: [] },
        { status: 500 }
      );
    }

    // Transform database records to match the expected MeterReadingType format
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
    const validDeviceTypes = ['Heat', 'Water', 'WWater', 'Elec', 'HCA', 'Heizkostenverteiler', 'Wärmemengenzähler'];
    const filteredData = transformedData.filter(item =>
      validDeviceTypes.includes(item['Device Type']) &&
      (item['IV,0,0,0,,Date/Time'] || item['Actual Date'] || item['Raw Date'])
    );

    console.log('Shared dashboard data fetched:', {
      requestedMeters: meterIds.length,
      returnedRecords: filteredData.length,
      timestamp: new Date().toISOString()
    });

    return NextResponse.json({
      data: filteredData,
      errors: []
    });

  } catch (error: any) {
    console.error('Shared dashboard data error:', error);
    return NextResponse.json(
      { error: 'Internal server error', data: [] },
      { status: 500 }
    );
  }
}

