import { NextRequest, NextResponse } from "next/server";
import { broadcastToConnections } from "../../../../lib/demo/connections";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const status = searchParams.get('status'); // 'on' | 'off'
  const device = searchParams.get('device'); // 'pump'
  
  // Validate input parameters
  const validStatuses = ['on', 'off'];
  const validDevices = ['pump', 'wwater', 'heat'];
  
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
  
  // Create device status payload
  const timestamp = new Date().toISOString();
  const data = {
    type: 'device_status',
    device,
    status,
    timestamp,
    message: `Device ${device} is now ${status}`
  };
  
  // Log the webhook call
  console.log(`[WEBHOOK] Shelly ${device} status: ${status} at ${timestamp}`);
  
  // Broadcast to all connected dashboards (SSE)
  await broadcastToConnections(data);
  
  // Return success response to Shelly device
  return NextResponse.json({ 
    success: true, 
    data,
    message: `Webhook received: ${device} ${status}`
  });
}

