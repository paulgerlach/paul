import { NextRequest, NextResponse } from 'next/server';
import { getMetersByLocalId } from '@/api';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const localId = searchParams.get('localId');
    
    if (!localId) {
      return NextResponse.json(
        { error: 'Local ID is required' },
        { status: 400 }
      );
    }

    const meters = await getMetersByLocalId(localId);
    
    return NextResponse.json({ meters });
  } catch (error) {
    console.error('Error fetching meters:', error);
    return NextResponse.json(
      { error: 'Failed to fetch meters' },
      { status: 500 }
    );
  }
}