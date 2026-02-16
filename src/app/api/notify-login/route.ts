import { NextResponse } from 'next/server';
import { sendLoginEvent } from '@/utils/webhooks';

/**
 * POST /api/notify-login
 * Triggers Make.com webhook for login events.
 * Must run server-side because MAKE_WEBHOOK_UNIFIED is not exposed to the client.
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const email = body?.email;

    if (!email || typeof email !== 'string') {
      return NextResponse.json(
        { error: 'Email required' },
        { status: 400 }
      );
    }

    await sendLoginEvent(email);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[NOTIFY-LOGIN] Error:', error);
    return NextResponse.json(
      { error: 'Failed to notify' },
      { status: 500 }
    );
  }
}
