import { NextRequest, NextResponse } from 'next/server';
import { getMetersByLocalIds } from '@/api';

export async function POST(request: NextRequest) {
  try {
    const { localIds } = await request.json();
    
    if (!localIds || !Array.isArray(localIds)) {
      return NextResponse.json(
        { error: 'Local IDs array is required' },
        { status: 400 }
      );
    }

    const meters = await getMetersByLocalIds(localIds);
    
    return NextResponse.json({ meters });
  } catch (error) {
    console.error('Error fetching meters:', error);
    return NextResponse.json(
      { error: 'Failed to fetch meters' },
      { status: 500 }
    );
  }
}