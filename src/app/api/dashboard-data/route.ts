import { NextRequest, NextResponse } from 'next/server';
import { MeterReadingType } from '@/api';
import { parseGermanDate } from '@/utils';
import { supabaseServer } from '@/utils/supabase/server';

/**
 * Ideally this would be a GET request, but due to URL length limitations with many meter IDs,
 * we are using POST to send the parameters in the body.
 */
export async function POST(request: NextRequest) {
  try {
    // Parse request body
    const body = await request.json();
    const { meterIds: localMeterIds = [], startDate: startDateParam, endDate: endDateParam, deviceTypes: requestedDeviceTypes = [] } = body;
    
    // Validate parameters - Filter out undefined/null values
    const validMeterIds = Array.isArray(localMeterIds) 
      ? localMeterIds.filter(id => id !== undefined && id !== null && id !== '') 
      : [];
    
    if (!validMeterIds.length) {
      console.warn('[dashboard-data] No valid meter IDs provided:', localMeterIds);
      return NextResponse.json(
        { error: 'No meter IDs provided or invalid format' },
        { status: 400 }
      );
    }

    // Parse date parameters
    let startDate: Date | null = null;
    let endDate: Date | null = null;
    
    if (startDateParam) {
      startDate = new Date(startDateParam);
      if (isNaN(startDate.getTime())) {
        return NextResponse.json(
          { error: 'Invalid start date format' },
          { status: 400 }
        );
      }
    }
    
    if (endDateParam) {
      endDate = new Date(endDateParam);
      if (isNaN(endDate.getTime())) {
        return NextResponse.json(
          { error: 'Invalid end date format' },
          { status: 400 }
        );
      }
    }

    const supabase = await supabaseServer();

    // Use the database function for optimized data fetching
    const { data: parsedData, error } = await supabase.rpc('get_dashboard_data', {
      p_local_meter_ids: validMeterIds.length > 0 ? validMeterIds : null,
      p_device_types: requestedDeviceTypes.length > 0 ? requestedDeviceTypes : null,
      p_start_date: startDate ? startDate.toISOString().split('T')[0] : null,
      p_end_date: endDate ? endDate.toISOString().split('T')[0] : null
    });

    if (error) {
      console.error('[dashboard-data] Database error:', error);
      console.error('[dashboard-data] Request params:', { validMeterIds, requestedDeviceTypes, startDate, endDate });
      return NextResponse.json(
        { error: 'Database query failed', details: error.message },
        { status: 500 }
      );
    }

    if (!parsedData || parsedData.length === 0) {
      return NextResponse.json({
        data: [],
        metadata: {
          totalRecords: 0,
          filteredRecords: 0,
          deviceTypes: {},
          dateRange: null,
          meterIds: [],
          requestedMeterIds: validMeterIds
        }
      });
    }

    // Transform database records to match the expected MeterReadingType format
    const transformedData: MeterReadingType[] = parsedData ? parsedData.map((record: any) => {
      const parsedDataJson = record.parsed_data;

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
        ...parsedDataJson // Include all the original measurement columns
      } as MeterReadingType;
    }) : [];

    // Filter by valid device types and ensure date exists
    // Note: Date filtering is now handled by the database function
    // Support both old format (IV,0,0,0,,Date/Time) and new Engelmann format (Actual Date + Actual Time)
    const validDeviceTypes = [
      // OLD format device types
      'Heat', 'Water', 'WWater', 'Elec',
      // NEW Engelmann format device types
      'Stromzähler', 'Kaltwasserzähler', 'Warmwasserzähler', 'WMZ Rücklauf', 'Heizkostenverteiler'
    ];
    const filteredData = transformedData.filter(item =>
      validDeviceTypes.includes(item['Device Type']) &&
      (item['IV,0,0,0,,Date/Time'] || item['Actual Date'] || item['Raw Date'])
    );

    // Group data by device type for metadata
    const deviceTypes = filteredData.reduce((acc, reading) => {
      const deviceType = reading["Device Type"];
      if (deviceType) {
        acc[deviceType] = (acc[deviceType] || 0) + 1;
      }
      return acc;
    }, {} as Record<string, number>);

    // Determine actual date range from the data
    // Support both old format (IV,0,0,0,,Date/Time) and new Engelmann format (Actual Date or Raw Date)
    const dates = filteredData
      .map((reading) => {
        // Try old format first
        let dateTimeString = reading["IV,0,0,0,,Date/Time"];
        if (dateTimeString) {
          // Ensure it's a string before calling split
          const dateTimeStr = String(dateTimeString);
          const dateString = dateTimeStr.split(" ")[0];
          return parseGermanDate(dateString);
        }
        
        // Try new Engelmann format (Actual Date)
        const actualDate = reading["Actual Date"];
        if (actualDate) {
          return parseGermanDate(actualDate);
        }
        
        // Try Raw Date format (yyyy-mm-dd)
        const rawDate = reading["Raw Date"];
        if (rawDate) {
          // Raw Date is in format "29-10-2025" or "dd-mm-yyyy"
          const parts = rawDate.split("-");
          if (parts.length === 3) {
            return parseGermanDate(`${parts[0]}.${parts[1]}.${parts[2]}`);
          }
        }
        
        return null;
      })
      .filter((date): date is Date => date !== null && !isNaN(date.getTime()))
      .sort((a, b) => a.getTime() - b.getTime());

    const actualDateRange = dates.length > 0 ? {
      start: dates[0].toISOString(),
      end: dates[dates.length - 1].toISOString()
    } : null;

    // Get unique meter IDs from the actual data
    const actualMeterIds = Array.from(new Set(
      filteredData.map(reading => reading.ID).filter(Boolean)
    ));

    return NextResponse.json({
      data: filteredData,
      metadata: {
        totalRecords: transformedData.length,
        filteredRecords: filteredData.length,
        deviceTypes,
        dateRange: actualDateRange,
        meterIds: actualMeterIds,
        requestedMeterIds: validMeterIds,
        filters: {
          startDate: startDate?.toISOString() || null,
          endDate: endDate?.toISOString() || null
        }
      }
    });

  } catch (error) {
    console.error('[dashboard-data] Unexpected error:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error',
        details: process.env.NODE_ENV === 'development' ? (error instanceof Error ? error.message : String(error)) : undefined
      },
      { status: 500 }
    );
  }
}

// Types for the API request and response
export interface DashboardDataRequest {
  meterIds: string[];
  startDate?: string | null;
  endDate?: string | null;
  deviceTypes?: string[];
}

export interface DashboardDataResponse {
  data: MeterReadingType[];
  metadata: {
    totalRecords: number;
    filteredRecords: number;
    deviceTypes: Record<string, number>;
    dateRange: {
      start: string;
      end: string;
    } | null;
    meterIds: string[];
    requestedMeterIds: string[];
    filters: {
      startDate: string | null;
      endDate: string | null;
    };
  };
}
