
import dotenv from 'dotenv';
dotenv.config();

// Validate required environment variables
const requiredEnvVars = [
  'MQTT_BROKER_URL',
  // 'SUPABASE_URL',
  // 'SUPABASE_SERVICE_KEY'
];

for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    console.error(`❌ Missing required environment variable: ${envVar}`);
    process.exit(1);
  }
}

export default {
  // MQTT Configuration
  mqtt: {
    brokerUrl: process.env.MQTT_BROKER_URL,
    username: process.env.MQTT_USERNAME || '',
    password: process.env.MQTT_PASSWORD || '',
    clientId: process.env.MQTT_CLIENT_ID || 'comstar-ingestion',
    
    // Topics to subscribe to
    topics: [
      'LOB/+/up/+',    // All data uplinks
      'LOB/+/req/+'    // All request uplinks (URGENT! Must respond to down topic in < 5secs)
    ],
    
    // QoS settings
    subscribeQos: 1,
    publishQos: 1,
    
    // Connection settings
    keepalive: 60,
    cleanSession: false, // Must match gateway
    reconnectPeriod: 5000
  },
  performance: {
    maxResponseTime: 4500, // 4.5 seconds (under 5s limit)
    batchSize: 50,
    maxConcurrentParses: 10
  },
  gateway: {
    defaultFirmware: 'app-nrf9160-wmbus v0.23.8-7+hw3 TZ2',
    defaultBoot: 'app-boot-nrf9160-sec v1.8.4',
    configTtl: 24 * 60 * 60 * 1000 // 24 hours cache
  }
}