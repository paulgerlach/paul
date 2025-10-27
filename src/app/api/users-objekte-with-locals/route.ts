import { NextRequest, NextResponse } from 'next/server';
import { getObjektsWithLocalsByUserID } from '@/api';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    const objekts = await getObjektsWithLocalsByUserID(userId);
    return NextResponse.json(objekts);
  } catch (error) {
    console.error('Error fetching user objekts with locals:', error);
    return NextResponse.json(
      { error: 'Failed to fetch user objekts with locals' },
      { status: 500 }
    );
  }
}



