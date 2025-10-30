import { NextRequest, NextResponse } from 'next/server';

/**
 * Manual CSV Upload API Route
 * Forwards CSV content to Supabase Edge Function for parsing
 */
export async function POST(request: NextRequest) {
  try {
    // Read raw CSV content from request body
    const csvContent = await request.text();
    
    if (!csvContent || csvContent.trim().length === 0) {
      return NextResponse.json(
        { error: 'No CSV content provided' },
        { status: 400 }
      );
    }

    console.log(`Received CSV upload, size: ${csvContent.length} bytes`);
    
    // Forward to Supabase Edge Function (same function Make.com uses)
    const edgeFunctionUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/csv-parser`;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!edgeFunctionUrl || !serviceRoleKey) {
      console.error('Missing Supabase configuration');
      return NextResponse.json(
        { error: 'Server configuration error' },
        { status: 500 }
      );
    }

    const response = await fetch(edgeFunctionUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${serviceRoleKey}`,
        'Content-Type': 'text/plain'
      },
      body: csvContent
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Edge function error:', errorText);
      return NextResponse.json(
        { error: 'Failed to process CSV', details: errorText },
        { status: response.status }
      );
    }

    const result = await response.json();
    console.log('Upload result:', result);
    
    return NextResponse.json(result);
    
  } catch (error: any) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: 'Upload failed', details: error.message },
      { status: 500 }
    );
  }
}

