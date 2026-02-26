import { NextRequest, NextResponse } from 'next/server';
import { handleTelegramData } from '@/services/parserService';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { gatewayEui, telegram } = body;

    if (!gatewayEui || !telegram) {
      return NextResponse.json(
        { error: 'Missing required fields: gatewayEui and telegram are required' },
        { status: 400 }
      );
    }

    // Handle both hex string and Buffer-like object formats
    let telegramBuffer: globalThis.Buffer;
    
    if (typeof telegram === 'string') {
      // Hex string format
      console.log('[parse API] Received hex string telegram');
      telegramBuffer = Buffer.from(telegram, 'hex');
    } else if (telegram && telegram.type === 'Buffer' && Array.isArray(telegram.data)) {
      // Buffer-like object format (from JSON/DB storage)
      console.log('[parse API] Received Buffer-like object telegram with', telegram.data.length, 'bytes');
      telegramBuffer = Buffer.from(telegram.data);
    } else {
      return NextResponse.json(
        { error: 'Invalid telegram format: expected hex string or Buffer object' },
        { status: 400 }
      );
    }

    console.log('[parse API] Telegram buffer length:', telegramBuffer.length);

    const result = await handleTelegramData(gatewayEui, telegramBuffer as any);
    return NextResponse.json({ success: true, data: result });
  } catch (error: any) {
    console.error('[parse API] Error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to parse telegram' },
      { status: 500 }
    );
  }
}
