export default {
  name: 'fw',
  isUrgent: true, // 🚨 MUST respond within 5 seconds!
  
  async handle({ gatewayEui, data, messageNumber }) {
    console.log('🚨 FIRMWARE REQUEST:', {
      gateway: gatewayEui,
      file: data.f,
      chunk: data.c
    });
    
    // Always return success with mock data
    // This keeps the gateway happy while we develop
    
    const response = {
      c: data.c,           // Same chunk number
      t: 100,              // Total chunks (mock)
      a: data.c * 512,     // Address (mock)
      d: '00'.repeat(512)  // Empty data (512 bytes of zeros)
    };
    
    console.log(`✅ Responding with chunk ${data.c}/100`);
    
    return response;
  }
};