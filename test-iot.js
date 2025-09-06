#!/usr/bin/env node

// Simple IoT Mock Test Script
// Usage: node test-iot.js [on|off]

const BASE_URL = 'https://heidisystems-livedemo.vercel.app';

async function testWebhook(status) {
  const url = `${BASE_URL}/api/demo/webhook?status=${status}&device=pump`;
  
  console.log(`🧪 Testing webhook: ${status.toUpperCase()}`);
  console.log(`📡 URL: ${url}`);
  
  try {
    const response = await fetch(url);
    const data = await response.json();
    
    console.log(`✅ Response (${response.status}):`, data);
    
    if (data.success) {
      console.log(`🎉 SUCCESS: ${data.message}`);
    } else {
      console.log(`❌ ERROR: ${data.error || 'Unknown error'}`);
    }
  } catch (error) {
    console.log(`💥 FETCH ERROR:`, error.message);
  }
}

async function runDemo() {
  console.log('🚀 Starting IoT Mock Test Demo\n');
  
  // Test sequence
  await testWebhook('on');
  console.log('\n⏳ Waiting 3 seconds...\n');
  await new Promise(resolve => setTimeout(resolve, 3000));
  
  await testWebhook('off');
  console.log('\n⏳ Waiting 3 seconds...\n');
  await new Promise(resolve => setTimeout(resolve, 3000));
  
  await testWebhook('on');
  
  console.log('\n🎯 Demo complete! Check your dashboard for live updates.');
}

// Parse command line arguments
const status = process.argv[2];

if (status === 'demo') {
  runDemo();
} else if (status === 'on' || status === 'off') {
  testWebhook(status);
} else {
  console.log(`
🧪 IoT Mock Test Script

Usage:
  node test-iot.js on     # Turn pump ON
  node test-iot.js off    # Turn pump OFF  
  node test-iot.js demo   # Run full demo sequence

Examples:
  node test-iot.js on
  node test-iot.js demo
`);
}
