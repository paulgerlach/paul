import { NextRequest, NextResponse } from "next/server";
import { broadcastToConnections } from "../../../../lib/demo/connections";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const status = searchParams.get('status'); // 'on' | 'off'
  const device = searchParams.get('device'); // 'pump'
  const source = searchParams.get('source') || 'live'; // 'mock' | 'live' - defaults to live for real Shelly devices
  
  // Validate input parameters
  const validStatuses = ['on', 'off'];
  const validDevices = ['pump', 'wwater', 'heat'];
  const validSources = ['mock', 'live'];
  
  if (!status || !device) {
    return NextResponse.json({ 
      error: 'Missing parameters. Required: status (on/off) and device (pump/wwater/heat)' 
    }, { status: 400 });
  }
  
  if (!validStatuses.includes(status) || !validDevices.includes(device)) {
    return NextResponse.json({ 
      error: 'Invalid parameters. Status must be on/off, device must be pump/wwater/heat' 
    }, { status: 400 });
  }
  
  if (!validSources.includes(source)) {
    return NextResponse.json({ 
      error: 'Invalid source. Must be mock or live' 
    }, { status: 400 });
  }
  
  // Create device status payload with proper source identification
  const timestamp = new Date().toISOString();
  const data = {
    type: 'device_status',
    device,
    status,
    timestamp,
    source, // Add explicit source field
    message: source === 'mock' 
      ? `Mock Test: ${device} is now ${status}` 
      : `Shelly Device: ${device} is now ${status}`
  };
  
  // Log the webhook call with source information
  console.log(`[WEBHOOK] ${source.toUpperCase()} ${device} status: ${status} at ${timestamp}`);
  
  // Store status for polling API
  try {
    const baseUrl = process.env.VERCEL_URL 
      ? `https://${process.env.VERCEL_URL}` 
      : 'http://localhost:3000';
    
    await fetch(`${baseUrl}/api/demo/status`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    
    console.log('[WEBHOOK] Status stored for polling');
  } catch (error) {
    console.warn('[WEBHOOK] Failed to update status API:', error);
  }
  
  // Still broadcast to SSE for localhost development
  await broadcastToConnections(data);
  
  // Return success response
  return NextResponse.json({ 
    success: true, 
    data,
    message: `Webhook received: ${source} ${device} ${status}`
  });
}

