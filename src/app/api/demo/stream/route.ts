import { NextRequest } from 'next/server';
import { connections } from '../../../../lib/demo/connections';

export async function GET(request: NextRequest) {
  // Create SSE stream
  const stream = new ReadableStream({
    start(controller) {
      // Add this connection to the set
      connections.add(controller);
      
      // Send initial connection confirmation
      const encoder = new TextEncoder();
      const welcomeMessage = {
        type: 'connected',
        message: 'Connected to IoT demo stream',
        timestamp: new Date().toISOString()
      };
      
      controller.enqueue(encoder.encode(`data: ${JSON.stringify(welcomeMessage)}\n\n`));
      
      console.log('[SSE] New client connected to demo stream');
      
      // Send heartbeat every 8 seconds to prevent timeout
      const heartbeat = setInterval(() => {
        try {
          const heartbeatMessage = {
            type: 'heartbeat',
            timestamp: new Date().toISOString()
          };
          controller.enqueue(encoder.encode(`data: ${JSON.stringify(heartbeatMessage)}\n\n`));
        } catch (error) {
          console.warn('[SSE] Heartbeat failed:', error);
          clearInterval(heartbeat);
        }
      }, 8000);
      
      // Set up cleanup on disconnect
      const cleanup = () => {
        connections.delete(controller);
        clearInterval(heartbeat);
        console.log('[SSE] Client disconnected from demo stream');
      };
      
      // Handle client disconnect
      request.signal?.addEventListener('abort', cleanup);
      
      // Auto-cleanup after 10 seconds (Vercel serverless limit)
      const timeout = setTimeout(() => {
        cleanup();
        try {
          controller.close();
        } catch (error) {
          console.warn('Error closing SSE connection:', error);
        }
      }, 10000);
      
      // Clear timeout if connection closes normally
      request.signal?.addEventListener('abort', () => {
        clearTimeout(timeout);
      });
    },
    
    cancel(controller) {
      connections.delete(controller);
      console.log('[SSE] Connection cancelled');
    }
  });
  
  // Return SSE response
  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache, no-transform',
      'Connection': 'keep-alive',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET',
      'Access-Control-Allow-Headers': 'Cache-Control',
    },
  });
}

