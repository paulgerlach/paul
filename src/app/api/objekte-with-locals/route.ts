import { NextResponse } from 'next/server';
import { getObjektsWithLocals } from '@/api';

export async function GET() {
  try {
    const objekts = await getObjektsWithLocals();
    return NextResponse.json(objekts);
  } catch (error) {
    console.error('Error fetching objekts with locals:', error);
    return NextResponse.json(
      { error: 'Failed to fetch objekts with locals' },
      { status: 500 }
    );
  }
}



