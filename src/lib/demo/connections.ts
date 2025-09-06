// Shared SSE connections store
// In production, use Redis or similar for multi-instance support
export const connections = new Set<ReadableStreamDefaultController>();

// Broadcast function to send data to all connected clients
export async function broadcastToConnections(data: any) {
  const encoder = new TextEncoder();
  const message = `data: ${JSON.stringify(data)}\n\n`;
  
  connections.forEach(controller => {
    try {
      controller.enqueue(encoder.encode(message));
    } catch (error) {
      console.warn('Error broadcasting to connection:', error);
      connections.delete(controller);
    }
  });
}
