import { randomUUID } from 'crypto';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' }); 

// Default configuration matching ComStar documentation
export const DEFAULT_CONFIG = {
  // Gateway identity
  devEui: `70B3D5E0500${randomUUID().toString().substring(0, 8)}`.toUpperCase(),
  name: `Mock-Gateway-${Date.now().toString(36)}`,
  
  // MQTT connection
  brokerUrl: process.env.MQTT_BROKER || '',
  username: process.env.MQTT_USERNAME || '',
  password: process.env.MQTT_PASSWORD || '',
  
  // Gateway behavior
  rebootReason: 'power_on',
  firmwareVersion: 'app-nrf9160-wmbus v0.23.8-7+hw3 TZ2',
  bootVersion: 'app-boot-nrf9160-sec v1.8.4',
  
  // Collection schedule (cron format)
  listenCron: 'H 0 0,12 * * *', // Default: noon & midnight
  listenCronDurSec: 30,         // Collection duration
  maxTelegrams: 100,            // Max telegrams per collection
  rndDelay: 300,                // Random upload delay (0-300s)
  
  // Meter filters (empty = all meters)
  devFilter: '',                // Serial number filter
  mFilter: '',                  // Manufacturer filter
  typFilter: '',                // Device type filter
  ciFilter: '',                 // Version filter
  
  // Network settings
  wan: 'lte',                   // 'lte' or 'lorawan'
  useLtem: true,
  useNbiot: false,
  
  // Performance simulation
  collectionInterval: 30000,    // For testing: collect every 30s
  mockTelegramCount: 5,         // Telegrams per collection
  simulateNetworkIssues: false, // Random disconnections
  simulateLowBattery: false,    // Simulate battery voltage drops
};

// Load configuration from file or environment
export function loadConfig(override = {}) {
  const config = { ...DEFAULT_CONFIG, ...override };
  
  // Generate DevEUI if not provided
  if (!config.devEui || config.devEui === DEFAULT_CONFIG.devEui) {
    config.devEui = `70B3D5E0500${randomUUID().toString().substring(0, 12)}`.toUpperCase();
  }
  
  return config;
}

// Configuration for multiple gateways
export const GATEWAY_PROFILES = {
  'residential': {
    name: 'Residential Gateway',
    listenCron: 'H 0 0,6,12,18 * * *', // 4x daily
    maxTelegrams: 50,
    devFilter: '12345678,87654321',
    mFilter: 'EFE,HAG'
  },
  'commercial': {
    name: 'Commercial Gateway',
    listenCron: 'H */2 * * *', // Every 2 hours
    maxTelegrams: 200,
    mFilter: 'KAM,SON'
  },
  'industrial': {
    name: 'Industrial Gateway',
    listenCron: 'H */1 * * *', // Every hour
    maxTelegrams: 1000,
    devFilter: '' // All meters
  }
};