import { loadConfig, GATEWAY_PROFILES } from './config.js';
import { MqttClient } from './mqtt-client.js';
import { UplinkScheduler } from './uplink-scheduler.js';
import { TelegramGenerator } from './telegram-generator.js';

class MockComStarGateway {
  constructor(configOverride = {}) {
    // Load configuration
    this.config = loadConfig(configOverride);
    this.mqtt = new MqttClient(this.config);

    this.telegramGenerator = new TelegramGenerator(this.config);
    this.uplinkScheduler = new UplinkScheduler(this);

    // Setup downlink handler
    this.mqtt.on('downlink', (downlink) => {
      this.scheduler.handleDownlink(downlink);
    });
  }


  async start() {
    try {
      // Connect to MQTT broker
      await this.mqtt.connect(); 

      this.uplinkScheduler.start();

      // Log successful start
      console.log(`✅ ${this.config.name} started successfully`);
      console.log(`   Waiting for downlinks on LOB/${this.config.devEui}/down/+`);
      
      // Setup graceful shutdown
      this.setupShutdownHandlers();

      // Periodic status log
      setInterval(() => {
        this.logStatus();
      }, 60000); // Every minute

    } catch (error) {
      console.error(`❌ Failed to start gateway:`, error.message);
      process.exit(1);
    }
  }

  logStatus() {
    const mqttStats = this.mqtt.getStats();
    const schedulerState = this.scheduler.getState();
    
    console.log(`\n📊 ${this.config.name} Status:`);
    console.log(`   Connected: ${mqttStats.isConnected ? '✅' : '❌'}`);
    console.log(`   Uplinks sent: ${mqttStats.uplinksSent}`);
    console.log(`   Downlinks received: ${mqttStats.downlinksReceived}`);
    console.log(`   Telegrams collected: ${schedulerState.collectedTelegrams}`);
    console.log(`   Collections: ${schedulerState.collectionsCompleted}`);
    console.log(`   Queue: ${mqttStats.queueLength} messages`);
    console.log(`   Uptime: ${Math.floor(mqttStats.uptime / 1000)}s`);
  }

  setupShutdownHandlers() {
    // Handle Ctrl+C
    process.on('SIGINT', async () => {
      console.log(`\n🛑 Shutting down ${this.config.name}...`);
      await this.shutdown();
      process.exit(0);
    });
    
    // Handle Docker stop
    process.on('SIGTERM', async () => {
      console.log(`\n🛑 Received SIGTERM for ${this.config.name}...`);
      await this.shutdown();
      process.exit(0);
    });
  }

  async shutdown() {
    console.log(`\n🔌 Disconnecting ${this.config.name}...`);
    
    // Send offline status
    try {
      await this.mqtt.publish('up/status', {
        ...this.scheduler.generateStatusData(),
        vbat: 0, // Indicate shutdown
        collected: false
      });
    } catch (error) {
      // Ignore errors during shutdown
    }
    
    // Disconnect
    this.mqtt.disconnect();
    this.scheduler.stopAllTimers();
    
    console.log(`✅ ${this.config.name} shutdown complete`);
  }
};




async function main() {
  const args = process.argv.slice(2);
  let configOverride = {};
  
  // Parse command line arguments
  args.forEach(async(arg) => {
    if (arg.startsWith('--gateway=')) {
      const profile = arg.split('=')[1];
      if (GATEWAY_PROFILES[profile]) {
        configOverride = GATEWAY_PROFILES[profile];
      }
    } else if (arg.startsWith('--devEui=')) {
      configOverride.devEui = arg.split('=')[1];
    } else if (arg === '--all') {
      // Start multiple gateways
      await startMultipleGateways();
      return;
    }
  });
  
  // Start single gateway
  const gateway = new MockComStarGateway(configOverride);
  await gateway.start();
  
  // Export for testing
  // global.gateway = gateway;
}


// Run if called directly
if (import.meta.url === 'file://' + process.argv[1]) {
  main().catch(console.error);
}

export { MockComStarGateway };