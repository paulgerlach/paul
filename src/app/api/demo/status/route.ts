import { NextRequest, NextResponse } from "next/server";

// In-memory storage for device status (in production, use Redis or database)
let deviceStatuses: Record<string, {
  device: string;
  status: 'on' | 'off';
  timestamp: string;
  message: string;
  source: 'mock' | 'live';
}> = {};

export async function GET() {
  try {
    // Return current device statuses
    const devices = Object.values(deviceStatuses);
    
    return NextResponse.json({
      success: true,
      devices,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('[STATUS API] Error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to get device status' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    
    // Update device status (called by webhook)
    if (data.device && data.status) {
      deviceStatuses[data.device] = {
        device: data.device,
        status: data.status,
        timestamp: data.timestamp || new Date().toISOString(),
        message: data.message || `${data.device} is ${data.status}`,
        source: data.source || 'live'
      };
      
      console.log('[STATUS API] Updated device:', deviceStatuses[data.device]);
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[STATUS API] Error updating status:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update device status' },
      { status: 500 }
    );
  }
}